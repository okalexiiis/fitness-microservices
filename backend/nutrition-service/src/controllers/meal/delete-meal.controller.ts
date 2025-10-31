import { Context } from "hono";
import { MealService } from "../../services/meal-service";
import { ApiMapper } from "../../helpers/api-mapper";

export async function DeleteMealController(c: Context) {
  const service = new MealService();

  try {
    const id = Number(c.req.param("id"));

    const meal = await service.GetOneBy({ id });

    if (!meal) throw new Error("Meal not Found", { cause: { code: 404 } });

    await service.delete(id);
    const res = ApiMapper.ApiResponse<boolean>(true, 200, "Meal Deleted");
    return c.json(res, 200);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";

    const res = ApiMapper.ApiResponse<null>(null, status, message);
    return c.json(res, res.statusCode);
  }
}
