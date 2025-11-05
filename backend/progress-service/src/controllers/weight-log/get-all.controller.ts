import { Context } from "hono";
import { WeightLogService } from "../../services/weight-log.service";
import { TWeightLogQuery } from "../../models/WeightLog";
import { ApiMapper } from "../../helpers/api-mapper";

/**
 * @description Obtiene todos los registros de peso con filtros y paginación.
 */
export async function getAllWeightLogsController(c: Context) {
  const service = new WeightLogService();

  try {
    // Obtener los parámetros de la URL (query) y convertirlos al tipo esperado
    // Asumiendo que Hono o algún middleware maneja la validación/parseo a TWeightLogQuery
    const { limit, page, ...rest }: TWeightLogQuery = c.req.query();

    // El servicio se encarga de aplicar la lógica de paginación/filtros
    const { data, total } = await service.getAll({ limit, page, ...rest });
    const totalPages = Math.ceil(total / (limit || 10));
    const res = ApiMapper.ApiPaginatedResponse(
      data, // Los datos paginados
      200,
      { limit: limit || 10, page: page || 1, total: total, totalPages },
      "Weight logs fetched successfully"
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
