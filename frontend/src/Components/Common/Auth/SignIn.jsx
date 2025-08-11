import React, { useState } from "react";
import { loginUser } from "../../../ApiComps/Auth/SignIn";
import { toast } from "react-toastify";

export default function SignIn({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

 const validate = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success(`Welcome ${data.user?.first_name || "User"}!`);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      toast.error("Invalid username or password");
      setErrors({ general: "Invalid username or password" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-[#181829] shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#d8f276]">
          Sign In
        </h2>

      {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[#d8f276]">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white 
              ${
                errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-[#d8f276]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white
              ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d8f276] text-[#181829] cursor-pointer py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
