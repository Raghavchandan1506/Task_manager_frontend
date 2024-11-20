import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TaskManager from "./TaskManager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TaskManager />
  </React.StrictMode>
);
