import { useEffect, useState, useMemo } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function Meetings() {
  const crud = useCrud("meetings");
  const user = getUser();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  /* =========================
     LOAD USERS + DEPARTMENTS
  ========================= */
  useEffect(() => {
    api.get("/meta/users").then((r) => setUsers(r.data));
    api.get("/meta/departments").then((r) =>
      setDepartments(r.data)
    );
  }, []);

  /* =========================
     FIELDS (dropdowns)
  ========================= */
  const fields = useMemo(
    () => [
      { name: "name", label: "Meeting Name" },
      { name: "link", label: "Meeting Link" },
      { name: "regarding", label: "Regarding" },

      {
    name: "startTime",
    label: "Start Time",
    type: "datetime",
    },
    {
    name: "endTime",
    label: "End Time",
    type: "datetime",
    },


      /* ⭐ MULTI USER DROPDOWN */
      {
        name: "allowedUsers",
        label: "Allowed Users",
        type: "multiselect",
        options: users.map((u) => ({
          label: `${u.name} (${u.role})`,
          value: u._id,
        })),
      },

      /* ⭐ MULTI DEPARTMENT DROPDOWN */
      {
        name: "allowedDepartments",
        label: "Allowed Departments",
        type: "multiselect",
        options: departments.map((d) => ({
          label: d.name,
          value: d._id,
        })),
      },
    ],
    [users, departments]
  );

  return (
    <UniversalCrudModal
      title="Meetings"
      fields={fields}
      crud={crud}
    />
  );
}
