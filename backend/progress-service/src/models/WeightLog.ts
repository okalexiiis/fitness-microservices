import z from "zod";
import { DateRange } from "../types/date-range";
import { querySchema } from "../types/api-types";

export interface WeightLog {
  id: number;
  user_id: number;
  weight: number;
  date: string;
}

export const weightLogSchema = z.object({
  user_id: z.number({ error: "user_id needs to be number" }),
  weight: z.number({ error: "weight needs to be number" }),
  date: z.iso.date({ error: "date needs to be a valid date" }).default(new Date().toISOString()),
});

export const createWeightLogSchema = weightLogSchema;
export type createWeightLogDTO = z.infer<typeof createWeightLogSchema>;

export const updateWeightLogSchema = weightLogSchema.partial();
export type updateWeightLogDTO = z.infer<typeof updateWeightLogSchema>;

export const weightLogFiltersSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  date_range: z.enum(DateRange).optional(),
  date: z.iso.date().optional(),
});
export type TWeightLogFilters = z.infer<typeof weightLogFiltersSchema>;

export const weightLogQuerySchema = weightLogFiltersSchema.and(querySchema);
export type TWeightLogQuery = z.infer<typeof weightLogQuerySchema>;
