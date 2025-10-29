import {  doublePrecision, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const foodTable = pgTable("foods", {   
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    calories: doublePrecision().notNull(),
    proteins: doublePrecision().notNull(),
    carbs: doublePrecision().notNull(),
    fats: doublePrecision().notNull()
})