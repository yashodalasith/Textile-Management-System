import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../tokenStore";

const API_BASE = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send/receive refresh cookie
});

// attach access token from memory
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auto refresh once on 401 (single-flight)
let isRefreshing = false;
let queue = [];

const flush = (err, token = null) => {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (newToken) => {
              if (newToken) original.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_BASE}/login/refresh`, {}, { withCredentials: true });
        const newToken = data?.accessToken;
        if (!newToken) throw new Error("No access token in refresh response");
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        flush(null, newToken);
        return api(original);
      } catch (e) {
        flush(e, null);
        clearAccessToken();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
