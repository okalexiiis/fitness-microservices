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

