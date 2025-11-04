import { date, doublePrecision, integer, pgTable } from "drizzle-orm/pg-core";

export const WeightLogTable = pgTable("weight_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull(),
  weight: doublePrecision().notNull(),
  date: date().notNull(),
});
