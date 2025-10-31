import { Context } from "hono";
import { MealService } from "../../services/meal-service";
import { ApiMapper } from "../../helpers/api-mapper";
import { Meal } from "../../models/Meal";

export async function GetMealByID(c: Context) {
  const service = new MealService();

  try {
    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      throw new Error("The ID Has to be Number", { cause: { code: 400 } });
    }

    const meal = await service.GetOneBy({ id });

    if (!meal) {
      throw new Error("Meal not Found", { cause: { code: 404 } });
    }

    const res = ApiMapper.ApiResponse<Meal>(meal, 200, "Meal Found");
    return c.json(res, 200);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";

    const res = ApiMapper.ApiResponse<null>(null, status, message);
    return c.json(res, res.statusCode);
  }
}
