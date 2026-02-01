import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openProject = (project) => {
    localStorage.setItem("activeProject", JSON.stringify(project));
    navigate("/tasks");
  };

  const addProject = async () => {
    if (!name) return alert("Project name required");

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create project");
      return;
    }

    setProjects([data, ...projects]);
    setName("");
    setDescription("");
  };

  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Delete this project? All tasks under it will be lost."
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProjects(projects.filter((p) => p._id !== projectId));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProjects(data);
    };

    const fetchTaskStats = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasks = await res.json();

      const todo = tasks.filter((t) => t.status === "Todo").length;
      const inProgress = tasks.filter(
        (t) => t.status === "In Progress"
      ).length;
      const done = tasks.filter((t) => t.status === "Done").length;

      setStats({ todo, inProgress, done });
    };

    fetchProjects();
    fetchTaskStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">Dashboard</h1>
            <p className="text-gray-600">Manage your projects and tasks</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Todo</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.todo}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Done</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.done}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add Project Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter project description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={addProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Projects</h2>

          {projects.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No projects found. Create your first project to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div
                    onClick={() => openProject(project)}
                    className="p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                      {project.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                      {project.description || "No description provided"}
                    </p>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project._id);
                      }}
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

export default Dashboard;