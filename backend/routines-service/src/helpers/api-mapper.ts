import { ContentfulStatusCode } from "hono/utils/http-status";
import {
  ApiResponse,
  ApiResponsePaginated,
  ErrorResponse,
  PaginationMetaData,
} from "../types/api.types";

export class ApiMapper<T> {
  static ApiResponse<T>(
    data: T,
    statusCode: ContentfulStatusCode = 200,
    message?: string
  ): ApiResponse<T> {
    return {
      data,
      message,
      statusCode,
    };
  }

  static ErrorResponse(statusCode:ContentfulStatusCode = 500, message: string = "Something Wrong Happened", stack?: any, cause?: any): ErrorResponse {
    return {
      message, statusCode, stack, cause
    }
  }

  static ApiPaginatedResponse<T>(
    data: T[],
    statusCode: ContentfulStatusCode = 200,
    meta: PaginationMetaData,
    message?: string
  ): ApiResponsePaginated<T> {
    return {
      data,
      statusCode,
      meta,
      message,
    };
  }
}
