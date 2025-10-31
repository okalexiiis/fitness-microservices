import { Context } from "hono";
import { MealService } from "../../services/meal-service";
import { CreateMealDTO } from "../../models/Meal";
import { GetUserByID } from "../../api";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";
import { MealEnum } from "../../interfaces/meal-type";

export async function UpdateMealController(c: Context) {
  const service = new MealService();
  const foodService = new FoodService();

  try {
    const {
      date,
      food_id,
      meal_type,
      quantity,
      user_id,
    }: Partial<CreateMealDTO> = await c.req.json();

    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      throw new Error("Invalid meal ID", { cause: { code: 400 } });
    }

    // Validate meal type
    if (meal_type && !MealEnum.includes(meal_type)) {
      throw new Error(
        "the field 'meal_type' has to be one of: 'breakfast', 'lunch', 'dinner', or 'snack'",
        { cause: { code: 400 } }
      );
    }

    // Validate date
    if (date) {
      const dateFormat = new Date(date);
      if (isNaN(dateFormat.getTime())) {
        throw new Error("the field 'date' has to be a valid date", {
          cause: { code: 400 },
        });
      }
    }

    // Validate numeric fields
    if (
      (food_id !== undefined && isNaN(food_id)) ||
      (user_id !== undefined && isNaN(user_id)) ||
      (quantity !== undefined && isNaN(quantity))
    ) {
      throw new Error(
        "the fields 'quantity', 'food_id', and 'user_id' must be valid numbers",
        { cause: { code: 400 } }
      );
    }

    // Quantity check
    if (quantity !== undefined && quantity <= 0) {
      throw new Error("the field 'quantity' must be greater than 0", {
        cause: { code: 400 },
      });
    }

    // Check user exists
    if (user_id) {
      const user = await GetUserByID(user_id);
      if (!user) {
        throw new Error("the user was not found", { cause: { code: 404 } });
      }
    }

    // Check food exists
    if (food_id) {
      const food = await foodService.GetOneBy({ id: food_id });
      if (!food) {
        throw new Error("the food was not found", { cause: { code: 404 } });
      }
    }

    // ✅ Await the update
    await service.update(id, { food_id, user_id, date, meal_type, quantity });

    const res = ApiMapper.ApiResponse<null>(null, 200, "Meal Updated");
    return c.json(res);

  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";

    const res = ApiMapper.ApiResponse<null>(null, status, message);
    return c.json(res, res.statusCode);
  }
}
