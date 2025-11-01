export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: ExerciseCategoryType;
  duration_minutes: number;
  calories_burned: number;
}

export interface createExerciseDTO extends Omit<Exercise, "id"> {}
export interface updateExerciseDTO extends Partial<createExerciseDTO> {}

export const ExerciseCategory = ["cardio", "stregth"] as const;
export type ExerciseCategoryType = (typeof ExerciseCategory)[number];

export type ExerciseFilters = Partial<
  Pick<Exercise, "id" | "name" | "category">
>;
