import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
const isTokenExpired = (token) => {
  const decode = jwtDecode(token);
  return decode.exp * 1000 < Date.now();
};
const HttpApi = axios.create({
  baseURL: 'http://localhost:9000',
});
HttpApi.interceptors.request.use(
  (config) => {
  const token=localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
   return Promise.reject(error);
  }
);

HttpApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const isOffline = !window?.navigator?.onLine;
    if (isOffline) {
      return toast.error("No internet connection. Please check your network.");
    }
    if (!error?.response) {
      return toast.error("Unable to reach server. Please try again later.");
    }
    const { status, data } = error?.response;
    if (status === 401) {
      localStorage.clear();
      toast.error("Session expired. Please login again.");
      window.location.replace("/login");
      return;
    }
    return error;
  }
);

export  {HttpApi,isTokenExpired};