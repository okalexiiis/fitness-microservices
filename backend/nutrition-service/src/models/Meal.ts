import { MealType } from "../interfaces/meal-type";

export interface Meal {
  id: number;
  food_id: number;
  user_id: number;
  date: string | Date;
  meal_type: MealType;
  quantity: number;
}

export type MealButDateString = Omit<Meal, "date"> & {
  date: string;
};

// DTO for creation (without id)
export interface CreateMealDTO extends Omit<MealButDateString, "id"> {}
