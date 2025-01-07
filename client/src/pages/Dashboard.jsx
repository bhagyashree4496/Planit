import React, { useContext, useEffect, useState } from "react";
import { AddTasks, DeleteTasks, getTasks, updateTask } from "../api/api"; // Assuming `updateTask` API is available
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Dashboard = () => {
  const [tasks, setTasks] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", points: [] });
  const [newPoint, setNewPoint] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
      console.log(token);
    } catch (err) {
      console.log(err);
      if (err.message === "Request failed with status code 401") {
        setError("Please Login, your session has expired");
        navigate("/login");
      } else {
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (newTask.points.length === 0) {
      setError("Please add at least one point.");
      return;
    }
    try {
      const { data } = await AddTasks(newTask);
      setTasks([...tasks, data]);
      setNewTask({ title: "", points: [] });
      setNewPoint("");
      setIsModalOpen(false); // Close modal after adding task
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleAddPoint = () => {
    if (newPoint.trim()) {
      const newPointObj = { text: newPoint, completed: false };
      setNewTask({ ...newTask, points: [...newTask.points, newPointObj] });
      setNewPoint("");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await DeleteTasks(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const togglePointCompletion = async (taskId, pointIndex) => {
    try {
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          task.points[pointIndex].completed =
            !task.points[pointIndex].completed;
        }
        return task;
      });

      setTasks([...updatedTasks]);

      await updateTask(taskId, {
        points: updatedTasks.find((task) => task._id === taskId).points,
      });
    } catch (err) {
      setError("Failed to update task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);
  if (!tasks) {
    return <p className="  p-8 relative">Loading...</p>;
  }

  return (
    <div className="  p-8 relative">
      {error && <p className="text-red-500">{error}</p>}
      {/* Task List */}
      {!tasks.length && !error ? (
        <p className=" ">No tasks found. Plese add your today's tasks...</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow"
            >
              <div>
                {console.log(task)}
                <h3 className="font-bold">{task.title}</h3>
                <ul className="list-disc  ">
                  {task.points.map((point, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={point.completed}
                        onChange={() => togglePointCompletion(task._id, index)}
                        className="mr-2"
                      />
                      <span
                        className={
                          point.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        {point.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="bg-purple-200 border-[1px] border-white px-6 py-2 rounded-full hover:bg-purple-800 hover:text-white font-semibold hover:border-white"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Floating Add Task Button */}
      <button
        onClick={() => {
          if (token) {
            setIsModalOpen(true);

            return;
          }
          setError("Please Login/Register before adding tasks.");
        }}
        className="fixed top-36 right-8 bg-purple-200 border-[1px] border-purple-800 px-6 py-2 rounded-full hover:bg-purple-800 hover:text-white font-semibold hover:border-white text-xl"
      >
        Add Task
      </button>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="border rounded p-2 w-full mb-4 focus:outline-none"
              />
              <div className="mb-4">
                <h4 className="font-bold">Tasks:</h4>
                <ul className="list-disc pl-6">
                  {newTask.points.map((point, index) => (
                    <li key={index}>
                      {point.text} {point.completed && "(Completed)"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add a Task"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  className="border rounded p-2 w-full mb-2 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="bg-purple-200 border-[1px] border-white px-6 py-2 rounded-full hover:bg-purple-800 hover:text-white font-semibold hover:border-white w-full"
                >
                  Add this task
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-purple-200 border-[1px] border-white px-6 py-2 rounded-full hover:bg-purple-800 hover:text-white font-semibold hover:border-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-200 border-[1px] border-white px-6 py-2 rounded-full hover:bg-purple-800 hover:text-white font-semibold hover:border-white"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
