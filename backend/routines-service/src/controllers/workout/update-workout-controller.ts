import { Context } from "hono";
import { WorkoutService } from "../../services/workout.service";
import { ApiMapper } from "../../helpers";
import { updateWorkoutDTO } from "../../models/Workout";

export async function updateWorkoutController(c: Context) {
  const service = new WorkoutService();

  try {
    const id = Number(c.req.param("id"));

    const workout = await service.getOneBy(id);

    if (!workout) {
      throw new Error(`Workout with ID ${id} does not exist`, {
        cause: { code: 404 },
      });
    }

    const updatedData: updateWorkoutDTO = await c.req.json();
    await service.update(id, updatedData);

    const res = ApiMapper.ApiResponse(null, 200, "Workout Updated");
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
