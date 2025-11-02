import { Context } from "hono";
import { ApiMapper } from "../../helpers";
import { WorkoutService } from "../../services/workout.service";

export async function deleteWorkoutController(c: Context) {
  const service = new WorkoutService();

  try {
    const workoutId = Number(c.req.param("id"));

    const existingWorkout = await service.getOneBy(workoutId);
    if (!existingWorkout) {
      throw new Error(`Workout with ID ${workoutId} does not exist`, {
        cause: { code: 404 },
      });
    }

    await service.delete(workoutId);

    const res = ApiMapper.ApiResponse<null>(null, 200, "Workout Deleted");
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
