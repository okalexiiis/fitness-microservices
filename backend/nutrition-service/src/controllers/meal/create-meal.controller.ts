import { Context } from "hono";
import { MealService } from "../../services/meal-service";
import { CreateMealDTO } from "../../models/Meal";
import { GetUserByID } from "../../api";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";
import { MealEnum } from "../../interfaces/meal-type";

export async function CreateMealControlles(c: Context) {
  const service = new MealService();
  const foodService = new FoodService();

  try {
    const { date, food_id, meal_type, quantity, user_id }: CreateMealDTO =
      await c.req.json();

    if (!date || !food_id || !meal_type || !quantity || !user_id) {
      throw new Error(
        "The Fiels 'date', 'food_id', 'meal_type', 'quantity' and 'user_id' are required",
        { cause: { code: 400 } }
      );
    }

    if (!MealEnum.includes(meal_type)) {
      throw new Error(
        "the field 'meal_type' has to be one of this options 'breakfast', 'lunch', 'dinner' or 'snack'",
        {
          cause: { code: 400 },
        }
      );
    }

    const dateFormat = new Date();
    if (!dateFormat) {
      throw new Error("the field 'date' has to be a valid date", {
        cause: { code: 400 },
      });
    }

    if (isNaN(food_id) || isNaN(user_id) || isNaN(quantity)) {
      throw new Error(
        "the field 'food_id' and 'users_id' had to be a valid number",
        { cause: { code: 400 } }
      );
    }

    if (quantity <= 0) {
      throw new Error("the field `quantity` has to be number greater than 0", {
        cause: { code: 400 },
      });
    }

    const user = await GetUserByID(user_id);

    console.log("user found", user);

    if (!user) {
      throw new Error("the user was not found", { cause: { code: 404 } });
    }

    const food = await foodService.GetOneBy({ id: food_id });

    if (!food) {
      throw new Error("the food was not found", { cause: { code: 404 } });
    }

    await service.Save({ food_id, user_id, date, meal_type, quantity });
    const res = ApiMapper.ApiResponse<null>(null, 201, "Meal Created");
    return c.json(res);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";

    const res = ApiMapper.ApiResponse<null>(null, status, message);
    return c.json(res, res.statusCode);
  }
}
