import { AxiosError } from "axios";

export const checkResponseCode = (err: AxiosError) => {
  if (err.response?.status === 401) {
    logout();
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};
