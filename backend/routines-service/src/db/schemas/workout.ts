import { date, integer, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { exerciseTable } from "./exercise";

export const workoutTable = pgTable("workout", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull(),
    exercise_id: integer().references(() => exerciseTable.id).notNull(),
    date: date().notNull().defaultNow(),
    completed: boolean().notNull().default(true),
    notes: text()
})