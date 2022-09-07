import { LoginPostData, RegisterPostData, UserDetails } from "../types/types";
import apiClient from "./api";

export const login = async (data: LoginPostData) => {
  return await apiClient.post<UserDetails>("/auth/login", data);
};

export const register = async (data: RegisterPostData) => {
  return await apiClient.post<UserDetails>("/auth/register", data);
};
