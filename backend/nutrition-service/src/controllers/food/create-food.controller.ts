import { Context } from "hono";
import { CreateFoodDTO, Food } from "../../models/Food";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";

export async function CreateFoodController(c: Context) {
  const service = new FoodService();
  try {
    const body: CreateFoodDTO = await c.req.json();

    await service.Save(body);

    const res = ApiMapper.ApiResponse<null>(null, 201, "Food Created");
    return c.json(res, 201);
  } catch (error) {
    let res = {};
    console.log(error);

    res = ApiMapper.ApiResponse<any>(error, 505, "Something Wrong happened");
    return c.json(res, 505);
  }
}
