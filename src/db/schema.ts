import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  real,
  jsonb,
} from "drizzle-orm/pg-core";

export const questionProgress = pgTable("question_progress", {
  questionId: integer("question_id").primaryKey(),
  status: text("status").notNull().default("unseen"), // 'unseen' | 'mastered' | 'wrong'
  wrongCount: integer("wrong_count").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  bookmarked: boolean("bookmarked").notNull().default(false),
  personalNote: text("personal_note").default(""),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull(), // 'all' | 'topic' | 'wrong' | 'true_false' | 'exam' | 'flashcard'
  topicFilter: text("topic_filter").notNull().default("all"),
  totalQuestions: integer("total_questions").notNull(),
  correctCount: integer("correct_count").notNull(),
  score: real("score").notNull(),
  maxScore: real("max_score").notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  shuffled: boolean("shuffled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  details: jsonb("details"),
});
