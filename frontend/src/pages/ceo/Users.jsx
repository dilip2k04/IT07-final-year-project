import { useEffect, useState } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";

export default function Users() {
  const crud = useCrud("users");
  const [roles, setRoles] = useState([]);
  const [depts, setDepts] = useState([]);

  useEffect(() => {
    api.get("/meta/roles").then((r) => setRoles(r.data));
    api.get("/meta/departments").then((d) => setDepts(d.data));
  }, []);

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
      options: depts.map((d) => ({ label: d.name, value: d._id })),
    },
  ];

  return <UniversalCrudModal title="Users" fields={fields} crud={crud} />;
}
