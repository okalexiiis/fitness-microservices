export function sanitizeUpdates<T extends Record<string, any>>(
  updates: Partial<T>
): Partial<Record<keyof T, number | string>> {
  const result: Partial<Record<keyof T, number | string>> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === "string" || typeof value === "number") {
      result[key as keyof T] = value;
    } else if (typeof value === "object" && value !== null && "toNumber" in value) {
      // Si es un Decimal de Drizzle, convertir a number
      result[key as keyof T] = (value as any).toNumber();
    }
  }

  return result;
}
