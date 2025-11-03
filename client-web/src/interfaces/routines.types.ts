export const ExerciseCategory = ["cardio", "strength"] as const;
export type ExerciseCategoryType = (typeof ExerciseCategory)[number];

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: ExerciseCategoryType;
  duration_minutes: number;
  calories_burned: number;
}

export interface Workout {
  id: number;
  user_id: number;
  exercise_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
}
