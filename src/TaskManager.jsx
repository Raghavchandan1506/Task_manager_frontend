import React, { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { CreateTask, DeleteTask, GetAllTasks, UpdateTask } from "./api";
import { notify } from "./utils";

const TaskManager = () => {
  const [input, setInput] = useState("");

  const [Tasks, setTasks] = useState([]);

  const [copyTasks, setCopyTasks] = useState([]);

  const [updateTask , setUpdateTask] = useState(null);


  const handleTask = ()=>{
    if(updateTask && input){
        const obj = {
            taskName: input,
            isDone : updateTask.isDone,
            _id: updateTask._id
        }
        handleUpdateTask(obj);
        setUpdateTask (null);
    }else if(updateTask === null && input){
        handleAddTask();
    }
    setInput('');
  }


  useEffect(()=>{
    if(updateTask){
        setInput(updateTask.taskName);
    }
  },[updateTask])






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
      setInput('');
      await fetchAllTasks();
    } catch (error) {
      console.error(error);
      notify("Failed to create task", "error");
    }
  };







  const handleUpdateTask = async(item)=>{
    const{_id, isDone, taskName} = item;
    const obj = {
        taskName,
        isDone: isDone
    }
    try {
        const { success, message } = await UpdateTask(_id,obj);
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
  }






  const fetchAllTasks = async()=>{
    try {
        const { data } = await GetAllTasks();
                setTasks(data);
                setCopyTasks(data);
                
      } catch (error) {
        console.error(error);
        notify("Failed to load tasks", "error");
      }
  }

  useEffect(()=>{
        fetchAllTasks()
  },[])






  const handleDeleteTask = async(id)=>{
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
  }






  const handleCheckAndUncheck = async(item)=>{
    const{_id, isDone, taskName} = item;
    const obj = {
        taskName,
        isDone: !isDone
    }
    try {
        const { success, message } = await UpdateTask(_id,obj);
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
  }






  const handleSearch = (e)=>{
    const term = e.target.value.toLowerCase();
    const oldTask = [...copyTasks];
    const results = oldTask.filter((item)=> item.taskName.toLowerCase().includes(term));
    setTasks(results);
  }





  return (
    <div>
      <div>
        <h1 className="text-center text-5xl font-bold mt-5">
          TASK MANAGER APP
        </h1>
      </div>
      <div className="flex justify-center gap-20">
        <div className="flex mt-14">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 rounded-md"
            placeholder="Add Task Here"
          />
          <button
            className="bg-green-500 p-1 -ml-6 rounded-e-md"
            onClick={handleTask}
          >
            <FaPlus />
          </button>
        </div>

        <div className="flex mt-14">
          <input
          onChange={handleSearch}
            type="text"
            className="border-2 rounded-md"
            placeholder="Search Task Here"
          />
          <button className="bg-slate-300 p-1 -ml-6 rounded-e-md">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center w-100">
        {
            Tasks.map((item)=>(
                <div key={item._id} className=" flex border-2 rounded-md  mt-10 justify-between w-96 text-lg">
          <span className={item.isDone ? "line-through font-serif text-lg" : " "}>{item.taskName}</span>
          <div>
            <button className="bg-green-500 p-1 m-1 rounded-md"
            onClick={()=> handleCheckAndUncheck(item)
            }>
              <FaCheck />
            </button>
            <button className="bg-blue-500 p-1 m-1 rounded-md"
            onClick={()=>setUpdateTask(item)}>
              <FaEdit />
            </button>
            <button className="bg-red-500 p-1 m-1 rounded-md"
            onClick={()=>handleDeleteTask(item._id)}>
              <FaTrash />
            </button>
          </div>
        </div>
            ))
        }
      </div>
      {/* <ToastContainer
        position="top-right" // Corrected position prop
        autoClose={3000} // Duration for auto-closing the toast
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Display new toasts on top
        closeOnClick // Close the toast on click
        rtl={false} // Right-to-left support
        pauseOnFocusLoss // Pause toast when window loses focus
        draggable // Allow drag and drop to dismiss toast
        pauseOnHover // Pause toast on hover
      /> */}
    </div>
  );
};

export default TaskManager;
