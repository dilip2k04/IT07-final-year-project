import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =========================
   SMALL CARD
========================= */
function StatCard({ title, value }) {
  return (
    <div className="p-5 rounded-2xl border bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

/* =========================
   TEAM LEAD DASHBOARD
========================= */
export default function TlDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    const load = async () => {
      const projRes = await api.get("/projects");
      setProjects(projRes.data || []);

      // load all project tasks
      const taskPromises = (projRes.data || []).map((p) =>
        api.get(`/tasks/project/${p._id}`)
      );

      const results = await Promise.all(taskPromises);

      const allTasks = results.flatMap((r) => r.data || []);
      setTasks(allTasks);
    };

    load();
  }, []);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    return {
      projects: projects.length,
      total: tasks.length,
      progress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    };
  }, [projects, tasks]);

  const chartData = useMemo(() => {
    return [
      { name: "Todo", value: stats.total - stats.progress - stats.done },
      { name: "In Progress", value: stats.progress },
      { name: "Done", value: stats.done },
    ];
  }, [stats]);

  const progressPercent = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;

  const recentTasks = tasks.slice(0, 5);

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Team Lead Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Manage your projects and monitor team progress
        </p>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="My Projects" value={stats.projects} />
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="Completed" value={stats.done} />
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span>Team Completion Rate</span>
          <span className="font-semibold">{progressPercent}%</span>
        </div>

        <div className="h-3 bg-gray-100 rounded">
          <div
            className="h-3 bg-green-500 rounded transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Task Status Overview</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/team-lead/projects")}
          className="px-4 py-2 rounded bg-black text-white"
        >
          View Projects
        </button>

        <button
          onClick={() => navigate("/team-lead/ai")}
          className="px-4 py-2 rounded border"
        >
          AI Assistant
        </button>
      </div>

      {/* ================= RECENT TASKS ================= */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Recent Tasks</h3>

        <div className="space-y-2">
          {recentTasks.map((t) => (
            <div
              key={t._id}
              className="flex justify-between border rounded p-3"
            >
              <span>{t.title}</span>
              <span className="text-xs text-gray-500">
                {t.status.replace("_", " ")}
              </span>
            </div>
          ))}

          {recentTasks.length === 0 && (
            <div className="text-gray-400 text-sm">
              No tasks yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
