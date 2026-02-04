import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UniversalCrudModal({ title, fields, crud }) {
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  /* ============================
     🔥 SAFE PAYLOAD BUILDER
     - Create → full payload
     - Update → ignore empty fields
  ============================ */
  const buildPayload = () => {
    const payload = {};

    fields.forEach((f) => {
      const v = form[f.name];

      // ⛔ skip empty fields on UPDATE
      if (
        editing &&
        (v === "" ||
          v === undefined ||
          v === null ||
          (Array.isArray(v) && v.length === 0))
      ) {
        return;
      }

      if (Array.isArray(v)) {
        payload[f.name] = v.map((x) => x?._id || x);
      } else if (typeof v === "object" && v !== null) {
        payload[f.name] = v._id;
      } else {
        payload[f.name] = v;
      }
    });

    return payload;
  };

  /* ============================
     🔥 SUBMIT HANDLER
  ============================ */
  const submit = async () => {
    const payload = buildPayload();

    try {
      if (editing) {
        await crud.update(editing._id, payload);
      } else {
        await crud.create(payload);
      }
    } catch (err) {
      console.error(
        err?.response?.data?.message || "Operation failed"
      );
      return; // ⛔ stop on error
    }

    setForm({});
    setEditing(null);
    setOpen(false);

    // ✅ reload safely (if exists)
    if (typeof crud.list === "function") {
      crud.list();
    }
  };

  /* ============================
     🔥 CHANGE HANDLER
  ============================ */
  const handleChange = (name, value, f) => {
    let newForm = { ...form, [name]: value };

    if (name === "departmentId") {
      newForm.teamLeadId = "";
      newForm.employees = [];
    }

    setForm(newForm);
    if (f.onChange) f.onChange(value, newForm);
  };

  /* ============================
     🔥 NORMALIZE ROW → FORM
  ============================ */
  const normalizeRow = (row) => {
    const normalized = {};

    fields.forEach((f) => {
      const v = row[f.name];

      if (Array.isArray(v)) {
        normalized[f.name] = v.map((x) => x?._id || x);
      } else if (typeof v === "object" && v !== null) {
        normalized[f.name] = v._id;
      } else {
        normalized[f.name] = v;
      }
    });

    return normalized;
  };

  /* ============================
     🔥 DISPLAY HELPERS
  ============================ */
  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return val.map((x) => x?.name || x).join(", ");
    }
    if (typeof val === "object" && val !== null) {
      return val.name || val._id;
    }
    return val;
  };

  const getValue = (o) => o?._id || o?.value || o;
  const getLabel = (o) => o?.name || o?.label || o;

  return (
    <div className="space-y-4">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">{title}</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setForm({});
              }}
            >
              Add {title}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit" : "Create"} {title}
              </DialogTitle>
              <DialogDescription>
                Fill the details below and save changes.
              </DialogDescription>
            </DialogHeader>

            {/* ================= FORM ================= */}
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => {
                if (f.type === "multiselect") {
                  return (
                    <select
                      key={f.name}
                      multiple
                      className="border rounded px-2 py-2"
                      value={form[f.name] || []}
                      onChange={(e) =>
                        handleChange(
                          f.name,
                          Array.from(
                            e.target.selectedOptions
                          ).map((o) => o.value),
                          f
                        )
                      }
                    >
                      {f.options?.map((opt) => (
                        <option
                          key={getValue(opt)}
                          value={getValue(opt)}
                        >
                          {getLabel(opt)}
                        </option>
                      ))}
                    </select>
                  );
                }

                if (f.type === "select") {
                  return (
                    <select
                      key={f.name}
                      className="border rounded px-2 py-2"
                      value={form[f.name] || ""}
                      onChange={(e) =>
                        handleChange(f.name, e.target.value, f)
                      }
                    >
                      <option value="">
                        Select {f.label}
                      </option>
                      {f.options?.map((opt) => (
                        <option
                          key={getValue(opt)}
                          value={getValue(opt)}
                        >
                          {getLabel(opt)}
                        </option>
                      ))}
                    </select>
                  );
                }

                return (
                  <Input
                    key={f.name}
                    placeholder={f.label}
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      handleChange(
                        f.name,
                        e.target.value,
                        f
                      )
                    }
                  />
                );
              })}
            </div>

            <Button className="mt-4" onClick={submit}>
              {editing ? "Update" : "Create"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* ================= TABLE ================= */}
      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((f) => (
              <TableHead key={f.name}>
                {f.label}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {crud.data.map((row) => (
            <TableRow key={row._id}>
              {fields.map((f) => (
                <TableCell key={f.name}>
                  {renderValue(row[f.name])}
                </TableCell>
              ))}

              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(row);
                    setForm(normalizeRow(row));
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    crud.remove(row._id)
                  }
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
