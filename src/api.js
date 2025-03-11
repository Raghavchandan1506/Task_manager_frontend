import { API_URL } from "./utils";

const apiCall = async (endpoint, method = "GET", body = null) => {
  const url = `${API_URL}/api/v1/Todos/${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};

export const CreateTask = (taskobj) => apiCall("createTask", "POST", taskobj);
export const GetAllTasks = () => apiCall("AllTasks");
export const DeleteTask = (id) => apiCall(`deleteTask/${id}`, "DELETE");
export const UpdateTask = (id, body) => apiCall(`updateTask/${id}`, "PUT", body);
