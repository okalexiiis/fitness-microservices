import { Context } from "hono";
import { ApiMapper } from "../../helpers";
import { WorkoutService } from "../../services/workout.service";

export async function getOneWOrkoutByIDController(c: Context) {
  const service = new WorkoutService();

  try {
    const id = Number(c.req.param("id"));

    const workout = await service.getOneBy(id);

    if (!workout) {
      throw new Error(`Workout with ID ${id} does not exist`, {
        cause: { code: 404 },
      });
    }

    const res = ApiMapper.ApiResponse(workout, 200, "Workout Retrieved");
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
