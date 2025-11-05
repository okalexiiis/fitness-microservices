import { Context } from "hono";
import { ApiMapper } from "../../helpers/api-mapper";
import { updateWeightLogDTO } from "../../models/WeightLog";
import { WeightLogService } from "../../services/weight-log.service";

/**
 * @description Actualiza un registro de peso existente por su ID.
 */
export async function updateWeightLogController(c: Context) {
  const service = new WeightLogService();

  try {
    const id = Number(c.req.param("id"));
    const dto: updateWeightLogDTO = await c.req.json();

    // Opcional: Verificar si el registro existe antes de actualizar (mejora la UX)
    // Pero el servicio puede manejar el caso donde no se actualiza nada
    
    const updated = await service.update(id, dto);

    if (!updated) {
        const res = ApiMapper.ErrorResponse(404, "Weight log not found for update");
        return c.json(res, res.statusCode);
    }

    const res = ApiMapper.ApiResponse(
      updated,
      200,
      "Weight log updated successfully"
    );
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(status, message, error?.stack, error?.cause);
    return c.json(res, res.statusCode);
  }
}