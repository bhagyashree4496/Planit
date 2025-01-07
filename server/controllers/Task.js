const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  const { title, points } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID from the JWT

  try {
    const task = await Task.create({
      title,
      points,
      userId, // Store userId in the task
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tasks for the logged-in user
const getTasks = async (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID from the JWT
  console.log(userId);
  try {
    const tasks = await Task.find({ userId }); // Fetch tasks only for the logged-in user
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the authenticated user's ID from the JWT

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId }, // Only allow updating tasks created by the logged-in user
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a new point to a task
const addTaskPoint = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;
  const userId = req.user._id; // Get the authenticated user's ID from the JWT

  try {
    const task = await Task.findOne({ _id: taskId, userId }); // Ensure task belongs to the logged-in user

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.points.push({ text });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a point from a task
const deleteTaskPoint = async (req, res) => {
  const { taskId, pointId } = req.params;
  const userId = req.user._id; // Get the authenticated user's ID from the JWT

  try {
    const task = await Task.findOne({ _id: taskId, userId }); // Ensure task belongs to the logged-in user

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const point = task.points.id(pointId);

    if (!point) {
      return res.status(404).json({ error: "Point not found" });
    }

    point.remove();
    await task.save();
    res.json({ message: "Point deleted", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Get the authenticated user's ID from the JWT

  try {
    const task = await Task.findOneAndDelete({ _id: id }); // Ensure task belongs to the logged-in user

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  addTaskPoint,
  deleteTaskPoint,
  deleteTask,
};
