import { Context } from "hono";
import { DailySummaryService } from "../../services/daily-summary.service";
import { TDailySummaryFilters } from "../../models/DailySummary";
import { ApiMapper } from "../../helpers/api-mapper";

/**
 * @description Obtiene un registro por ID o por user_id + date.
 */
export async function getDailySummaryController(c: Context) {
  const service = new DailySummaryService();

  try {
    // 1. Obtener ID del parámetro de ruta (ya validado como número o undefined)
    const id = c.req.param("id") ? Number(c.req.param("id")) : undefined;
    
    // 2. Obtener user_id y date del query (si se usan las rutas alternativas)
    // Hono lo parsea como string, zValidator lo convierte a número/fecha si se usa
    const query = c.req.query();

    const filters: TDailySummaryFilters = {
        id: id,
        user_id: query.user_id ? Number(query.user_id) : undefined,
        date: query.date,
    };
    
    const found = await service.getOne(filters);

    if (!found) {
      const res = ApiMapper.ErrorResponse(404, "Daily summary not found");
      return c.json(res, res.statusCode);
    }

    const res = ApiMapper.ApiResponse(found, 200, "Daily summary fetched successfully");
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);
    // Maneja el error forzado del servicio si no se proporcionaron filtros
    const status = error.message.includes("Debe especificar") ? 400 : error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(status, message, error?.stack, error?.cause);
    return c.json(res, res.statusCode);
  }
}