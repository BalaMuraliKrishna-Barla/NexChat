// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Base URL for all API requests
});

// Interceptor to handle expired tokens and other auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// --- User Routes ---
export const loginUser = (email, password) => {
  return api.post("/user/login", { email, password });
};
export const registerUser = (userData) => {
  return api.post("/user/signup", userData);
};
export const searchUsers = (searchQuery, token) => {
  return api.get(`/user?search=${searchQuery}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Chat Routes ---
export const fetchChats = (token) => {
  return api.get("/chat", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const accessChat = (userId, token) => {
  return api.post(
    `/chat`,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
// NEW: Added the missing createGroupChat function
export const createGroupChat = (groupData, token) => {
  return api.post(`/chat/group`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Message Routes ---
export const fetchMessages = (chatId, token) => {
  return api.get(`/message/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const sendMessage = (messageData, token) => {
  return api.post(`/message`, messageData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;
