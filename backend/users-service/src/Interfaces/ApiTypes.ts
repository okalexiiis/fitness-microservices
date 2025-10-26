import { User } from "../Models/user";

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

export interface ApiResponsePaginated<T> extends ApiResponse<T> {
  meta: PaginationMetaData;
}

export type UserFilters = Partial<Pick<
  User,
  "id" | "email" | "name" | "age" | "height" | "weight" | "goal" | "created_at"
>>;