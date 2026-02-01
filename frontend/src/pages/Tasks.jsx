import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedProject = localStorage.getItem("activeProject");
    if (!storedProject) {
      navigate("/dashboard");
      return;
    }

    const parsedProject = JSON.parse(storedProject);
    setProject(parsedProject);

    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/tasks/project/${parsedProject._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [navigate]);

  const addTask = async () => {
    if (!title) return alert("Task title required");

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        dueDate,
        projectId: project._id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create task");
      return;
    }

    setTasks([data, ...tasks]);

    // mark stats dirty
    localStorage.setItem("statsDirty", "true");

    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
  };

  const updateTask = async (taskId, updates) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    const updated = await res.json();

    setTasks(
      tasks.map((t) => (t._id === updated._id ? updated : t))
    );

    // mark stats dirty (status change affects stats)
    localStorage.setItem("statsDirty", "true");
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // remove from UI
    setTasks(tasks.filter((task) => task._id !== taskId));

    // mark stats dirty so dashboard refreshes
    localStorage.setItem("statsDirty", "true");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Todo":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">
              {project.name}
            </h1>
            <p className="text-gray-600">Manage your tasks and track progress</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Add Task Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter task description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Todo</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>

              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Tasks</h2>

          {tasks.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-gray-500 text-lg">No tasks found. Create your first task to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex-1 pr-2">
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                      {task.description || "No description provided"}
                    </p>

                    {/* Due Date */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>

                    {/* Status and Priority Dropdowns */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <select
                        className={`px-3 py-2 rounded-lg text-sm font-medium border outline-none transition-all duration-200 ${getStatusColor(task.status)}`}
                        value={task.status}
                        onChange={(e) =>
                          updateTask(task._id, { status: e.target.value })
                        }
                      >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>

                      <select
                        className={`px-3 py-2 rounded-lg text-sm font-medium border outline-none transition-all duration-200 ${getPriorityColor(task.priority)}`}
                        value={task.priority}
                        onChange={(e) =>
                          updateTask(task._id, { priority: e.target.value })
                        }
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;