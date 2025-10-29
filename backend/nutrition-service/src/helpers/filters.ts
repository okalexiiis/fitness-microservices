import { eq, inArray, SQL } from "drizzle-orm";

interface ApplyFilters<TTable, TFilters extends Record<string, any>> {
  query: any; // Podrías tiparlo si usas un tipo de query específico
  filters?: TFilters;
  entity: TTable;
}

export function applyFilters<TTable extends Record<string, any>, TFilters extends Record<string, any>>({
  query,
  filters,
  entity,
}: ApplyFilters<TTable, TFilters>) {
  if (!filters) return query;

  return Object.entries(filters).reduce((q, [key, value]) => {
    const column = entity[key as keyof TTable];
    if (!column) return q;

    if (Array.isArray(value)) {
      return q.where(inArray(column as SQL, value));
    } else if (typeof value === "string" || typeof value === "number") {
      return q.where(eq(column as SQL, value));
    }

    return q;
  }, query);
}
