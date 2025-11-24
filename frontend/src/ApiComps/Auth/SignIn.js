import api from "../Config";

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login/", credentials);
  return response.data;
};