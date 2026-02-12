import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* =========================
   KPI CARD
========================= */
function StatCard({ title, value = 0, color }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md border bg-white flex flex-col gap-2 hover:scale-[1.02] transition ${color}`}
    >
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-3xl font-bold">{value}</span>
    </div>
  );
}

export default function CeoDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    api.get("/ceo/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  /* =========================
     SAFE DEFAULTS (important)
     so hooks always run
  ========================= */
  const safe = data || {
    departments: 0,
    teamLeads: 0,
    employees: 0,
    projects: {
      total: 0,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
      blocked: 0,
    },
  };

  const { departments, teamLeads, employees, projects } = safe;

  /* =========================
     HOOKS ALWAYS RUN
  ========================= */
  const pieData = useMemo(
    () => [
      { name: "Not Started", value: projects.notStarted },
      { name: "In Progress", value: projects.inProgress },
      { name: "Completed", value: projects.completed },
      { name: "Blocked", value: projects.blocked },
    ],
    [projects]
  );

  const orgData = useMemo(
    () => [
      { name: "Departments", value: departments },
      { name: "Team Leads", value: teamLeads },
      { name: "Employees", value: employees },
      { name: "Projects", value: projects.total },
    ],
    [departments, teamLeads, employees, projects.total]
  );

  const COLORS = ["#9CA3AF", "#3B82F6", "#22C55E", "#EF4444"];

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-10">

      {!data && (
        <div className="text-center text-gray-500">
          Loading dashboard...
        </div>
      )}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">CEO Dashboard</h1>
        <p className="text-gray-500">
          Organization-wide analytics
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard title="Departments" value={departments} />
        <StatCard title="Team Leads" value={teamLeads} />
        <StatCard title="Employees" value={employees} />
        <StatCard title="Total Projects" value={projects.total} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <h2 className="font-semibold mb-4">
            Project Status Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <h2 className="font-semibold mb-4">
            Organization Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orgData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4">
        <Button onClick={() => navigate("/ceo/users")}>
          Manage Users
        </Button>
        <Button onClick={() => navigate("/ceo/departments")}>
          Departments
        </Button>
        <Button onClick={() => navigate("/ceo/projects")}>
          Projects
        </Button>
      </div>
    </div>
  );
}
