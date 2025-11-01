export function sanitizeUpdates<T extends Record<string, any>>(
  updates: Partial<T>
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "object" && "toNumber" in (value as any)) {
      (result as any)[key] = (value as any).toNumber();
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}
