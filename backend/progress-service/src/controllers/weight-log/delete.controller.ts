import { Context } from "hono";
import { WeightLogService } from "../../services/weight-log.service";
import { ApiMapper } from "../../helpers/api-mapper";

/**
 * @description Elimina un registro de peso por su ID.
 */
export async function deleteWeightLogController(c: Context) {
  const service = new WeightLogService();

  try {
    const id = Number(c.req.param("id"));

    await service.delete(id);

    const res = ApiMapper.ApiResponse(
      null,
      200,
      "Weight log deleted successfully"
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
