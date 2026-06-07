import axios from "axios";
import { BASE_URL } from "../../utils/constants";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      ...error,
      message: typeof message === "string" ? message : JSON.stringify(message),
    });
  },
);

export default api;
