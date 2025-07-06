// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Base URL for all API requests
});

// Interceptor to handle expired tokens and other auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute =
      error.config.url === "/user/login" || error.config.url === "/user/signup";

    if (error.response && error.response.status === 401 && !isAuthRoute) {
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Chat-App");

  const cloudinaryAPI = "https://api.cloudinary.com/v1_1/dr8gzltrw/auto/upload";

  const response = await fetch(cloudinaryAPI, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  const result = await response.json();

  // This is the crucial correction logic
  let correctedUrl = result.secure_url;
  if (result.resource_type !== "image") {
    correctedUrl = correctedUrl.replace(
      "/image/upload/",
      `/${result.resource_type}/upload/`
    );
  }

  // Return an object with all the necessary, correct information
  return {
    url: correctedUrl,
    resourceType: result.resource_type,
    fileType: file.type, // Also return the browser-detected file type
  };
};

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

export const updateGroupDetails = (updateData, token) => {
  return api.put("/chat/group/update", updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
