import { Context } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { Response} from "../common/ResponseMapper";

export async function GetAllController(c: Context) {
    try {
        const allUsers = await db.select().from(users)
        return c.json(new Response(allUsers, 201, "All Users"))
    } catch (error) {
        return c.json(new Response(null, 500, "Internal server error"), 500);
    }
} 