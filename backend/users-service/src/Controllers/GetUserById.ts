import { Context } from "hono";
import { UserService } from "../Services/UserService";

export async function GetUserByIdController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener el id desde los params
    const idParam = c.req.param("id");
    const id = Number(idParam);

    if (isNaN(id) || id <= 0) {
      return c.json({ ok: false, message: "ID inválido" }, 400);
    }

    // 2️⃣ Llamar al servicio
    const user = await userService.GetOneBy({ id });

    // 3️⃣ Validar si se encontró
    if (!user) {
      return c.json({ ok: false, message: "Usuario no encontrado" }, 404);
    }

    // 4️⃣ Responder con el usuario
    return c.json({ ok: true, data: [user] }, 200);

  } catch (error: any) {
    console.error("GetUserByIdController error:", error);

    return c.json(
      { ok: false, message: error.message || "Error al obtener usuario" },
      500
    );
  }
}