import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000, // 10 second timeout
});

// Automatically attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid, and NOT on login page/request, redirect to login
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/api/auth/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = async (email, password) => {
  const response = await API.post("/api/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (username, email, password, confirmPassword) => {
  const response = await API.post("/api/auth/register", {
    username,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

// Admin endpoints
export const getAdminStats = async () => {
  const response = await API.get("/api/admin/stats");
  return response.data;
};

export const listAllUsers = async () => {
  const response = await API.get("/api/admin/users");
  return response.data;
};

export const changeUserRole = async (id, role) => {
  const response = await API.put(`/api/admin/users/${id}/role`, null, {
    params: { role },
  });
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await API.put(`/api/admin/users/${id}/status`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/api/admin/users/${id}`);
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await API.post("/api/admin/staff", staffData);
  return response.data;
};

// Staff endpoints
export const getStaffProfile = async () => {
  const response = await API.get("/api/staff/profile");
  return response.data;
};

// Customer endpoints
export const getCustomerProfile = async () => {
  const response = await API.get("/api/users/profile");
  return response.data;
};

export default API;