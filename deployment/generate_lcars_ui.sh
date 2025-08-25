#!/bin/bash
set -e

# 🧠 LCARS UI Assembly Script
# Synthesizes component files from crew deliberation and functional logic

PROJECT_ROOT=$(pwd)
echo "🖖 Initiating Observation Lounge Crew Tasks..."

# --- Component Generator Functions ---
generate_component() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$PROJECT_ROOT/$path")"
  echo "$content" >"$PROJECT_ROOT/$path"
  echo "♻️ Overwritten: $path"
}

# --- Root Layout (Server-rendered) ---
generate_component "app/layout.tsx" "import './globals.css';
import './styles/lcars.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'LCARS Agile Sprint UI',
  description: 'Observation Lounge interface for AI-powered sprint management',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link rel='stylesheet' href='/assets/lcars/lcars-fonts.css' />
      </head>
      <body>{children}</body>
    </html>
  );
}"

# --- Landing Page (Sprint Overview) ---
generate_component "app/page.tsx" "'use client';
import SprintBoard from '@/components/lcars/SprintBoard';

export default function HomePage() {
  return (
    <main>
      <SprintBoard />
    </main>
  );
}"

# --- LCARS Navigation Rail ---
generate_component "components/lcars/LcarsNavRail.tsx" "'use client';
import Link from 'next/link';

export default function LcarsNavRail() {
  return (
    <nav className='lcars-nav'>
      <ul>
        <li><Link href='/'>Dashboard</Link></li>
        <li><Link href='/grooming'>Grooming</Link></li>
        <li><Link href='/planning'>Planning</Link></li>
        <li><Link href='/active'>Active Sprint</Link></li>
        <li><Link href='/retro'>Retro</Link></li>
      </ul>
    </nav>
  );
}"

# --- Sprint Board (Column Grid for Story Phases) ---
generate_component "components/lcars/SprintBoard.tsx" "'use client';
import { useStories } from '@/hooks/useStories';
import StoryCard from './StoryCard';

export default function SprintBoard() {
  const stories = useStories();
  const phases = ['NEW', 'GROOMED', 'PLANNED', 'IN_PROGRESS', 'COMPLETE'];

  return (
    <div className='sprint-board'>
      {phases.map(phase => (
        <div key={phase} className='sprint-column'>
          <h2>{phase.replace('_', ' ')}</h2>
          {stories
            .filter(story => story.status === phase)
            .map(story => <StoryCard key={story.id} story={story} />)}
        </div>
      ))}
    </div>
  );
}"

# --- Story Card ---
generate_component "components/lcars/StoryCard.tsx" "'use client';
import { Story } from '@/types';

export default function StoryCard({ story }: { story: Story }) {
  return (
    <div className={\`story-card status-\${story.status.toLowerCase()}\`}>
      <h3>{story.title}</h3>
      <p>{story.description}</p>
      <small>{story.assignee}</small>
    </div>
  );
}"

# --- Story Fetch Hook ---
generate_component "hooks/useStories.ts" "'use client';
import { useEffect, useState } from 'react';
import { Story } from '@/types';

export function useStories(): Story[] {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(setStories);
  }, []);

  return stories;
}"

# --- API Route for Stories (Server-side) ---
generate_component "app/api/stories/route.ts" "import { NextResponse } from 'next/server';

const mockStories = [
  { id: '1', title: 'Set up warp core', description: 'Initial LCARS routing', assignee: 'Geordi', status: 'NEW' },
  { id: '2', title: 'Connect ArangoDB', description: 'Establish link with AI crew katras', assignee: 'Data', status: 'GROOMED' },
  { id: '3', title: 'Render Sprint Board', description: 'Complete UI column layout', assignee: 'Riker', status: 'PLANNED' },
  { id: '4', title: 'Style with LCARS CSS', description: 'Integrate proper federation colors', assignee: 'Crusher', status: 'IN_PROGRESS' },
  { id: '5', title: 'Conduct Retrospective', description: 'Highlight crew performance', assignee: 'Picard', status: 'COMPLETE' },
];

export function GET() {
  return NextResponse.json(mockStories);
}
"

# --- Story Type Definition ---
generate_component "types/index.ts" "export type Story = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'NEW' | 'GROOMED' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETE';
};"

# --- CSS (Basic LCARS theming) ---
generate_component "styles/lcars.css" "body {
  background: black;
  color: #ffcc66;
  font-family: 'LCARS', sans-serif;
}
.sprint-board {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
}
.sprint-column {
  flex: 1;
  margin: 0 1rem;
  background: #333;
  padding: 1rem;
  border-radius: 8px;
}
.story-card {
  background: #000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 5px solid #ffcc66;
}
"

echo "✅ LCARS Agile UI components deployed. Engage warp build: npm run build"
