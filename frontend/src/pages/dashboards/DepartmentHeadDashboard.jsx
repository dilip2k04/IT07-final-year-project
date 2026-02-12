import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =========================
   SMALL STAT CARD
========================= */
function StatCard({ title, value = 0, color }) {
  return (
    <div
      className={`p-5 rounded-2xl shadow-sm border bg-white flex flex-col gap-2 ${color}`}
    >
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-3xl font-bold">{value}</span>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */
export default function DepartmentHeadDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    try {
      const res = await api.get("/department-head/dashboard");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  /* =========================
     HOOKS MUST BE BEFORE RETURN
  ========================= */
  const chartData = useMemo(() => {
    if (!data?.projects) return [];

    return [
      { name: "Not Started", value: data.projects.notStarted },
      { name: "In Progress", value: data.projects.inProgress },
      { name: "Completed", value: data.projects.completed },
      { name: "Blocked", value: data.projects.blocked },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const {
    department,
    teamLeads = 0,
    employees = 0,
    projects = {},
  } = data || {};

  const progressPercent = projects.total
    ? Math.round((projects.completed / projects.total) * 100)
    : 0;

  const COLORS = ["#94a3b8", "#3b82f6", "#22c55e", "#ef4444"];

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          {department?.name} Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Department performance overview
        </p>
      </div>

      {/* ================= KPIs ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Team Leads" value={teamLeads} />
        <StatCard title="Employees" value={employees} />
        <StatCard title="Total Projects" value={projects.total} />
      </div>

      {/* ================= PROGRESS BAR ================= */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span>Completion Rate</span>
          <span className="font-semibold">{progressPercent}%</span>
        </div>

        <div className="h-3 bg-gray-100 rounded">
          <div
            className="h-3 bg-green-500 rounded transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ================= STATUS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Not Started" value={projects.notStarted} />
        <StatCard title="In Progress" value={projects.inProgress} />
        <StatCard title="Completed" value={projects.completed} />
        <StatCard title="Blocked" value={projects.blocked} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            Project Status Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h3 className="font-semibold mb-4">
            Status Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
