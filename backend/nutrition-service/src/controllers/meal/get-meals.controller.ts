import { Context } from "hono";
import { MealService } from "../../services/meal-service";
import { MealFilters } from "../../interfaces/api-types";
import { MealEnum, MealType } from "../../interfaces/meal-type";
import { ApiMapper } from "../../helpers/api-mapper";
import { Meal } from "../../models/Meal";

export async function GetAllMealsControllers(c: Context) {
  const service = new MealService();

  try {
    const limit = Number(c.req.query("limit")) || 10;
    const page = Number(c.req.query("page")) || 1;
    const filters: MealFilters = {};

    const user_id = Number(c.req.query("user"));
    const meal_type_param = c.req.query("type");
    const dateParam = c.req.query("date");

    let date: Date | undefined;
    if (dateParam) date = new Date(dateParam);

    if (!isNaN(user_id)) filters.user_id = user_id;

    if (meal_type_param && MealEnum.includes(meal_type_param as MealType)) {
      filters.meal_type = meal_type_param as MealType;
    }

    if (date) filters.date = date.toISOString();

    const { data, total } = await service.GetAll(page, limit, filters);
    const totalPages = total / limit;
    const res = ApiMapper.ApiPaginatedResponse<Meal>(data, 200, {
      limit,
      page,
      total,
      totalPages,
    });
    return c.json(res, 200);
  } catch (error: any) {
    console.error(error);

    const status = error?.cause?.code || 500;
    const message = error?.message || "Something went wrong";

    const res = ApiMapper.ApiResponse<null>(null, status, message);
    return c.json(res, res.statusCode);
  }
}
