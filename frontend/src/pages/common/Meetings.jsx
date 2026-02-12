import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);

  const [form, setForm] = useState({
    name: "",
    link: "",
    timings: "",
    regarding: "",
  });

  const load = async () => {
    const res = await api.get("/meetings");
    setMeetings(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/meetings", form);
    setForm({ name: "", link: "", timings: "", regarding: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Meetings</h2>

      {/* CREATE */}
      <div className="grid grid-cols-4 gap-2">
        <Input
          placeholder="Meeting name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Meet link"
          onChange={e => setForm({ ...form, link: e.target.value })}
        />
        <Input
          type="datetime-local"
          onChange={e => setForm({ ...form, timings: e.target.value })}
        />
        <Input
          placeholder="Regarding"
          onChange={e => setForm({ ...form, regarding: e.target.value })}
        />

        <Button onClick={create}>Schedule</Button>
      </div>

      {/* LIST */}
      {meetings.map(m => (
        <div key={m._id} className="border p-4 rounded bg-white">
          <div className="font-semibold">{m.name}</div>
          <div>{new Date(m.timings).toLocaleString()}</div>
          <a href={m.link} target="_blank" className="text-blue-600 underline">
            Join Meeting
          </a>
          <div className="text-sm text-gray-500">{m.regarding}</div>
        </div>
      ))}
    </div>
  );
}
