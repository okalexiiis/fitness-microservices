import { ApiResponse } from "../interfaces/api-types";
import { User } from "../interfaces/users";

export const USERS_API = "http://users-service:4000";

export const GetUserByID = async (id: number): Promise<number> => {
  const res = await fetch(`${USERS_API}/${id}`);
  const user: ApiResponse<User> = await res.json();
  return user.data.id
};
