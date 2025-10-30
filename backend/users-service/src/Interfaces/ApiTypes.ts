import { User } from "../Models/user";

export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  message?: string
  statusCode?: number
}

export interface ApiResponsePaginated<T> 
  extends Omit<ApiResponse<any>, "data">
{
  data: T[];
  meta: PaginationMetaData;
}

export type UserFilters = Partial<Pick<
  User,
  "id" | "email" | "name" | "age" | "height" | "weight" | "goal" | "created_at"
>>;