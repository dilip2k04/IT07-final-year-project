import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  Download,
} from "lucide-react";

/* =========================
   PROJECT DOCUMENTS (PRO UI)
========================= */
export default function ProjectDocuments() {
  const { projectId } = useParams();

  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DOCS
  ========================= */
  const load = async () => {
    const res = await api.get(`/documents/${projectId}`);
    setDocs(res.data);
  };

  /* =========================
     UPLOAD
  ========================= */
  const upload = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);
    await api.post(`/documents/${projectId}`, fd);
    setFile(null);
    setLoading(false);

    load();
  };

  useEffect(() => {
    load();
  }, [projectId]);

  /* =========================
     DRAG DROP
  ========================= */
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Project Documents</h1>
        <p className="text-gray-500 text-sm">
          Upload and manage project files
        </p>
      </div>

      {/* ================= UPLOAD CARD ================= */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="bg-white border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-sm"
      >
        <UploadCloud size={40} className="text-gray-400" />

        <p className="text-sm text-gray-500">
          Drag & drop files here or choose manually
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <div className="text-sm text-gray-600">
            Selected: <b>{file.name}</b>
          </div>
        )}

        <Button onClick={upload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* ================= FILE LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {docs.map((d) => (
          <div
            key={d.name}
            className="bg-white rounded-2xl border shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-blue-500" size={22} />
              <span className="text-sm font-medium truncate">
                {d.name}
              </span>
            </div>

            <a
              href={`http://localhost:5000${d.url}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="sm" variant="outline">
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </a>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {docs.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No documents uploaded yet
        </div>
      )}
    </div>
  );
}
