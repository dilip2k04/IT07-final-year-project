import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("CODE");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!prompt) return;

    setLoading(true);
    const res = await api.post("/ai/chat", {
      prompt,
      type,
    });
    setResponse(res.data.response);
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">AI Assistant</h2>

      <select
        className="border rounded p-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="CODE">Coding Help</option>
        <option value="SUMMARY">Summarization</option>
        <option value="TRANSLATE">Translation</option>
      </select>

      <textarea
        className="w-full border rounded p-3 min-h-[120px]"
        placeholder="Ask something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button onClick={ask} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </Button>

      {response && (
        <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
          {response}
        </pre>
      )}
    </div>
  );
}
