import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [openProjects, setOpenProjects] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    const res = await api.get("/tasks/my");
    setTasks(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     OPTIMISTIC UPDATE
  ========================= */
  const updateStatus = async (id, status) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );

    try {
      await api.put(`/tasks/${id}/status`, { status });
    } catch {
      load();
    }
  };

  /* =========================
     FILTER
  ========================= */
  const filtered = useMemo(() => {
    if (!search) return tasks;

    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  /* =========================
     GROUP
  ========================= */
  const grouped = useMemo(() => {
    const map = {};

    for (const t of filtered) {
      const pid = t.projectId?._id;
      if (!pid) continue;

      if (!map[pid]) {
        map[pid] = {
          name: t.projectId.name,
          tasks: [],
        };
      }

      map[pid].tasks.push(t);
    }

    return map;
  }, [filtered]);

  /* =========================
     GLOBAL STATS
  ========================= */
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
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-gray-500 text-sm">
          Track and update your assigned work
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="In Progress" value={stats.progress} />
        <StatCard title="Completed" value={stats.done} />
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

      {/* PROJECT GROUPS */}
      {Object.entries(grouped).map(([projectId, project]) => {
        const done = project.tasks.filter(
          (t) => t.status === "DONE"
        ).length;

        const progressPercent =
          (done / project.tasks.length) * 100;

        const isOpen = openProjects[projectId];

        return (
          <div
            key={projectId}
            className="rounded-2xl border bg-white shadow-sm overflow-hidden"
          >
            {/* HEADER */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setOpenProjects((p) => ({
                  ...p,
                  [projectId]: !p[projectId],
                }))
              }
            >
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}

                <div>
                  <div className="font-semibold text-lg">
                    {project.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {done}/{project.tasks.length} completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {project.tasks.length} Tasks
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${projectId}/documents`);
                  }}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Docs
                </Button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-2 bg-gray-100">
              <div
                className="h-2 bg-green-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* TASKS */}
            {isOpen && (
              <div className="divide-y">
                {project.tasks.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <Badge
                        className={`mt-1 ${statusColor(t.status)}`}
                      >
                        {t.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {t.status !== "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateStatus(t._id, "IN_PROGRESS")
                          }
                        >
                          In Progress
                        </Button>
                      )}

                      {t.status !== "DONE" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(t._id, "DONE")
                          }
                        >
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
