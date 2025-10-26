import { Context } from "hono";
import { UserService } from "../Services/UserService";
import { compareHash } from "../Helpers";
import { SignJWT } from "jose";

// Secret para JWT (ideal usar .env)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

// Tiempo de expiración del token
const JWT_EXPIRES_IN = "1h"; // 1 hora

export async function LoginUserController(c: Context) {
  const userService = new UserService();

  try {
    // 1️⃣ Obtener datos del body
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ ok: false, message: "Email y contraseña son obligatorios" }, 400);
    }

    // 2️⃣ Buscar usuario por email
    const user = await userService.GetOneBy({ email });

    if (!user) {
      return c.json({ ok: false, message: "Usuario no encontrado" }, 404);
    }

    // 3️⃣ Verificar contraseña
    const valid = await compareHash(password, user.password_hash);

    if (!valid) {
      return c.json({ ok: false, message: "Contraseña incorrecta" }, 401);
    }

    // 4️⃣ Generar JWT
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);

    // 5️⃣ Responder con el token
    return c.json({
      ok: true,
      message: "Inicio de sesión exitoso",
      data: { id: user.id, email: user.email, name: user.name, token }
    }, 200);

  } catch (error: any) {
    console.error("LoginUserController error:", error);

    return c.json(
      { ok: false, message: error.message || "Error al iniciar sesión" },
      500
    );
  }
}
