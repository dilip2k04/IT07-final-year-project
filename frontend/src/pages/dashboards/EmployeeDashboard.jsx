import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/* =========================
   EMPLOYEE DASHBOARD (PRO)
========================= */
export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  /* =========================
     LOAD MY TASKS
  ========================= */
  useEffect(() => {
    api.get("/tasks/my").then((res) => {
      setTasks(res.data || []);
    });
  }, []);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      progress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    };
  }, [tasks]);

  const recent = tasks.slice(0, 5);

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Welcome 👋</h1>
        <p className="text-gray-500 text-sm">
          Here's your task overview today
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="Completed" value={stats.done} />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="flex gap-4">
        <Button onClick={() => navigate("/employee/tasks")}>
          View My Tasks
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/employee/ai")}
        >
          AI Assistant
        </Button>
      </div>

      {/* ================= RECENT TASKS ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="font-semibold mb-4">Recent Tasks</h2>

        <div className="space-y-3">
          {recent.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">
                  {t.projectId?.name}
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${statusColor(
                  t.status
                )}`}
              >
                {t.status.replace("_", " ")}
              </span>
            </div>
          ))}

          {recent.length === 0 && (
            <div className="text-gray-400 text-sm">
              No tasks assigned yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   STAT CARD
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
   STATUS COLORS
========================= */
function statusColor(status) {
  switch (status) {
    case "DONE":
      return "bg-green-100 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
