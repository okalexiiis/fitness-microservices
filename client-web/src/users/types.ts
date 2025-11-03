export const Goals = ["lose_weight", "gain_muscle", "maintain"] as const;
export type EGoals = (typeof Goals)[number];

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  age: number;
  height: number; // en cm
  weight: number; // en kg
  goal: EGoals;
  created_at: string;
}

export interface AuthUser extends Pick<User, "id"> {
  token: string;
}
