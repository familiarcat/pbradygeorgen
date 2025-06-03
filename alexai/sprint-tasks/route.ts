// app/api/alexai/sprint-tasks/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = [
    {
      agent: "Alex",
      task: "Refactor katras_seed.json to include ethos_tag",
      priority: "High",
    },
    {
      agent: "Data",
      task: "Optimize Arango AQL latency and add modal abstraction",
      priority: "High",
    },
    {
      agent: "Geordi",
      task: "Create katra-sync.lock and Amplify deploy handshake",
      priority: "Medium",
    },
    {
      agent: "Crusher",
      task: "Expose /status API and batch Arango queries",
      priority: "High",
    },
    {
      agent: "Picard",
      task: "Generate SPRINT_LOG_STARDATE_47205.json and LCARS summary",
      priority: "Medium",
    },
  ];

  return NextResponse.json(tasks);
}
