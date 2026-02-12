import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/* =========================
   TEAM LEAD PROJECTS (PRO UI)
========================= */
export default function TlProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* =========================
     LOAD PROJECTS
  ========================= */
  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data || []));
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filtered = useMemo(() => {
    if (!search) return projects;

    return projects.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "IN_PROGRESS").length,
      completed: projects.filter((p) => p.status === "COMPLETED").length,
    };
  }, [projects]);

  const statusColor = (status) => {
    switch (status) {
      case "COMPLETED":
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
        <h1 className="text-2xl font-bold">My Projects</h1>
        <p className="text-gray-500 text-sm">
          Manage your assigned projects and tasks
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Projects" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Completed" value={stats.completed} />
      </div>

      {/* SEARCH */}
      <div className="flex justify-end">
        <input
          placeholder="Search project..."
          className="border rounded px-3 py-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PROJECT CARDS */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-sm text-gray-500">
                  Team Lead: {p.teamLeadId?.name}
                </div>
              </div>

              {/* <span
                className={`px-3 py-1 text-xs rounded-full ${statusColor(
                  p.status
                )}`}
              >
                {p.status?.replace("_", " ")}
              </span> */}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={() => navigate(`${p._id}/tasks`)}
              >
                Tasks
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(`/projects/${p._id}/documents`)
                }
              >
                Documents
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No projects found
        </div>
      )}
    </div>
  );
}

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
