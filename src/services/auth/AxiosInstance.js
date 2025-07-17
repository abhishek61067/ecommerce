import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://api.freeapi.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If 401 error and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // Call your refresh endpoint
        const res = await axios.post(
          "https://api.freeapi.app/api/v1/users/refresh-token",
          { refreshToken }
        );
        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        // Optionally clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
