const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const storage = require("node-persist");

async function start() {
  app.use(cors());

  await storage.init(); // Change to initSync for synchronous operation

  // Clear old data on server start
  await storage.clear();

  app.use(express.json());

  app.post("/addTask", async (req, res) => {
    try {
      const todo = req.body.todo;
      const todos = (await storage.getItem("tasks")) || [];
      todos.push(todo); // Fix: Use todos.push(todo) instead of tasks.push(todo)
      await storage.setItem("tasks", todos); // Save the updated array back to storage
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "500, Server Error" });
    }
  });

  app.get("/getTasks", async (req, res) => {
    try {
      const todos = (await storage.getItem("tasks")) || [];
      res.json({ todos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "500, Server Error" });
    }
  });

  app.post("/deleteTask", async (req, res) => {
    try {
      const index = req.body.todos;
      const todos = (await storage.getItem("tasks")) || [];
      
      if (index >= 0 && index < todos.length) {
        todos.splice(index, 1);
        await storage.setTodos("tasks", todos);
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, error: "Invalid index" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "500, Server Error" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

start();
