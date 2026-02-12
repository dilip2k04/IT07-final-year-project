import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =========================
   PROJECT TASKS (PRO UI)
========================= */
export default function ProjectTasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [search, setSearch] = useState("");

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    const [tasksRes, projectRes] = await Promise.all([
      api.get(`/tasks/project/${projectId}`),
      api.get(`/projects/${projectId}`),
    ]);

    setTasks(tasksRes.data || []);
    setEmployees(projectRes.data.employees || []);
  };

  /* =========================
     CREATE TASK
  ========================= */
  const create = async () => {
    if (!title || !assignedTo) return;

    await api.post("/tasks", {
      title,
      projectId,
      assignedTo,
    });

    setTitle("");
    setAssignedTo("");
    load();
  };

  useEffect(() => {
    load();
  }, [projectId]);

  /* =========================
     FILTER + STATS
  ========================= */
  const filtered = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      progress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    };
  }, [tasks]);

  const statusColor = (status) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <p className="text-gray-500 text-sm">
          Manage and assign tasks to employees
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="Completed" value={stats.done} />
      </div>

      {/* CREATE TASK CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 flex gap-3">
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <Button onClick={create}>Create Task</Button>
      </div>

      {/* SEARCH */}
      <div className="flex justify-end">
        <Input
          placeholder="Search tasks..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TASK LIST */}
      <div className="grid gap-3">
        {filtered.map((t) => (
          <div
            key={t._id}
            className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">
                Assigned: {t.assignedTo?.name}
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
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No tasks found
        </div>
      )}
    </div>
  );
}

/* =========================
   SMALL STAT CARD
========================= */
function StatCard({ title, value }) {
  return (
    <div className="p-5 rounded-2xl border bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
