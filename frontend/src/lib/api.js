import axios from "axios";

// ✅ Use same host for all API calls
const instance = axios.create({
  baseURL: "http://127.0.0.1:5000", // or http://localhost:5000
});

let _token = "";
export function setToken(t) {
  _token = t;
}

// ✅ Automatically attach token for protected routes
instance.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`;
  return config;
});

// ✅ Standardize error handling
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  }
);

// ✅ Export helpers for all methods
const api = {
  setToken,
  get: (url, cfg) => instance.get(url, cfg),
  post: (url, data, cfg) => instance.post(url, data, cfg),
  put: (url, data, cfg) => instance.put(url, data, cfg),
  del: (url, cfg) => instance.delete(url, cfg),
};

export default api;
