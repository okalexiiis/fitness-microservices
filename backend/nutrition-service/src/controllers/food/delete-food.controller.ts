import { Context } from "hono";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";

export async function deleteFoodController(c: Context) {
  const service = new FoodService();
  try {
    const id = c.req.param("id");
    let res;
    if (isNaN(Number(id))) {
      res = ApiMapper.ApiResponse<null>(
        null,
        400,
        "The requested ID is not a number"
      );
      return c.json(res, 400);
    }

    const food = await service.GetOneBy({ id: Number(id) });

    if (!food) {
      res = ApiMapper.ApiResponse<null>(null, 404, "Food Not Found");
      return c.json(res, 404);
    }

    await service.delete(Number(id));

    res = ApiMapper.ApiResponse<boolean>(true, 200, "Food Deleted");
    return c.json(res, 200);
  } catch (error) {
    console.log(error);
    let res;

    res = ApiMapper.ApiResponse<any>(error, 505, "Something Wrong Happened");
  }
}
