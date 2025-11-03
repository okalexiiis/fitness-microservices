import { Context } from "hono";
import { WorkoutService } from "../../services/workout.service";
import { ApiMapper } from "../../helpers";
import { createWorkoutDTO } from "../../models/Workout";
import { GetUserByID } from "../../api";
import { ExerciseService } from "../../services/exercise.service";

export async function createWorkoutController(c: Context) {
  const service = new WorkoutService();
  const exerciseService = new ExerciseService();

  try {
    const data: createWorkoutDTO = await c.req.json();

    const user = await GetUserByID(data.user_id);
    if (!user) {
      throw new Error(`User with ID ${data.user_id} does not exist`, {
        cause: { code: 404 },
      });
    }

    const exercise = await exerciseService.getOneBy({id: data.exercise_id});
    if (!exercise) {
      throw new Error(`Exercise with ID ${data.exercise_id} does not exist`, {
        cause: { code: 404 },
      });
    }

    await service.save(data);

    const res = ApiMapper.ApiResponse<null>(null, 201, "Workout Created");
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
