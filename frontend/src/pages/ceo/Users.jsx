import { useEffect, useState, useMemo } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";

/* =========================
   USERS PAGE (PRO UI)
========================= */
export default function Users() {
  const crud = useCrud("users");

  const [roles, setRoles] = useState([]);
  const [depts, setDepts] = useState([]);
  const [search, setSearch] = useState("");

  /* =========================
     LOAD META
  ========================= */
  useEffect(() => {
    api.get("/meta/roles").then((r) => setRoles(r.data));
    api.get("/meta/departments").then((d) => setDepts(d.data));
  }, []);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredData = useMemo(() => {
    if (!search) return crud.data;

    return crud.data.filter((u) =>
      [u.name, u.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [crud.data, search]);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    return {
      total: crud.data.length,
      leads: crud.data.filter((u) => u.role === "TEAM_LEAD").length,
      employees: crud.data.filter((u) => u.role === "EMPLOYEE").length,
    };
  }, [crud.data]);

  /* =========================
     FORM FIELDS
  ========================= */
  const fields = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password", type: "password" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roles,
    },
    {
      name: "departmentId",
      label: "Department",
      type: "select",
      options: depts.map((d) => ({
        label: d.name,
        value: d._id,
      })),
    },
  ];

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 text-sm">
          Manage all employees, leads and admins
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats.total} />
        <StatCard title="Team Leads" value={stats.leads} />
        <StatCard title="Employees" value={stats.employees} />
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-end">
        <Input
          placeholder="Search name or email..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <UniversalCrudModal
          title="User"
          fields={fields}
          crud={{
            ...crud,
            data: filteredData,
          }}
        />
      </div>
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
