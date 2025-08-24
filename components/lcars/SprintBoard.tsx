import { lcarsTokens } from "@/tokens/lcars-token-map";
'use client';
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
}