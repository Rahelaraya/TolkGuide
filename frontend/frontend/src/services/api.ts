import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Bra central plats för loggning
    console.error("API error:", err?.response?.data ?? err.message);
    return Promise.reject(err);
  }
);

