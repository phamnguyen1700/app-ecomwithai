import { get } from "@/util/Http";
import { User } from "@/types/user";

export const getMe = async (): Promise<User> => {
  const res = await get<User>("user/me");
  return res.data;
};