import { Food } from "../models/Food";
import { Meal } from "../models/Meal";

export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ApiResponsePaginated<T>
  extends Omit<ApiResponse<any>, "data"> {
  data: T[];
  meta: PaginationMetaData;
}

export type FoodFilters = Partial<
  Pick<Food, "id" | "calories" | "name" | "carbs" | "fats" | "proteins">
>;

export type MealFilters = Partial<
  Pick<Meal, "id" | "date" | "food_id" | "meal_type" | "quantity" | "user_id">
>;
