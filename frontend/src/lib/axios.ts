import axios from "axios";

/**
 * Ambil baseURL dari Vite env
 * Contoh: https://squadtix.konsolnasbawasluri.com
 */
const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  window.location.origin;

const api = axios.create({
  baseURL,
  withCredentials: true, // kalau pakai session/cookie
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default api;
