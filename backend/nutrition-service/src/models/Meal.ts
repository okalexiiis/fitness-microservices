import { MealType } from "../interfaces/meal-type"

export interface Meal {
    id: number
    food_id: number
    user_id: number
    date: Date
    meal_type: MealType
    quantity: number
}