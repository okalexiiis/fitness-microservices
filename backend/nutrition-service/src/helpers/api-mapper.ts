import {
  ApiResponse,
  ApiResponsePaginated,
  PaginationMetaData,
} from "../interfaces/api-types";

export class ApiMapper<T> {
  static ApiResponse<T>(
    data: T,
    statusCode: number,
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
    statusCode: number,
    meta: PaginationMetaData,
    message?: string
  ) {
    return {
      data,
      statusCode,
      meta,
      message,
    };
  }
}
