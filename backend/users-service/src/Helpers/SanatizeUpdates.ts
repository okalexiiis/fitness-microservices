import { User } from "../Models/user";

// Convierte Date a string antes de enviar a Drizzle
export function sanitizeUpdates(updates: Partial<User>) {
  const result: Record<string, string | number | undefined> = {};
  for (const [key, value] of Object.entries(updates)) {
    result[key] = value as string | number | undefined;
  }
  return result;
}
