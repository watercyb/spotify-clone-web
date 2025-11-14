import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const res = error.response?.data?.message || "Internal server error.";
    if (res.startsWith("Unauthorized")) return "Unauthorized";
    return res;
  }
  return error;
};
