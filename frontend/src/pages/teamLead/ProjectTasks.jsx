import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectTasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  /* ============================
     Load tasks + project employees
  ============================ */
  const load = async () => {
    const [tasksRes, projectRes] = await Promise.all([
      api.get(`/tasks/project/${projectId}`),
      api.get(`/projects/${projectId}`),
    ]);

    setTasks(tasksRes.data);
    setEmployees(projectRes.data.employees || []);
  };

  /* ============================
     Create task
  ============================ */
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Project Tasks</h2>

      {/* ============ CREATE TASK ============ */}
      <div className="flex gap-2">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
            className="border rounded px-2 py-2"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                {emp.name}
                </option>
            ))}
            </select>


        <Button onClick={create}>Assign</Button>
      </div>

      {/* ============ TASK LIST ============ */}
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t._id} className="border p-3 rounded bg-white">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm">Status: {t.status}</div>
            <div className="text-sm">
              Assigned To: {t.assignedTo?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
