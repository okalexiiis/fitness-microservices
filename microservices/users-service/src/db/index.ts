import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "./schema";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10, // máximo de conexiones en el pool
  idle_timeout: 30, // cerrar conexiones inactivas después de 30s
});

export const db = drizzle(sql, { schema: { users } });
