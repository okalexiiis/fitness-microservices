import { ContentfulStatusCode } from "hono/utils/http-status";
import z from "zod";

export interface PaginationMetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: ContentfulStatusCode;
  message?: string;
}

export interface ErrorResponse extends Omit<ApiResponse<any>, "data"> {
    cause?: any
    stack?: any
}

export interface ApiResponsePaginated<T>
  extends Omit<ApiResponse<any>, "data"> {
  data: T[];
  meta: PaginationMetaData;
}

export const querySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
})
