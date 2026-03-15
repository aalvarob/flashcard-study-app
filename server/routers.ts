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
  }),
});

export type AppRouter = typeof appRouter;
