import { Context } from "hono";
import { UserService } from "../Services/UserService";

export async function DeleteUserController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener ID del parámetro de ruta
    const idParam = c.req.param("id");
    const id = Number(idParam);

    if (isNaN(id) || id <= 0) {
      return c.json({ ok: false, message: "ID inválido" }, 400);
    }

    // 2️⃣ Ejecutar eliminación
    await userService.delete(id);

    // 3️⃣ Responder al cliente
    return c.json(
      { ok: true, message: "Usuario eliminado correctamente" },
      200
    );
  } catch (error: any) {
    console.error("DeleteUserController error:", error);

    return c.json(
      { ok: false, message: error.message || "Error al eliminar usuario" },
      500
    );
  }
}
