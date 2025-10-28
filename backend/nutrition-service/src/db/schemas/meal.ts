import { date, integer, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { MealEnum } from "../../interfaces/meal-type";

export const mealEnum = pgEnum("meals", MealEnum)

export const meal_table = pgTable("meals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    food_id: integer().notNull(),
    user_id: integer().notNull(),
    date: date().notNull(),
    meal_type: mealEnum().notNull(),
    quantity: integer().notNull()
})