import { toast } from "react-toastify";

export const notify = (message, type) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
};

export const API_URL = "http://localhost:8080";
