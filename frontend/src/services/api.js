import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Adjust if your proxy is set up differently
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("userInfo");
      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


export const loginUser = (email, password) => {
  return api.post("/user/login", { email, password });
};

export const registerUser = (userData) => {
  return api.post("/user/signup", userData);
};

export default api;
