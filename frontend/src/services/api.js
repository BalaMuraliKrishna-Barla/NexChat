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
export const updateUserProfile = (userData, token) => {
  return api.put("/user/profile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// --- End - User Routes ---

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

// --- End - Chat Routes ---


// --- Group Chat Routes ---

export const createGroupChat = (groupData, token) => {
  return api.post(`/chat/group`, groupData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const renameGroup = (chatId, chatName, token) => {
  return api.put(
    "/chat/rename",
    { chatId, newChatName: chatName },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const addUserToGroup = (chatId, userId, token) => {
  return api.put(
    "/chat/add-to-group",
    { chatId, userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeUserFromGroup = (chatId, userId, token) => {
  return api.put(
    "/chat/remove-from-group",
    { chatId, userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// --- End - Group Chat Routes ---



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

// --- End - Message Routes ---



export default api;
