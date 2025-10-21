import { Context } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { Response} from "../common/ResponseMapper";
import { customLogger } from "../common/Logger";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

export async function DeleteController(c: Context) {
    try {
        const id = Number(c.req.param("id"))
        customLogger('User by ID Requested',`Requested ID: ${id}`)
        const user = await db.select().from(users).where(eq(users.id, id))
        customLogger('User Data',`Requested ID: ${id}`, `Data Received: ${user}`)

        if (user.length <= 0) {
            customLogger('User Not Found',`Requested ID: ${id}`, `Data Received: ${user}`)
            throw new HTTPException(404, { message: "User not Found" })
        }

        await db.delete(users).where(eq(users.id, id));
        
        return c.json(new Response(null, 203, "User Deleted"))
    } catch (error) {
        customLogger('Something Happened', `Stack: ${error}`,)

        if (error instanceof HTTPException) {
            return c.json(new Response(null, error.status, error.message))
        }

        return c.json(new Response(null, 500, "Internal server error"), 500);
    }
} 