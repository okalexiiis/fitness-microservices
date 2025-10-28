import { decimal, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const food_table = pgTable("foods", {   
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    calories: decimal().notNull(),
    proteins: decimal().notNull(),
    carbs: decimal().notNull(),
    fats: decimal().notNull()
})