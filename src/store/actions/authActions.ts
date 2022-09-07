import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";
import * as authApi from "../../api/auth";
import {
  LoginPostData,
  RegisterPostData,
  UserDetails,
} from "../../types/types";
import { AppDispatch } from "../store";

export const authActions = {
  SET_USER_DETAILS: "AUTH.SET_USER_DETAILS",
};

export const getActions = (dispatch: AppDispatch) => {
  return {
    login: (data: LoginPostData, navigate: NavigateFunction) =>
      dispatch(login(data, navigate)),
    register: (data: RegisterPostData, navigate: NavigateFunction) =>
      dispatch(register(data, navigate)),
    setUserDetails: (userDetails: UserDetails) => {
      dispatch(setUserDetails(userDetails));
    },
  };
};

const setUserDetails = (userDetails: UserDetails) => {
  return {
    type: authActions.SET_USER_DETAILS,
    payload: userDetails,
  };
};

const login = (data: LoginPostData, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await authApi.login(data);
      const userDetails = res.data;
      localStorage.setItem("user", JSON.stringify(userDetails));

      dispatch(setUserDetails(userDetails));
      navigate("/dashboard");
      toast.success("Welcome back!");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    }
  };
};

const register = (data: RegisterPostData, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await authApi.register(data);
      const userDetails = res.data;
      localStorage.setItem("user", JSON.stringify(userDetails));

      dispatch(setUserDetails(userDetails));
      navigate("/dashboard");
      toast.success("Welcome!");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data);
      }
    }
  };
};
