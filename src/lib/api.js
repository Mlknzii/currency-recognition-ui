import apiClient from "./axios";
import { setToken, removeToken } from "./auth";

/* ===========================
   Predictions APIs
=========================== */

export const getPredictions = async () => {
  const res = await apiClient.get("/predict/history");
  return res.data;
};

export const getSinglePrediction = async (id) => {
  const res = await apiClient.get(`/predict/${id}`);
  return res.data;
};

export const clearPredictions = async () => {
  const res = await apiClient.delete("/predict/clear");
  return true;
};

/* ===========================
   Authentication APIs
=========================== */

export const registerUser = async (full_name, email, password) => {
  const res = await apiClient.post("/auth/register", {
    full_name,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await apiClient.post("/auth/login", {
    email,
    password,
  });

  const { access_token } = res.data;
  if (access_token) setToken(access_token);

  return res.data;
};

// Delete User
export async function deleteCurrentUser() {
  const res = await apiClient.delete("/auth/me");
  return res.data;
}

export const getCurrentUser = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const logoutUser = () => {
  removeToken();
};
