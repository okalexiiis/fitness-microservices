import { Context } from "hono";
import { ExerciseService } from "../../services/exercise.service";
import { CreateExerciseDTO } from "../../models/Exercise";
import { ApiMapper } from "../../helpers";

export async function SaveExerciseController(c: Context) {
  const service = new ExerciseService();

  try {
    const raw: CreateExerciseDTO = await c.req.json();

    await service.save(raw);

    const res = ApiMapper.ApiResponse<null>(null, 201, "Exercise Created");
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
