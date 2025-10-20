import { Context } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { Response} from "../common/ResponseMapper";
import { RegisterUserDTO } from "../models/dtos/register-user.dto";
import { customLogger } from "../common/Logger";
import { PostgresError } from "postgres";

export async function RegisterController(c: Context) {
  try {
    const body = await c.req.json() as RegisterUserDTO;
    const { altura_cm, edad, email, nombre, password, peso_kg, sexo } = body;

    customLogger("creating a user", `Data received for creation: ${JSON.stringify(body)}`);

    const newUser = await db.insert(users).values({
      nombre,
      email,
      password,
      edad,
      sexo,
      altura_cm,
      peso_kg: peso_kg.toString(), // Drizzle decimal necesita string
    }).returning();

    customLogger('A user has been created', `User created: ${JSON.stringify(newUser[0])}`);

    return c.json(new Response(newUser[0], 201, "User created"), 201);

  } catch (error: any) {
        customLogger('Something Happened', `Stack: ${JSON.stringify(error, null, 2)}`);
        // Detectar unique constraint violation
        if (error?.cause?.code === '23505') {
            return c.json(new Response(null, 400, "User with that email already exists"), 400);
        }
        return c.json(new Response(null, 500, "Internal server error"), 500);
    }
}
