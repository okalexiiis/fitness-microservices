import { Context } from "hono";
import { UserFilters } from "../Interfaces/ApiTypes";
import { UserService } from "../Services/UserService";

export async function GetAllController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener query params para paginación
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 10);

    // 2️⃣ Obtener filtros desde query params (opcional)
    // Ejemplo: ?goal=lose_weight&age=25
    const filters: UserFilters = {};
    const goal = c.req.query("goal");
    const age = c.req.query("age");
    if (goal) filters.goal = goal as any;
    if (age) filters.age = Number(age);

    // 3️⃣ Llamar al servicio
    const result = await userService.GetAll(page, limit, filters);

    // 4️⃣ Responder al cliente
    return c.json(result, 200);

  } catch (error: any) {
    console.error("GetAllController error:", error);

    return c.json(
      { ok: false, message: error.message || "Error al obtener usuarios" },
      500
    );
  }
}
