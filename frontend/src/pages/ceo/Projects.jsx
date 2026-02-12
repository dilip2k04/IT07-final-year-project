import { useEffect, useState, useMemo } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";

/* =========================
   PROJECTS PAGE (PRO UI)
========================= */
export default function Projects() {
  const crud = useCrud("projects");

  const [depts, setDepts] = useState([]);
  const [tls, setTls] = useState([]);
  const [emps, setEmps] = useState([]);
  const [dept, setDept] = useState("");
  const [search, setSearch] = useState("");

  /* =========================
     LOAD DEPARTMENTS
  ========================= */
  useEffect(() => {
    api.get("/meta/departments").then((r) => setDepts(r.data));
  }, []);

  /* =========================
     LOAD USERS WHEN DEPT CHANGES
  ========================= */
  useEffect(() => {
    if (!dept) {
      setTls([]);
      setEmps([]);
      return;
    }

    api
      .get(`/meta/users?departmentId=${dept}&role=TEAM_LEAD`)
      .then((r) => setTls(r.data));

    api
      .get(`/meta/users?departmentId=${dept}&role=EMPLOYEE`)
      .then((r) => setEmps(r.data));
  }, [dept]);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredData = useMemo(() => {
    if (!search) return crud.data;

    return crud.data.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [crud.data, search]);

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => {
    return {
      total: crud.data.length,
      leads: new Set(crud.data.map((p) => p.teamLeadId?._id)).size,
      employees: new Set(
        crud.data.flatMap((p) =>
          (p.employees || []).map((e) => e._id)
        )
      ).size,
    };
  }, [crud.data]);

  /* =========================
     FORM FIELDS
  ========================= */
  const fields = [
    { name: "name", label: "Project Name" },

    {
      name: "departmentId",
      label: "Department",
      type: "select",
      options: depts.map((d) => ({
        label: d.name,
        value: d._id,
      })),
      onChange: (val) => setDept(val),
    },

    {
      name: "teamLeadId",
      label: "Team Lead",
      type: "select",
      options: tls.map((u) => ({
        label: u.name,
        value: u._id,
      })),
    },

    {
      name: "employees",
      label: "Employees",
      type: "multiselect",
      options: emps.map((u) => ({
        label: u.name,
        value: u._id,
      })),
    },
  ];

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-500 text-sm">
          Manage organization projects and assignments
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Projects" value={stats.total} />
        <StatCard title="Team Leads Involved" value={stats.leads} />
        <StatCard title="Employees Assigned" value={stats.employees} />
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-end">
        <Input
          placeholder="Search project..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <UniversalCrudModal
          title="Project"
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
