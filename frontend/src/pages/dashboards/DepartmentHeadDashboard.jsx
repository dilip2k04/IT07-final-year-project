import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/* ============================
   STATUS CARD
============================ */
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

export default function DepartmentHeadDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================
     LOAD DASHBOARD
  ============================ */
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

    // ✅ auto refresh every 10s (optional but useful)
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">
          {department?.name} Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of your department activity
        </p>
      </div>

      {/* ================= PEOPLE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Team Leads" value={teamLeads} />
        <StatCard title="Employees" value={employees} />
        <StatCard title="Total Projects" value={projects.total} />
      </div>

      {/* ================= PROJECT STATUS ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Project Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Not Started"
            value={projects.notStarted}
            color="border-gray-200"
          />

          <StatCard
            title="In Progress"
            value={projects.inProgress}
            color="border-blue-300 bg-blue-50"
          />

          <StatCard
            title="Completed"
            value={projects.completed}
            color="border-green-300 bg-green-50"
          />

          <StatCard
            title="Blocked"
            value={projects.blocked}
            color="border-red-300 bg-red-50"
          />
        </div>
      </div>
    </div>
  );
}
