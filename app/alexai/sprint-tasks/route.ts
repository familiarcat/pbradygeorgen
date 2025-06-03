// app/api/alexai/sprint-tasks/route.ts
import { NextResponse } from "next/server";

let crewAssignments: Record<string, boolean> = {}; // e.g. { data: true }

export async function GET() {
  try {
    const tasks = [
      { agent: "Alex", task: "Refactor katras_seed.json", priority: "High" },
      { agent: "Data", task: "Optimize AQL latency", priority: "High" },
      { agent: "Geordi", task: "Amplify deploy sync lock", priority: "Medium" },
      { agent: "Crusher", task: "Add /status endpoint", priority: "High" },
      { agent: "Picard", task: "Write SPRINT_LOG", priority: "Medium" },
    ].map((t) => ({ ...t, onMission: crewAssignments[t.agent.toLowerCase()] ?? false }));

    return NextResponse.json(tasks);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load tasks." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { agents } = await req.json(); // e.g. ["data", "geordi"]
  agents.forEach((a: string) => {
    crewAssignments[a.toLowerCase()] = true;
  });

  return NextResponse.json({ success: true });
}
