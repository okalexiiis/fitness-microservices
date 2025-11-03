export interface Food {
  id: number;
  name: string;
  calories: number; // Decimal
  proteins: number; // Decimal
  carbs: number; // Decimal
  fats: number; // Decimal
}

export const MealEnum = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealType = (typeof MealEnum)[number];

export interface Meal {
  id: number;
  food_id: number;
  user_id: number;
  date: string | Date;
  meal_type: MealType;
  quantity: number;
}
