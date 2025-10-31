import { ApiResponse } from "../interfaces/api-types";
import { User } from "../interfaces/users";

export const USERS_API = "http://gateway:4000/api/users";

export const GetUserByID = async (id: number): Promise<number | null> => {
  const res = await fetch(`${USERS_API}/${id}`);
  const user: ApiResponse<User> = await res.json();
  console.log("User Data: ", user.data)
  return user.data[0].id || null
};
