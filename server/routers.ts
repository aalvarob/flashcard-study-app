import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

const flashcardSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  area: z.string().min(1, "Area is required"),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Flashcard management (admin only)
  flashcards: router({
    // Get all flashcards (public)
    list: publicProcedure.query(async () => {
      return db.getAllFlashcards();
    }),

    // Create new flashcard (public for now)
    create: publicProcedure
      .input(flashcardSchema)
      .mutation(async ({ input }) => {
        return db.createFlashcard({
          question: input.question,
          answer: input.answer,
          area: input.area,
          createdBy: 0,
        });
      }),

    // Update flashcard (public for now)
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          question: z.string().min(1, "Question is required"),
          answer: z.string().min(1, "Answer is required"),
          area: z.string().min(1, "Area is required"),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateFlashcard(input.id, {
          question: input.question,
          answer: input.answer,
          area: input.area,
        });
        return { success: true };
      }),

    // Delete flashcard (public for now)
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFlashcard(input.id);
        return { success: true };
      }),

    // Get single flashcard
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFlashcardById(input.id);
      }),

    // Fix area mapping (temporary endpoint)
    fixAreas: publicProcedure.mutation(async () => {
      return db.fixAreaMapping();
    }),
  }),

  // Flashcard progress and study tracking
  progress: router({
    // Sync flashcard progress (protected)
    syncProgress: protectedProcedure
      .input(
        z.object({
          flashcardId: z.string(),
          area: z.string(),
          enabled: z.boolean(),
          correctCount: z.number().int().min(0),
          wrongCount: z.number().int().min(0),
          notSureCount: z.number().int().min(0),
          notRememberCount: z.number().int().min(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.upsertFlashcardProgress({
          userId: ctx.user.id,
          flashcardId: input.flashcardId,
          area: input.area,
          enabled: input.enabled ? 1 : 0,
          correctCount: input.correctCount,
          wrongCount: input.wrongCount,
          notSureCount: input.notSureCount,
          notRememberCount: input.notRememberCount,
          lastAnsweredAt: new Date(),
        });
        return { success: true };
      }),

    // Get user progress (protected)
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserFlashcardProgress(ctx.user.id);
    }),

    // Get progress by area (protected)
    getProgressByArea: protectedProcedure
      .input(z.object({ area: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getFlashcardProgressByArea(ctx.user.id, input.area);
      }),

    // Get user stats by area (protected)
    getStatsByArea: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStatsByArea(ctx.user.id);
    }),
  }),

  // Study sessions
  sessions: router({
    // Create study session (protected)
    create: protectedProcedure
      .input(
        z.object({
          candidateName: z.string(),
          area: z.string(),
          cardsPerArea: z.number().int().min(1),
          totalCards: z.number().int().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const sessionId = await db.createStudySession({
          userId: ctx.user.id,
          candidateName: input.candidateName,
          area: input.area,
          cardsPerArea: input.cardsPerArea,
          totalCards: input.totalCards,
        });
        return { sessionId, success: true };
      }),

    // Update study session (protected)
    update: protectedProcedure
      .input(
        z.object({
          sessionId: z.number().int(),
          correctCount: z.number().int().min(0).optional(),
          wrongCount: z.number().int().min(0).optional(),
          notSureCount: z.number().int().min(0).optional(),
          notRememberCount: z.number().int().min(0).optional(),
          completedAt: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = await db.getStudySessionById(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          throw new Error("Session not found or unauthorized");
        }

        await db.updateStudySession(input.sessionId, {
          correctCount: input.correctCount,
          wrongCount: input.wrongCount,
          notSureCount: input.notSureCount,
          notRememberCount: input.notRememberCount,
          completedAt: input.completedAt,
        });
        return { success: true };
      }),

    // Get user sessions (protected)
    getSessions: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserStudySessions(ctx.user.id);
    }),

    // Get session by ID (protected)
    getSession: protectedProcedure
      .input(z.object({ sessionId: z.number().int() }))
      .query(async ({ ctx, input }) => {
        const session = await db.getStudySessionById(input.sessionId);
        if (!session || session.userId !== ctx.user.id) {
          throw new Error("Session not found or unauthorized");
        }
        return session;
      }),
  }),
});

export type AppRouter = typeof appRouter;
