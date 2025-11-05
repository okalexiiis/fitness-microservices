import { Context } from "hono";
import { DailySummaryService } from "../../services/daily-summary.service";
import { TDailySummaryQuery } from "../../models/DailySummary";
import { ApiMapper } from "../../helpers/api-mapper";

/**
 * @description Obtiene todos los resúmenes diarios con filtros y paginación.
 */
export async function getAllDailySummariesController(c: Context) {
  const service = new DailySummaryService();

  try {
    // Los parámetros de query ya están validados y parseados por zValidator/Hono
    const query: TDailySummaryQuery = c.req.query();

    const { data, total } = await service.getAll(query);

    // Asumo que tu ApiMapper.ApiPaginatedResponse espera el total, límite y página
    // Nota: Necesitarías calcular totalPages y obtener page/limit del query para la meta.
    const { limit = 10, page = 1 } = query;
    const totalPages = Math.ceil(total / limit);

    const res = ApiMapper.ApiPaginatedResponse(
      data,
      200,
      {
        total: total,
        limit: limit,
        page: page,
        totalPages: totalPages,
      },
      "Daily summaries fetched successfully"
    );
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);
    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(
      status,
      message,
      error?.stack,
      error?.cause
    );
    return c.json(res, res.statusCode);
  }
}
