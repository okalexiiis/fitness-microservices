import { Context } from "hono";
import { ExerciseService } from "../../services/exercise.service";
import { ApiMapper } from "../../helpers";
import { ExerciseCategoryType, ExerciseFilters } from "../../models/Exercise";

export async function GetAllExercisesController(c: Context) {
  const service = new ExerciseService();
  try {
    const limit = Number(c.req.query("limit")) || 10
    const page = Number(c.req.query("page")) || 1

    const category = c.req.query("category") as ExerciseCategoryType
    const name = c.req.query("name")
    const filters: ExerciseFilters = {name, category}

    const {data, total} = await service.getAll(page, limit, filters)
    const totalPages = total / limit
    const res = ApiMapper.ApiPaginatedResponse(data, 200, {limit, page, total, totalPages})
    return c.json(res, res.statusCode)
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
