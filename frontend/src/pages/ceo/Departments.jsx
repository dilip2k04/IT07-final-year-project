import { useMemo, useState } from "react";
import useCrud from "@/core/useCrud";
import UniversalCrudModal from "@/components/UniversalCrudModal";
import { Input } from "@/components/ui/input";

/* =========================
   DEPARTMENTS PAGE (PRO UI)
========================= */
export default function Departments() {
  const crud = useCrud("departments");
  const [search, setSearch] = useState("");

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredData = useMemo(() => {
    if (!search) return crud.data;

    return crud.data.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [crud.data, search]);

  const fields = [
    { name: "name", label: "Department Name" },
  ];

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-gray-500 text-sm">
            Manage all organization departments
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border bg-white shadow-sm">
          <p className="text-sm text-gray-500">Total Departments</p>
          <p className="text-3xl font-bold">{crud.data.length}</p>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-end">
        <Input
          placeholder="Search department..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE WRAPPER ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <UniversalCrudModal
          title="Department"
          fields={fields}
          crud={{
            ...crud,
            data: filteredData, // ⭐ filtered list
          }}
        />
      </div>
    </div>
  );
}
