import { useEffect, useState, useMemo } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function DepartmentHeadProjects() {
  const crud = useCrud("projects");
  const user = getUser();

  const [teamLeads, setTeamLeads] = useState([]);
  const [employees, setEmployees] = useState([]);

  /* ============================
     LOAD USERS (PARALLEL + SAFE)
  ============================ */
  useEffect(() => {
    if (!user?.departmentId) return;

    const load = async () => {
      try {
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
      } catch (e) {
        console.error("Failed loading users", e);
      }
    };

    load();
  }, [user?.departmentId]);

  /* ============================
     IMPORTANT: value MUST be string id only
  ============================ */
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
          value: String(u._id), // ⭐ force string
        })),
      },
      {
        name: "employees",
        label: "Employees",
        type: "multiselect",
        options: employees.map((u) => ({
          label: u.name,
          value: String(u._id), // ⭐ force string
        })),
      },
    ],
    [teamLeads, employees]
  );

  return (
    <UniversalCrudModal
      title="Department Projects"
      fields={fields}
      crud={crud}
    />
  );
}
