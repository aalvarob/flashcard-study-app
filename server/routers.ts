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

    // Create new flashcard (admin only)
    create: protectedProcedure
      .input(flashcardSchema)
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create flashcards");
        }
        return db.createFlashcard({
          question: input.question,
          answer: input.answer,
          area: input.area,
          createdBy: ctx.user.id,
        });
      }),

    // Update flashcard (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          question: z.string().min(1, "Question is required"),
          answer: z.string().min(1, "Answer is required"),
          area: z.string().min(1, "Area is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can update flashcards");
        }
        await db.updateFlashcard(input.id, {
          question: input.question,
          answer: input.answer,
          area: input.area,
        });
        return { success: true };
      }),

    // Delete flashcard (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can delete flashcards");
        }
        await db.deleteFlashcard(input.id);
        return { success: true };
      }),

    // Get single flashcard
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getFlashcardById(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
