import { Context } from "hono";
import { ApiMapper } from "../../helpers/api-mapper";
import { DailySummaryService } from "../../services/daily-summary.service";

/**
 * @description Elimina un registro de resumen diario por su ID.
 */
export async function deleteDailySummaryController(c: Context) {
  const service = new DailySummaryService();

  try {
    const id = Number(c.req.param("id")); // Validado por zValidator
    
    await service.delete(id);

    // Respuesta 204 No Content, sin cuerpo
    return c.json(null, 200); 
    
  } catch (error: any) {
    console.error(error);
    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const res = ApiMapper.ErrorResponse(status, message, error?.stack, error?.cause);
    return c.json(res, res.statusCode);
  }
}