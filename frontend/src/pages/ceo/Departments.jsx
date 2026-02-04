import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";

export default function Departments() {
  const crud = useCrud("departments");

  const fields = [
    { name: "name", label: "Department Name" }
  ];

  return <UniversalCrudModal title="Departments" fields={fields} crud={crud} />;
}
