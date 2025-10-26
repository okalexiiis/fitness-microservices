import { integer, pgTable, varchar, pgEnum, date } from "drizzle-orm/pg-core";
import { Goals } from "../../Interfaces/Goals";

export const goalsEnum = pgEnum("goals", Goals);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  password_hash: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  height: integer().notNull(),
  weight: integer().notNull(),
  goal: goalsEnum().notNull(),
  created_at: date().notNull().defaultNow()
});
