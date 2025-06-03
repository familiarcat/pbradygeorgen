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
    <div className="mt-12 p-4 bg-[#111] text-lime-300 border border-lime-500 rounded-xl shadow-lg">
      <h2 className="text-2xl mb-4">Crew Command Console</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 bg-black border border-lime-300 text-lime-200 font-mono"
        rows={3}
        placeholder="e.g. Riker: Geordi, Worf, Data — you're with me"
      />
      <button
        onClick={sendPrompt}
        className="mt-2 px-6 py-2 bg-lime-600 hover:bg-lime-400 text-black font-bold rounded-lg"
      >
        Engage
      </button>

      <div className="mt-4 font-mono text-lime-200 whitespace-pre-line">
        {log.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}
