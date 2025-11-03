import { eq, inArray, SQL } from "drizzle-orm";

interface ApplyFilters<TTable, TFilters extends Record<string, any>> {
  query: any; // Podrías tiparlo si usas un tipo de query específico
  filters?: TFilters;
  entity: TTable;
}

export function applyFilters({
  query,
  filters,
  entity,
}: ApplyFilters<any, any>) {
  if (!filters) return query;

  return Object.entries(filters).reduce((q, [key, value]) => {
    const column = entity[key];
    if (!column || value === undefined || value === null) return q;

    if (Array.isArray(value)) {
      return q.where(inArray(column as SQL, value));
    }

    if (typeof value === "number") {
      if (isNaN(value)) return q;
      return q.where(eq(column as SQL, value));
    }

    if (typeof value === "string" || typeof value === "boolean") {
      return q.where(eq(column as SQL, value));
    }

    return q;
  }, query);
}
