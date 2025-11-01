export interface Workout {
  id: number;
  user_id: number;
  exercise_id: number;
  date: string;
  completed: boolean;
  notes: string | null;
}

export interface createWorkoutDTO extends Omit<Workout, "id"> {}
export interface updateWorkoutDTO extends Partial<Workout> {}

export interface workoutFilters
  extends Partial<
    Pick<Workout, "id" | "completed" | "date" | "exercise_id" | "user_id">
  > {}
