'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { arbitrateAgentResponses } from '@/lib/metaAgent-full';

type AgentResponses = {
  bito: string;
  gemini: string;
  continue: string;
};

type BoardroomContextType = {
  lastDecision: string | null;
  runArbitration: (responses: AgentResponses) => Promise<string | null>;
};

const AgentBoardroomContext = createContext<BoardroomContextType | undefined>(undefined);

export function AgentBoardroomProvider({ children }: { children: ReactNode }) {
  const [lastDecision, setLastDecision] = useState<string | null>(null);

  const runArbitration = async (responses: AgentResponses): Promise<string | null> => {
    const result = await arbitrateAgentResponses(responses);
    setLastDecision(result);
    return result;
  };

  return (
    <AgentBoardroomContext.Provider value={{ lastDecision, runArbitration }}>
      {children}
    </AgentBoardroomContext.Provider>
  );
}
