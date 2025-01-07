const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addTaskPoint, // Add new point to a task
  updateTaskPoint, // Update a specific point in a task
  deleteTaskPoint, // Delete a specific point in a task
} = require("../controllers/Task");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming auth is required
const router = express.Router();

// Task routes
router.post("/", authMiddleware, createTask); // Create a new task
router.get("/", authMiddleware, getTasks); // Get all tasks
router.put("/:id", authMiddleware, updateTask); // Update a task
router.delete("/:id", authMiddleware, deleteTask); // Delete a task

// Point-specific routes
router.post("/:taskId/points", addTaskPoint); // Add a new point to a task
//router.put("/:taskId/points/:pointId", updateTaskPoint); // Update a specific point in a task
router.delete("/:taskId/points/:pointId", deleteTaskPoint); // Delete a specific point in a task

module.exports = router;
