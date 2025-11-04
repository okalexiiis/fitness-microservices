import type { User } from "@users/types";

export interface Auth {
  token: string;
  user: Pick<User, "id" | "email" | "name" >;
}
