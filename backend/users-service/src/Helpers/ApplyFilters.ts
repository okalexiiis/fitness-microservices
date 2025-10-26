import { eq, inArray } from "drizzle-orm";
import { usersTable } from "../Database/schemas/user";
import { UserFilters } from "../Interfaces/ApiTypes";
import { User } from "../Models/user";

// Aplica filtros dinámicos a una query
export function applyFilters(query: any, filters?: UserFilters) {
  if (!filters) return query;

  return Object.entries(filters).reduce((q, [key, value]) => {
    const column = usersTable[key as keyof User];
    if (!column) return q;

    if (Array.isArray(value)) {
      return q.where(inArray(column, value));
    } else if (typeof value === "string" || typeof value === "number") {
      return q.where(eq(column, value));
    }
    return q;
  }, query);
}