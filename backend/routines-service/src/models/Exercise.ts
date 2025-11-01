export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  calories_burned: number;
}

export interface createExerciseDTO extends Omit<Exercise, "id"> {}
export interface updateExercuseDTO extends Partial<createExerciseDTO> {}

export const ExerciseCategory = ["cardio", "stregth"] as const
export type ExerciseCategoryType = typeof ExerciseCategory[number]
