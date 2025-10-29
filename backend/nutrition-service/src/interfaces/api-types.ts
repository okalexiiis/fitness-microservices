import { Food } from "../models/Food";
import { Meal } from "../models/Meal";

export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  ok: boolean;
}

export type ApiResponseOne<T> = Omit<ApiResponse<T>, "data"> & {
  data: T;
};

export interface ApiResponsePaginated<T> extends ApiResponse<T> {
  meta: PaginationMetaData;
}

export type FoodFilters = Partial<
  Pick<Food, "id" | "calories" | "name" | "carbs" | "fats" | "proteins">
>;

export type MealFilters = Partial<
  Pick<Meal, "id" | "date" | "food_id" | "meal_type" | "quantity" | "user_id">
>;
