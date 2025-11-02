import { z } from "zod";

export interface Workout {
  id: number;
  user_id: number;
  exercise_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
}

export const workoutBaseSchema = z.object({
  user_id: z.number().positive(),
  exercise_id: z.number().positive(),
  date: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  completed: z.boolean(),
  notes: z.string().max(500).nullable(),
});

export const createWorkoutSchema = workoutBaseSchema;
export type createWorkoutDTO = z.infer<typeof workoutBaseSchema>;
export const updateWorkoutSchema = workoutBaseSchema.partial();
export type updateWorkoutDTO = z.infer<typeof workoutBaseSchema>;

export const workoutFilterSchema = z.object({
  id: z.coerce.number().optional(),
  user_id: z.coerce.number().optional(),
  exercise_id: z.coerce.number().optional(),
  date: z.string().optional(),
  completed: z.boolean().optional(),
});
export type WorkoutFilters = z.infer<typeof workoutFilterSchema>;
