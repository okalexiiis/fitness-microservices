import { Context } from "hono";
import { DailySummaryService } from "../../services/daily-summary.service";
import { createDailySummaryDTO } from "../../models/DailySummary";
import { ApiMapper } from "../../helpers/api-mapper";
import { GetUserByID } from "../../api";

/**
 * @description Guarda o actualiza el resumen diario de un usuario.
 */
export async function createDailySummaryController(c: Context) {
  const service = new DailySummaryService();

  try {
    const dto: createDailySummaryDTO = await c.req.json();

    const user = await GetUserByID(dto.user_id);
    if (!user) {
      const res = ApiMapper.ErrorResponse(404, "User not found");
      return c.json(res, res.statusCode);
    }

    const saved = await service.save(dto);

    const res = ApiMapper.ApiResponse(
      saved,
      201, // 201 Created
      "Daily summary saved successfully (created or updated)"
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
