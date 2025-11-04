import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';
export * from "./schemas/daily-summary"
export * from "./schemas/weight-log"

export const client = new SQL(process.env.DATABASE_URL!);
export const db = drizzle({ client });
