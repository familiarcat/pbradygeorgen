// app/alexai/sprint-planning/page.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Task {
  agent: string;
  task: string;
  priority: string;
}

export default function SprintPlanning() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("/api/alexai/sprint-tasks");
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-lime-300 p-8 font-mono">
      <h1 className="text-4xl mb-6 border-b pb-2 border-lime-400">
        LCARS Sprint Planning - Observation Lounge
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <Card
            key={index}
            className="bg-[#001f1f] border border-lime-500 rounded-2xl shadow-xl p-4"
          >
            <CardContent>
              <h2 className="text-xl font-bold">{task.agent}</h2>
              <p className="mt-2 text-lime-100">{task.task}</p>
              <span className="block mt-2 text-sm italic text-lime-400">
                Priority: {task.priority}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-right">
        <Button onClick={() => router.push("/app/alexai")} className="bg-lime-600">
          Return to Observation Deck
        </Button>
      </div>
    </div>
  );
}
