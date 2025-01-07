import axios from "axios";

export const getTasks = async () => {
  const token = localStorage.getItem("tokentodo");
  const res = await axios.get("https://planit-tan.vercel.app/api/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
export const AddTasks = async (newTask) => {
  const token = localStorage.getItem("tokentodo");
  const res = await axios.post(
    "https://planit-tan.vercel.app/api/tasks",
    newTask,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(res);
  return res;
};
export const DeleteTasks = async (id) => {
  const token = localStorage.getItem("tokentodo");
  await axios.delete(`https://planit-tan.vercel.app/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// export const AddPointStatus = async (taskid, pointsid, newpoint) => {
//   const res = await axios.put(
//     `https://planit-tan.vercel.app/api/tasks/${taskid}/points/${pointsid}`,
//     newTask,
//     {
//       // headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   console.log(res);
//   return res;
// };
export const updateTask = async (taskid, newpoints) => {
  const token = localStorage.getItem("tokentodo");
  const res = await axios.put(
    `https://planit-tan.vercel.app/api/tasks/${taskid}`,
    newpoints,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(res);
  return res;
};
