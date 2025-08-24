"use client";
import React, { useState } from "react";

export function CrewConversationPanel() {
  const [prompt, setPrompt] = useState("");
  const [log, setLog] = useState<string[]>([]);

  async function sendPrompt() {
    const res = await fetch("/api/alexai/crew-conversation", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setLog((l) => [...l, `> ${prompt}`, data.reply]);
    setPrompt("");
  }

  return (
    <div className="font-lcars mt-12 p-4 bg-[#111] text-lime-1000 border border-lime-1000 rounded-xl shadow-lg">
      <h2 className="font-lcars text-2xl mb-4">Crew Command Console</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="font-lcars w-full p-2 bg-black border border-lime-1000 text-lime-1000 font-mono"
        rows={3}
        placeholder="e.g. Riker: Geordi, Worf, Data â€” you're with me"
      />
      <button
        onClick={sendPrompt}
        className="font-lcars mt-2 px-6 py-2 bg-lime-1000 hover:bg-lime-1000 text-black font-bold rounded-lg"
      >
        Engage
      </button>

      <div className="font-lcars mt-4 font-mono text-lime-1000 whitespace-pre-line">
        {log.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}