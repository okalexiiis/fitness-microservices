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
