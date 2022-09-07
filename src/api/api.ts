import axios from "axios";
import { UserDetails } from "../types/types";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

apiClient.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const userDetails = JSON.parse(userString);
      const token = (userDetails as UserDetails).token;
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default apiClient;
