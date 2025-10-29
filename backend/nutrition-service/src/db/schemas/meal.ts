import { date, integer, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { MealEnum } from "../../interfaces/meal-type";
import { foodTable } from "./food";

export const mealEnum = pgEnum("meals_enum", MealEnum)

export const mealTable = pgTable("meals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    food_id: integer().notNull().references(() => foodTable.id),
    user_id: integer().notNull(),
    date: date().notNull(),
    meal_type: mealEnum().notNull(),
    quantity: integer().notNull()
})