import z from "zod";
import { DateRange } from "../types/date-range";
import { querySchema } from "../types/api-types";

export interface DailySummary {
  id: number;
  user_id: number;
  date: string; // Drizzle usa string para los Dates
  total_calories_consumed: number;
  total_calories_burned: number;
  workouts_completed: number;
}

export const dailySummarySchema = z.object({
  user_id: z.number({ error: "user_id needs to be number" }),
  weight: z.number({ error: "weight needs to be number" }),
  total_calories_consumed: z.number(),
  total_calories_burned: z.number(),
  workouts_completed: z.number(),
  date: z.iso.date({ error: "date needs to be a valid date" }),
});

export const createDailySummarySchema = dailySummarySchema;
export type createDailySummaryDTO = z.infer<typeof createDailySummarySchema>;

export const updateDailySummarySchema = dailySummarySchema.partial();
export type updateDailySummaryDTO = z.infer<typeof updateDailySummarySchema>;

export const dailySummaryFiltersSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  date_range: z.enum(DateRange).optional(),
  date: z.iso.date().optional(),
});
export type TDailySummaryFilters = z.infer<typeof dailySummaryFiltersSchema>;

export const dailySummaryQuerySchema = dailySummaryFiltersSchema.and(querySchema);
export type TDailySummaryQuery = z.infer<typeof dailySummaryQuerySchema>;
