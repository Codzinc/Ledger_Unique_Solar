import api from "../Config";
import { toast } from "react-toastify"; 
// Login
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login/", credentials);
    toast.success("Sign in successful!"); 
    return response.data;
  } catch (error) {
    toast.error("Invalid username or password"); 
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};