import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Flashcards table for storing custom and editable flashcards
export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  area: varchar("area", { length: 255 }).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = typeof flashcards.$inferInsert;

// Flashcard progress table for tracking user answers and statistics
export const flashcardProgress = mysqlTable("flashcardProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  flashcardId: varchar("flashcardId", { length: 255 }).notNull(), // ID from FLASHCARDS_DATA
  area: varchar("area", { length: 255 }).notNull(),
  enabled: int("enabled").default(0).notNull(), // 0 or 1 for boolean
  correctCount: int("correctCount").default(0).notNull(),
  wrongCount: int("wrongCount").default(0).notNull(),
  notSureCount: int("notSureCount").default(0).notNull(),
  notRememberCount: int("notRememberCount").default(0).notNull(),
  lastAnsweredAt: timestamp("lastAnsweredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FlashcardProgress = typeof flashcardProgress.$inferSelect;
export type InsertFlashcardProgress = typeof flashcardProgress.$inferInsert;

// Study sessions table for tracking study history
export const studySessions = mysqlTable("studySessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  candidateName: varchar("candidateName", { length: 255 }).notNull(),
  area: varchar("area", { length: 255 }).notNull(), // "all" or specific area
  cardsPerArea: int("cardsPerArea").notNull(),
  totalCards: int("totalCards").notNull(),
  correctCount: int("correctCount").default(0).notNull(),
  wrongCount: int("wrongCount").default(0).notNull(),
  notSureCount: int("notSureCount").default(0).notNull(),
  notRememberCount: int("notRememberCount").default(0).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = typeof studySessions.$inferInsert;
