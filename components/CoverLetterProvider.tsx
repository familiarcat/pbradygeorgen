'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

// Default cover letter content for fallback
const DEFAULT_COVER_LETTER = `# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`;

// Define the context type
interface CoverLetterContextType {
  content: string;
  isLoading: boolean;
  error: string | null;
  refreshContent: (forceRefresh?: boolean) => Promise<void>;
}

// Create the context
const CoverLetterContext = createContext<CoverLetterContextType>({
  content: DEFAULT_COVER_LETTER,
  isLoading: false,
  error: null,
  refreshContent: async () => {},
});

// Provider props
interface CoverLetterProviderProps {
  children: ReactNode;
}

// Provider component
export function CoverLetterProvider({ children }: CoverLetterProviderProps) {
  const [content, setContent] = useState<string>(DEFAULT_COVER_LETTER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch cover letter content
  const fetchCoverLetter = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching Cover Letter content (forceRefresh: ${forceRefresh})`);

      // Try to fetch from API first
      try {
        const response = await fetch(`/api/cover-letter?forceRefresh=${forceRefresh}&t=${Date.now()}`);

        if (response.ok) {
          const data = await response.json();

          if (data.success && data.content && data.content.trim() !== '') {
            console.log(`Received content from API (${data.content.length} characters)`);
            setContent(data.content);
            if (DanteLogger) DanteLogger.success.basic('Cover Letter content fetched from API successfully');
            return;
          }
        }

        console.log('API response did not contain valid content, using default');
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
      }

      // If API fails, try to fetch from static file
      try {
        const response = await fetch(`/extracted/cover_letter.md?t=${Date.now()}`);

        if (response.ok) {
          const text = await response.text();

          if (text && text.trim() !== '') {
            console.log(`Received content from static file (${text.length} characters)`);
            setContent(text);
            if (DanteLogger) DanteLogger.success.basic('Cover Letter content fetched from static file successfully');
            return;
          }
        }

        console.log('Static file response did not contain valid content, using default');
      } catch (fileError) {
        console.error('Error fetching from static file:', fileError);
      }

      // If all else fails, use the default content
      console.log('Using default cover letter content');
      setContent(DEFAULT_COVER_LETTER);
      if (DanteLogger) DanteLogger.success.basic('Using default Cover Letter content');
    } catch (error) {
      console.error('Error in fetchCoverLetter:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch Cover Letter content');
      if (DanteLogger) DanteLogger.error.dataFlow(`Error fetching Cover Letter content: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch content on initial load with debounce
  useEffect(() => {
    // Use a flag to prevent multiple fetches
    let isFetching = false;

    // Add a check to prevent excessive fetches
    const lastFetchKey = 'lastCoverLetterFetch';
    const lastFetch = localStorage.getItem(lastFetchKey);
    const now = Date.now();

    // Only fetch if it's been more than 5 minutes since the last fetch
    const fetchContent = async () => {
      if (isFetching) return;

      try {
        isFetching = true;

        if (!lastFetch || (now - parseInt(lastFetch)) > 5 * 60 * 1000) {
          console.log('Cover Letter: Fetching content');
          await fetchCoverLetter(false);
          // Store the fetch time
          localStorage.setItem(lastFetchKey, now.toString());
        } else {
          console.log('Cover Letter: Skipped fetch (fetched recently)');
          if (DanteLogger) DanteLogger.success.basic('Cover Letter content fetched recently, skipping fetch');
        }
      } finally {
        isFetching = false;
      }
    };

    fetchContent();

    // Cleanup function
    return () => {
      isFetching = true; // Prevent any pending fetches
    };
  }, []);

  // Context value
  const value = {
    content,
    isLoading,
    error,
    refreshContent: fetchCoverLetter,
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

// Hook to use the context
export function useCoverLetter() {
  return useContext(CoverLetterContext);
}
