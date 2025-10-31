import { ContentfulStatusCode } from "hono/utils/http-status";
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
  statusCode: ContentfulStatusCode;
  message?: string;
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
  Pick<Meal, "id" | "date" | "meal_type" | "user_id">
>;
