import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

/* =========================
   AI ASSISTANT (PRO UI)
========================= */
export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("CODE");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* =========================
     ASK AI
  ========================= */
  const ask = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: "user", text: prompt };
    setMessages((m) => [...m, userMsg]);

    setLoading(true);
    setPrompt("");

    try {
      const res = await api.post("/ai/chat", {
        prompt,
        type,
      });

      const aiMsg = {
        role: "ai",
        text: res.data.response,
      };

      setMessages((m) => [...m, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ENTER TO SEND
  ========================= */
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">AI Assistant</h2>
        <p className="text-gray-500 text-sm">
          Ask coding, summary, or translation questions
        </p>
      </div>

      {/* CHAT BOX */}
      <div className="flex-1 bg-white rounded-2xl border shadow-sm p-6 overflow-y-auto space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            Start a conversation with AI...
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
                ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-900 text-green-400 font-mono"
                }
              `}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">AI thinking...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="mt-4 flex gap-3">

        <select
          className="border rounded-lg px-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="CODE">Coding</option>
          <option value="SUMMARY">Summary</option>
          <option value="TRANSLATE">Translate</option>
        </select>

        <textarea
          className="flex-1 border rounded-lg p-3 resize-none"
          placeholder="Ask something... (Shift + Enter for new line)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
        />

        <Button onClick={ask} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
