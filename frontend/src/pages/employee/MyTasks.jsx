import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [openProjects, setOpenProjects] = useState({});
  const navigate = useNavigate();

  /* =========================
     LOAD TASKS
  ========================= */
  const load = async () => {
    const res = await api.get("/tasks/my");
    setTasks(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     🚀 OPTIMISTIC STATUS UPDATE
     (no reload)
  ========================= */
  const updateStatus = async (id, status) => {
    // instant UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status } : t
      )
    );

    try {
      await api.put(`/tasks/${id}/status`, { status });
    } catch {
      // revert if failed
      load();
    }
  };

  /* =========================
     GROUP TASKS BY PROJECT
  ========================= */
  const grouped = useMemo(() => {
    const map = {};

    for (const t of tasks) {
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
  }, [tasks]);

  /* =========================
     STATUS COLORS
  ========================= */
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Tasks</h2>

      {Object.entries(grouped).map(([projectId, project]) => {
        const done = project.tasks.filter(
          (t) => t.status === "DONE"
        ).length;

        const isOpen = openProjects[projectId];

        return (
          <div
            key={projectId}
            className="rounded-xl border bg-white shadow-sm"
          >
            {/* ================= PROJECT HEADER ================= */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted"
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
                  <div className="font-semibold">
                    {project.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {done}/{project.tasks.length} completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {project.tasks.length} Tasks
                </Badge>

                {/* ✅ documents route (global) */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${projectId}/documents`);
                  }}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Documents
                </Button>
              </div>
            </div>

            {/* ================= TASK LIST ================= */}
            {isOpen && (
              <div className="divide-y">
                {project.tasks.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {t.title}
                      </div>

                      <Badge
                        className={statusColor(t.status)}
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
                            updateStatus(
                              t._id,
                              "IN_PROGRESS"
                            )
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
