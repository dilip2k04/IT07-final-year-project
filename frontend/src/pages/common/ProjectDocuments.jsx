import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ProjectDocuments() {
  const { projectId } = useParams();
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);

  const load = async () => {
    const res = await api.get(`/documents/${projectId}`);
    setDocs(res.data);
  };

  const upload = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    await api.post(`/documents/${projectId}`, fd);
    setFile(null);
    load();
  };

  useEffect(() => {
    load();
  }, [projectId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Documents</h2>

      <div className="flex gap-3">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button onClick={upload}>Upload</Button>
      </div>

      <div className="space-y-3">
        {docs.map((d) => (
          <div
            key={d.name}
            className="border p-3 rounded bg-white flex justify-between"
          >
            <span>{d.name}</span>
            <a
              href={`http://localhost:5000${d.url}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View / Download
            </a>
          </div>
        ))}

        {docs.length === 0 && (
          <div className="text-gray-500 text-sm">
            No documents uploaded
          </div>
        )}
      </div>
    </div>
  );
}
