import { lcarsTokens } from "@/tokens/lcars-token-map";
'use client';
import { Story } from '@/types';

export default function StoryCard({ story }: { story: Story }) {
  return (
    <div className={`story-card status-${story.status.toLowerCase()}`}>
      <h3>{story.title}</h3>
      <p>{story.description}</p>
      <small>{story.assignee}</small>
    </div>
  );
}