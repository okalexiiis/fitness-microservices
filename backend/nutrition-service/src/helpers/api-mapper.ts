import { ContentfulStatusCode } from "hono/utils/http-status";
import {
  ApiResponse,
  ApiResponsePaginated,
  PaginationMetaData,
} from "../interfaces/api-types";

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
