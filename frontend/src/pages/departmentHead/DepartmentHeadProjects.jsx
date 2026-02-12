import { useEffect, useState, useMemo } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";

/* =========================
   DEPARTMENT HEAD PROJECTS
   (PRO DASHBOARD UI)
========================= */
export default function DepartmentHeadProjects() {
  const crud = useCrud("projects");
  const user = getUser();

  const [teamLeads, setTeamLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  /* =========================
     LOAD USERS (PARALLEL)
  ========================= */
  useEffect(() => {
    if (!user?.departmentId) return;

    const load = async () => {
      const [tl, emp] = await Promise.all([
        api.get(`/meta/users`, {
          params: {
            role: "TEAM_LEAD",
            departmentId: user.departmentId,
          },
        }),
        api.get(`/meta/users`, {
          params: {
            role: "EMPLOYEE",
            departmentId: user.departmentId,
          },
        }),
      ]);

      setTeamLeads(tl.data || []);
      setEmployees(emp.data || []);
    };

    load();
  }, [user?.departmentId]);

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
  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Project Name",
      },
      {
        name: "teamLeadId",
        label: "Team Lead",
        type: "select",
        options: teamLeads.map((u) => ({
          label: u.name,
          value: String(u._id),
        })),
      },
      {
        name: "employees",
        label: "Employees",
        type: "multiselect",
        options: employees.map((u) => ({
          label: u.name,
          value: String(u._id),
        })),
      },
    ],
    [teamLeads, employees]
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Department Projects</h1>
        <p className="text-gray-500 text-sm">
          Manage projects within your department
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Projects" value={stats.total} />
        <StatCard title="Team Leads Assigned" value={stats.leads} />
        <StatCard title="Employees Assigned" value={stats.employees} />
      </div>

      {/* SEARCH */}
      <div className="flex justify-end">
        <Input
          placeholder="Search project..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
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
