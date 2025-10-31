import { Context } from "hono";
import { CreateFoodDTO } from "../../models/Food";
import { FoodService, sanitizeFoodUpdates } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";

export async function UpdateFoodController(c: Context) {
  const service = new FoodService();

  try {
    let res;
    const id = c.req.param("id");

    if (isNaN(Number(id))) {
      res = ApiMapper.ApiResponse<null>(null, 400, "The ID is not a number");
      return c.json(res, 400);
    }

    const food = service.GetOneBy({ id: Number(id) });

    if (!food) {
      res = ApiMapper.ApiResponse<null>(null, 404, "Food not Found");
      return c.json(res, 404);
    }

    const updates = await c.req.json()

    await service.update(Number(id), updates)
  } catch (error) {
    console.log(error)
    let res;

    res = ApiMapper.ApiResponse<any>(error, 500, "Something Wrong Happened")
    return c.json(res)
  }
}
