import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState({});
  const [taskInput, setTaskInput] = useState({});
  const [deadlineInput, setDeadlineInput] = useState({});

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/projects");
    setProjects(res.data);
  };

  const fetchTasks = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/tasks/${id}`);
    setTasks(prev => ({ ...prev, [id]: res.data }));
  };

  const addProject = async () => {
    if (!projectName) return;
    await axios.post("http://localhost:5000/api/projects", { name: projectName });
    setProjectName("");
    fetchProjects();
  };

  const deleteProject = async (id) => {
    await axios.delete(`http://localhost:5000/api/projects/${id}`);
    fetchProjects();
  };

  const editProject = async (id) => {
    const newName = prompt("Enter new project name:");
    if (!newName) return;
    await axios.put(`http://localhost:5000/api/projects/${id}`, { name: newName });
    fetchProjects();
  };

  const addTask = async (id) => {
    await axios.post("http://localhost:5000/api/tasks", {
      title: taskInput[id],
      deadline: deadlineInput[id],
      projectId: id
    });
    fetchTasks(id);
  };

  const completeTask = async (taskId, projectId) => {
    await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: "Completed" });
    fetchTasks(projectId);
  };

  const deleteTask = async (taskId, projectId) => {
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
    fetchTasks(projectId);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container">
      <h1>🚀 Project Manager</h1>

      <div className="top-bar">
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
        <button className="add-btn" onClick={addProject}>Add</button>
      </div>

      <div className="projects">
        {projects.map((p) => (
          <div className="card" key={p._id}>
            <h2>{p.name}</h2>

            <div className="actions">
              <button onClick={() => fetchTasks(p._id)}>📋</button>
              <button onClick={() => editProject(p._id)}>✏</button>
              <button onClick={() => deleteProject(p._id)}>🗑</button>
            </div>

            <div className="task-input">
              <input
                placeholder="Task"
                value={taskInput[p._id] || ""}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, [p._id]: e.target.value })
                }
              />
              <input
                type="date"
                value={deadlineInput[p._id] || ""}
                onChange={(e) =>
                  setDeadlineInput({ ...deadlineInput, [p._id]: e.target.value })
                }
              />
              <button onClick={() => addTask(p._id)}>Add Task</button>
            </div>

            <ul>
              {tasks[p._id]?.map((t) => (
                <li key={t._id}>
                  {t.title} - {t.deadline} ({t.status})
                  <button onClick={() => completeTask(t._id, p._id)}>✅</button>
                  <button onClick={() => deleteTask(t._id, p._id)}>🗑</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;