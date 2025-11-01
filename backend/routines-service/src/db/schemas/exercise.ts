import {
  integer,
  pgTable,
  varchar,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";
import { ExerciseCategory } from "../../models/Exercise";

const exerciseCategoryEnum = pgEnum("exercise_category_enum",ExerciseCategory)

export const exerciseTable = pgTable("exercise", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  category: exerciseCategoryEnum().notNull(),
  duration_minutes: integer().notNull(),
  calories_burned: doublePrecision().notNull(),
});
