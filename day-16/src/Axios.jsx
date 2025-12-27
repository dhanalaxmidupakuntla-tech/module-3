import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://axios-870de-default-rtdb.asia-southeast1.firebasedatabase.app/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
