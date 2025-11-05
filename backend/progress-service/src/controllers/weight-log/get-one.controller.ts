import { Context } from "hono";
import { ApiMapper } from "../../helpers/api-mapper";
import { TWeightLogFilters } from "../../models/WeightLog";
import { WeightLogService } from "../../services/weight-log.service";

/**
 * @description Obtiene un registro de peso por ID o por user_id + date.
 */
export async function getWeightLogController(c: Context) {
  const service = new WeightLogService();

  try {
    // 1. Obtener parámetros: Se puede buscar por ID (param) o por user_id + date (query)
    // Asumiendo que el ID viene como parámetro de ruta y el resto como query
    const id = c.req.param("id") ? Number(c.req.param("id")) : undefined;
    const { user_id, date }: Partial<TWeightLogFilters> = c.req.query();

    const filters: TWeightLogFilters = {
        id,
        user_id: user_id ? Number(user_id) : undefined,
        date: date,
    };
    
    // Validación básica para asegurar que al menos un criterio está presente
    if (!filters.id && !(filters.user_id && filters.date)) {
        const res = ApiMapper.ErrorResponse(400, "Must specify 'id' or 'user_id' + 'date'");
        return c.json(res, res.statusCode);
    }
    
    const found = await service.getOne(filters);

    if (!found) {
      const res = ApiMapper.ErrorResponse(404, "Weight log not found");
      return c.json(res, res.statusCode);
    }

    const res = ApiMapper.ApiResponse(found, 200, "Weight log fetched successfully");
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);
    // Manejar el error de "Debe especificar..." del servicio si es relevante
    const status = error.message.includes("Debe especificar") ? 400 : error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(status, message, error?.stack, error?.cause);
    return c.json(res, res.statusCode);
  }
}