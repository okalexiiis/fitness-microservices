export const MealEnum = ["breakfast", "lunch", "dinner", "snack"] as const

export type MealType = typeof MealEnum[number]