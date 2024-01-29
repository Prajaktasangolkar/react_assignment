

import React, { useState, useEffect } from "react";
import axios from 'axios'

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    // Fetch tasks on component mount
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/getTasks");
    setTodos(response.data.todos);
  };

  const addTask = async () => {
    await axios.post("http://localhost:5000/addTask", { todo });
    fetchTasks(); // Refresh tasks after adding
    setTodo(""); // Clear input
  };
  const handleDelete = async (index) => {
    try {
      const updatedTodos = [...todos];
      updatedTodos.splice(index, 1); // Remove the todo at the specified index
      await axios.post("http://localhost:5000/deleteTask", { index });
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
 <div className=" container rounded-3 border border-2 border-dark my-5 bg-white">

 <div className="text-center">
    <h1 className="h1 my-3">To Do List App</h1>
   
    <div className="row">
            <div className=" col-8">
        <input className=" py-3 form-control shadow"
         placeholder="Input your task" 
         type="text" 
         id="inputText"
         value={todo}
         onChange={(e) => setTodo(e.target.value)}
         onKeyUp={(e) => {
             if (e.code === "Space"  || e.code === "Enter"){
              if (todo !== '') {
                addTask();
              }
              
             }
         }}   
         /> 
            </div>
            <div className="col-2">
            
                <button onClick={addTask} className=" mt-2 btn btn-dark"> Add </button>
       
            </div>
        </div>
    </div>
        <hr/>
    <div className="row rounded bg-white">
        <div className=" col-8"> 
        <ul className=" list-group" id="list">
        {todos && todos.map((todo, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          <div className='py-6 px-4 my-1 form-control shadow'>{todo}</div>
          <button className="btn btn-danger" onClick={() => handleDelete(index)}>
            Delete
          </button>
        </li>

        ))}
        </ul>
         </div> 
    </div>
       
 </div> 
    </>
  );
}

export default App;
