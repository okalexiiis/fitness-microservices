import { Context } from "hono";
import { UserService } from "../Services/UserService";
import { User } from "../Models/user";
import { hash } from "../Helpers";

export async function RegisterUserController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener datos del body
    const body = await c.req.json();

    // Validaciones básicas (puedes usar Zod, Joi o class-validator)
    const { email, name, password, age, height, weight, goal } = body;

    if (!email || !name || !password || !age || !height || !weight || !goal) {
      return c.json({ ok: false, message: "Todos los campos son obligatorios" }, 400);
    }
    const password_hash = await hash(password)
    // 2️⃣ Crear instancia de User
    const newUser = new User(
      0, // id será generado por la DB
      email,
      name,
      password_hash, // aquí idealmente hash
      age,
      height,
      weight,
      goal
    );

    // 3️⃣ Guardar en la base de datos
    await userService.Save(newUser);

    // 4️⃣ Respuesta exitosa
    return c.json({ ok: true, message: "Usuario registrado correctamente" }, 201);

  } catch (error: any) {
    console.error("RegisterUserController error:", error);

    // Respuesta de error
    return c.json(
      { ok: false, message: error.message || "Error al registrar usuario" },
      500
    );
  }
}
