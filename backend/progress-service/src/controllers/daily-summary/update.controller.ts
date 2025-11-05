import { Context } from "hono";
import { DailySummaryService } from "../../services/daily-summary.service";
import { updateDailySummaryDTO } from "../../models/DailySummary";
import { ApiMapper } from "../../helpers/api-mapper";

/**
 * @description Actualiza un registro de resumen diario existente por su ID.
 */
export async function updateDailySummaryController(c: Context) {
  const service = new DailySummaryService();

  try {
    const id = Number(c.req.param("id"));
    const dto: updateDailySummaryDTO = await c.req.json(); // Validado por zValidator

    const updated = await service.update(id, dto);
    
    // El servicio lanza un error si no se encuentra, por lo que un 404 será manejado en el catch
    // si ajustamos el mensaje del catch.

    const res = ApiMapper.ApiResponse(
      updated,
      200,
      "Daily summary updated successfully"
    );
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);
    
    // Si el servicio lanzó un error de "no encontrado"
    if (error.message.includes("no encontrado para actualizar")) {
        const res = ApiMapper.ErrorResponse(404, error.message);
        return c.json(res, 404);
    }

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(status, message, error?.stack, error?.cause);
    return c.json(res, res.statusCode);
  }
}