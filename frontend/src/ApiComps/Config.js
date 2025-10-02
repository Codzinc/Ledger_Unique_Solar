// Config.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: false, // JWT ke liye false
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!error.response) return Promise.reject(error);

    // ✅ Agar request me Authorization header hi nahi tha (jaise login request)
    // to refresh token logic skip karo
    const isAuthRequest = !!originalRequest?.headers?.Authorization;

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      isAuthRequest // ✅ sirf token-based requests ke liye retry hoga
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = "Bearer " + token;
              return api(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        isRefreshing = false;
        processQueue(null, null);
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const res = await api.post("/token/refresh/", { refresh });

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        api.defaults.headers.common["Authorization"] = "Bearer " + newAccess;

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = "Bearer " + newAccess;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        processQueue(err, null);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
