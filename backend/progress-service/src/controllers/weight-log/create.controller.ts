import { Context } from "hono";
import { WeightLogService } from "../../services/weight-log.service";
import { createWeightLogDTO } from "../../models/WeightLog";
import { GetUserByID } from "../../api";
import { ApiMapper } from "../../helpers/api-mapper";

export async function createWeightLogController(c: Context) {
  const service = new WeightLogService();

  try {
    const { date, user_id, weight }: createWeightLogDTO = await c.req.json();

    const user = await GetUserByID(user_id);
    if (!user) {
      const res = ApiMapper.ErrorResponse(404, "User not found");
      return c.json(res, res.statusCode);
    }

    const saved = await service.save({ date, user_id, weight });

    const res = ApiMapper.ApiResponse(
      saved,
      201,
      "Weight log saved successfully"
    );
    return c.json(res, res.statusCode);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";
    const stack = error?.stack || null;
    const cause = error?.cause || null;

    const res = ApiMapper.ErrorResponse(status, message, stack, cause);
    return c.json(res, res.statusCode);
  }
}
