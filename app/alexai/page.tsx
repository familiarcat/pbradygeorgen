'use client';

import React, { useState } from 'react';

export default function AlexAIAgent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = async () => {
    const res = await fetch('/api/alexai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setResponse(data.result);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🤖 AlexAI Chat</h1>
      <textarea
        className="w-full p-2 border mb-2"
        rows={4}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask AlexAI..."
      />
      <button
        onClick={handleAsk}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Ask AlexAI
      </button>
      <pre className="mt-4 p-4 bg-neutral-100">{response}</pre>
    </div>
  );
}
