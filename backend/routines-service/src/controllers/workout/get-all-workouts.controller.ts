import { Context } from "hono";
import { ApiMapper } from "../../helpers";
import { WorkoutService } from "../../services/workout.service";
import { WorkoutFilters } from "../../models/Workout";

export async function getAllWorkoutsController(c: Context) {
  const service = new WorkoutService();
  try {
    let filters: WorkoutFilters = {};
    const user_id = Number(c.req.query("user_id"));
    const exercise_id = Number(c.req.query("exercise_id"));
    const date = c.req.query("date");
    const completed = c.req.query("completed");

    filters = { user_id, exercise_id, date, completed };

    const workouts = await service.getAll(filters);

    const res = ApiMapper.ApiResponse(workouts, 200, "Workouts Retrieved");
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
