import { Context } from "hono";
import { ExerciseService } from "../services/exercise.service";
import { ApiMapper } from "../helpers";
import { updateWorkoutDTO } from "../models/Workout";

export async function UpdateExercise(c: Context) {
  const service = new ExerciseService();
  try {
    const id = Number(c.req.param("id"));

    const exercise = await service.getOneBy({ id });
    if (!exercise) {
      throw new Error("Exercise not Found", { cause: { code: 404 } });
    }

    const data: updateWorkoutDTO = await c.req.json();

    await service.update(id, data);
    let res = ApiMapper.ApiResponse<null>(null, 200, "Exercise Updated");
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
