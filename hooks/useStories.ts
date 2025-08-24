'use client';
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
}
