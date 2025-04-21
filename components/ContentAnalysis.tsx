'use client';

import { useState, useEffect } from 'react';
import { formatForDisplay } from '@/utils/textUtils';
import { cacheService } from '@/utils/cacheService';

interface ContentAnalysisProps {
  filePath: string;
}

interface AnalysisResult {
  summary: string;
  keySkills: string[];
  yearsOfExperience: string;
  educationLevel: string;
  careerHighlights: string[];
  industryExperience: string[];
  recommendations: string[];
}

export default function ContentAnalysis({ filePath }: ContentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track if we're in development mode
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Check if we're in development mode on the client side
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  const analyzeContent = async (forceRefresh = false) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath, forceRefresh }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const data = await response.json();

      // Log the received analysis data
      console.log('Analysis data received:', Object.keys(data.analysis));

      // Check for unexpected fields that might be causing the issue
      const unexpectedFields = Object.keys(data.analysis).filter(key =>
        !['summary', 'keySkills', 'yearsOfExperience', 'educationLevel',
          'careerHighlights', 'industryExperience', 'recommendations'].includes(key)
      );

      if (unexpectedFields.length > 0) {
        console.warn('Unexpected fields in analysis data:', unexpectedFields);
        // Create a clean copy without unexpected fields
        const cleanAnalysis = {
          summary: data.analysis.summary,
          keySkills: data.analysis.keySkills,
          yearsOfExperience: data.analysis.yearsOfExperience,
          educationLevel: data.analysis.educationLevel,
          careerHighlights: data.analysis.careerHighlights,
          industryExperience: data.analysis.industryExperience,
          recommendations: data.analysis.recommendations
        };
        setAnalysis(cleanAnalysis);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze on component mount
  useEffect(() => {
    // Only analyze if we don't already have analysis data
    if (!analysis && !isAnalyzing && !error) {
      analyzeContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="analyzer-section-content p-4">
      {isAnalyzing && (
        <div className="flex justify-start mb-4">
          <div className="analyzer-button analyzer-button-secondary text-sm flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 analyzer-section-content text-[var(--state-error)]">
          {error}
        </div>
      )}

      {isAnalyzing && !analysis && (
        <div className="animate-pulse space-y-4 py-1">
          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6"></div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="prose max-w-none max-h-[500px] overflow-y-auto pr-2">
          {/* Refresh button - only shown in development mode */}
          {isDevelopment && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => analyzeContent(true)}
                disabled={isAnalyzing}
                className="analyzer-button analyzer-button-secondary text-sm flex items-center px-3 py-1 rounded"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Analysis
                  </>
                )}
              </button>
            </div>
          )}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="analyzer-section-header">Summary</h3>

              {/* Salinger-inspired download options */}
              <div className="relative group">
                <button
                  className="analyzer-button analyzer-button-secondary text-sm flex items-center px-3 py-1 rounded"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>

                {/* Dropdown menu with Salinger-inspired styling */}
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-[var(--bg-secondary)] ring-1 ring-[var(--border-primary)] ring-opacity-5 focus:outline-none z-10 hidden group-hover:block">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <a
                      href="/pbradygeorgen_resume.pdf"
                      download
                      className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Original PDF
                    </a>
                    <a
                      href="/extracted/resume_content.md"
                      download="pbradygeorgen_resume.md"
                      className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Markdown (.md)
                    </a>
                    <button
                      onClick={() => {
                        // Create a text version and download it
                        const textContent = `# P. Brady Georgen Resume\n\n## Summary\n${analysis.summary}\n\n## Skills\n${analysis.keySkills.join(', ')}\n\n## Experience\n${analysis.yearsOfExperience}\n\n## Education\n${analysis.educationLevel}\n\n## Career Highlights\n${analysis.careerHighlights.join('\n')}\n\n## Industries\n${analysis.industryExperience.join(', ')}\n\n## Looking For\n${analysis.recommendations.join('\n')}\n`;

                        const blob = new Blob([textContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'pbradygeorgen_resume.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150 ease-in-out"
                      role="menuitem"
                    >
                      Plain Text (.txt)
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="analyzer-section-content p-3 rounded">{formatForDisplay(analysis.summary)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="analyzer-section-header">My Skills</h3>
              <ul className="list-disc pl-5 analyzer-section-content p-3 rounded">
                {analysis.keySkills.map((skill, index) => (
                  <li key={index}>{formatForDisplay(skill)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="analyzer-section-header">Industries I&apos;ve Worked In</h3>
              <ul className="list-disc pl-5 analyzer-section-content p-3 rounded">
                {analysis.industryExperience.map((industry, index) => (
                  <li key={index}>{formatForDisplay(industry)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="analyzer-section-header">My Career Journey</h3>
            <ul className="list-disc pl-5 analyzer-section-content p-3 rounded">
              {analysis.careerHighlights.map((highlight, index) => (
                <li key={index}>{formatForDisplay(highlight)}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="analyzer-section-header">My Experience</h3>
              <p className="analyzer-section-content p-3 rounded">{formatForDisplay(analysis.yearsOfExperience)}</p>
            </div>

            <div>
              <h3 className="analyzer-section-header">My Education</h3>
              <p className="analyzer-section-content p-3 rounded">{formatForDisplay(analysis.educationLevel)}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="analyzer-section-header">What I&apos;m Looking For</h3>
            <ul className="list-disc pl-5 analyzer-section-content p-3 rounded">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>{formatForDisplay(recommendation)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
