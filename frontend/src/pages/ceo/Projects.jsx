import { useEffect, useState } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { api } from "@/lib/api";

export default function Projects() {
  const crud = useCrud("projects");

  const [depts, setDepts] = useState([]);
  const [tls, setTls] = useState([]);
  const [emps, setEmps] = useState([]);
  const [dept, setDept] = useState("");

  // Load departments
  useEffect(() => {
    api.get("/meta/departments").then((r) => setDepts(r.data));
  }, []);

  // Load TLs & Employees when department changes
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

  const fields = [
    { name: "name", label: "Project Name" },

    {
      name: "departmentId",
      label: "Department",
      type: "select",
      options: depts.map((d) => ({ label: d.name, value: d._id })),
      onChange: (val) => {
        setDept(val);
      },
    },

    {
      name: "teamLeadId",
      label: "Team Lead",
      type: "select",
      options: tls.map((u) => ({ label: u.name, value: u._id })),
    },

    {
      name: "employees",
      label: "Employees",
      type: "multiselect",
      options: emps.map((u) => ({ label: u.name, value: u._id })),
    },
  ];

  return <UniversalCrudModal title="Projects" fields={fields} crud={crud} />;
}
