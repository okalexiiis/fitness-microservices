import { date, doublePrecision, integer, pgTable } from "drizzle-orm/pg-core";

export const DailySummaryTable = pgTable("daily_summary", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull(),
  date: date().notNull(),
  total_calories_consumed: doublePrecision().notNull(),
  total_calories_burned: doublePrecision().notNull(),
  workouts_completed: integer().notNull(),
});
