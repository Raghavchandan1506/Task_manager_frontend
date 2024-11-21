import React, { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { CreateTask, DeleteTask, GetAllTasks, UpdateTask } from "./api";

const TaskManager = () => {
  const [input, setInput] = useState("");
  const [Tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);

  // Utility function for notifications
  const notify = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const handleTask = () => {
    if (updateTask && input) {
      const obj = {
        taskName: input,
        isDone: updateTask.isDone,
        _id: updateTask._id,
      };
      handleUpdateTask(obj);
      setUpdateTask(null);
    } else if (updateTask === null && input) {
      handleAddTask();
    }
    setInput("");
  };

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);

  const handleAddTask = async () => {
    const obj = {
      taskName: input,
      isDone: false,
    };
    try {
      const { success, message } = await CreateTask(obj);
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }
      setInput("");
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      notify("Failed to create task", "error");
    }
  };

  const handleUpdateTask = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: isDone,
    };
    try {
      const { success, message } = await UpdateTask(_id, obj);
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      notify("Failed to update task", "error");
    }
  };

  const fetchAllTasks = async () => {
    try {
      const { data } = await GetAllTasks();
      setTasks(data);
      setCopyTasks(data);
    } catch (error) {
      console.error(error);
      notify("Failed to load tasks", "error");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTask(id);
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      notify("Failed to delete tasks", "error");
    }
  };

  const handleCheckAndUncheck = async (item) => {
    const { _id, isDone, taskName } = item;
    const obj = {
      taskName,
      isDone: !isDone,
    };
    try {
      const { success, message } = await UpdateTask(_id, obj);
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      notify("Failed to check tasks", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const oldTask = [...copyTasks];
    const results = oldTask.filter((item) =>
      item.taskName.toLowerCase().includes(term)
    );
    setTasks(results);
  };

  return (
    <div className="px-4">
      <div>
        <h1 className="text-center text-4xl sm:text-5xl font-bold mt-5">
          TASK MANAGER APP
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-center gap-6 mt-14">
        {/* Add Task Section */}
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 rounded-md w-full sm:w-auto"
            placeholder="Add Task Here"
          />
          <button
            className="bg-green-500 p-1 -ml-6 rounded-e-md"
            onClick={handleTask}
          >
            <FaPlus />
          </button>
        </div>

        {/* Search Task Section */}
        <div className="flex">
          <input
            onChange={handleSearch}
            type="text"
            className="border-2 rounded-md w-full sm:w-auto"
            placeholder="Search Task Here"
          />
          <button className="bg-slate-300 p-1 -ml-6 rounded-e-md">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-full mt-10 space-y-4">
        {Tasks.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-center sm:justify-between border-2 rounded-md p-3 w-full sm:w-96 text-lg"
          >
            <span
              className={
                item.isDone ? "line-through font-serif text-lg" : "text-lg"
              }
            >
              {item.taskName}
            </span>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                className="bg-green-500 p-1 rounded-md"
                onClick={() => handleCheckAndUncheck(item)}
              >
                <FaCheck />
              </button>
              <button
                className="bg-blue-500 p-1 rounded-md"
                onClick={() => setUpdateTask(item)}
              >
                <FaEdit />
              </button>
              <button
                className="bg-red-500 p-1 rounded-md"
                onClick={() => handleDeleteTask(item._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Container for Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TaskManager;
