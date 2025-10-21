import { Context } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { Response } from "../common/ResponseMapper";
import { RegisterUserDTO } from "../models/dtos/register-user.dto";
import { customLogger } from "../common/Logger";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export async function UpdateController(c: Context) {
  try {
    const id = Number(c.req.param("id"));
    const body = (await c.req.json()) as Partial<RegisterUserDTO>;

    customLogger("User Update Requested", `ID: ${id}`, `Body: ${JSON.stringify(body)}`);

    // Verificar si el usuario existe
    const existingUser = await db.select().from(users).where(eq(users.id, id));
    if (existingUser.length === 0) {
      customLogger("User Not Found", `Requested ID: ${id}`);
      throw new HTTPException(404, { message: "User not found" });
    }

    // Actualizar el usuario
    const updatedUser = await db
      .update(users)
      .set({
        nombre: body.nombre ?? existingUser[0].nombre,
        email: body.email ?? existingUser[0].email,
        password: body.password ?? existingUser[0].password,
        edad: body.edad ?? existingUser[0].edad,
        sexo: body.sexo ?? existingUser[0].sexo,
        altura_cm: body.altura_cm ?? existingUser[0].altura_cm,
        peso_kg: body.peso_kg ? body.peso_kg.toString() : existingUser[0].peso_kg,
      })
      .where(eq(users.id, id))
      .returning();

    customLogger("User Updated", `User updated: ${JSON.stringify(updatedUser[0])}`);

    return c.json(new Response(updatedUser[0], 200, "User updated successfully"), 200);
  } catch (error: any) {
    customLogger("Something Happened", `Stack: ${JSON.stringify(error, null, 2)}`);

    if (error instanceof HTTPException) {
        return c.json(new Response(error.cause, error.status, error.message), error.status);
    }

    if (error?.cause?.code === "23505") {
      return c.json(new Response(null, 400, "User with that email already exists"), 400);
    }

    return c.json(new Response(null, 500, "Internal server error"), 500);
  }
}
