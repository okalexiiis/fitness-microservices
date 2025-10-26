import { Context } from "hono";
import { UserService } from "../Services/UserService";
import { sanitizeUpdates } from "../Helpers";

export async function UpdateUserController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener ID del parámetro de ruta
    const idParam = c.req.param("id");
    const id = Number(idParam);

    if (isNaN(id) || id <= 0) {
      return c.json({ ok: false, message: "ID inválido" }, 400);
    }

    // 2️⃣ Obtener los datos del body
    const updates = await c.req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return c.json({ ok: false, message: "No se proporcionaron campos a actualizar" }, 400);
    }

    // 3️⃣ Sanitizar los datos (por ejemplo convertir fechas a string)
    const sanitizedUpdates = sanitizeUpdates(updates);

    // 4️⃣ Ejecutar actualización
    await userService.update(id, sanitizedUpdates);

    // 5️⃣ Responder al cliente
    return c.json({ ok: true, message: "Usuario actualizado correctamente" }, 200);

  } catch (error: any) {
    console.error("UpdateUserController error:", error);

    return c.json(
      { ok: false, message: error.message || "Error al actualizar usuario" },
      500
    );
  }
}
