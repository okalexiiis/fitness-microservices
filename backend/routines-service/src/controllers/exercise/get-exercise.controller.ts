import { Context } from "hono";
import { ExerciseService } from "../../services/exercise.service";
import { ApiMapper } from "../../helpers";

export async function GetExcersiceByID(c: Context) {
  const service = new ExerciseService();
  try {
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
