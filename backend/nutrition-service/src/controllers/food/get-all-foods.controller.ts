import { Context } from "hono";
import { FoodService } from "../../services/food-service";
import { ApiMapper } from "../../helpers/api-mapper";

export async function GetAllFoods(c: Context) {
  const service = new FoodService();

  try {
    // 1️⃣ Obtener query params para paginación
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 10);

    // 3️⃣ Llamar al servicio
    const { data, total } = await service.GetAll(page, limit);

    // 4️⃣ Responder al cliente
    const res = ApiMapper.ApiPaginatedResponse<any>(data, 200, {
      limit,
      page,
      total,
      totalPages: total / limit,
    });
    return c.json(res, 200);
  } catch (error) {
    let res = {};
    console.log(error);

    res = ApiMapper.ApiResponse<any>(error, 505, "Something Wrong Happened");
    c.json(res);
  }
}
