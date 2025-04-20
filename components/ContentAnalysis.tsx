'use client';

import { useState, useEffect } from 'react';

interface ContentAnalysisProps {
  filePath: string;
}

interface AnalysisResult {
  summary: string;
  keySkills: string[];
  industryExperience: string[];
  careerHighlights: string[];
  yearsOfExperience: string;
  educationLevel: string;
  recommendations: string[];
}

export default function ContentAnalysis({ filePath }: ContentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  // Function to analyze content
  const analyzeContent = async () => {
    if (!content) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fetch content on mount
  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      }
    }

    fetchContent();
  }, [filePath]);

  // Auto-analyze when content is loaded
  useEffect(() => {
    if (content) {
      analyzeContent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div className="p-4 aw-content-panel">
      <div className="flex justify-start mb-4">
        <button
          onClick={analyzeContent}
          disabled={isAnalyzing}
          className="aw-button-secondary text-sm flex items-center"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Refresh Analysis'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 aw-content-section rounded">
          {error}
        </div>
      )}

      {isAnalyzing && !analysis && (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}

      {analysis && (
        <div className="prose max-w-none max-h-[500px] overflow-y-auto pr-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Summary</h3>
            <p className="aw-content-section p-3 rounded">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Key Skills</h3>
              <ul className="list-disc pl-5 aw-content-section p-3 rounded">
                {analysis.keySkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Industry Experience</h3>
              <ul className="list-disc pl-5 aw-content-section p-3 rounded">
                {analysis.industryExperience.map((industry, index) => (
                  <li key={index}>{industry}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Career Highlights</h3>
            <ul className="list-disc pl-5 aw-content-section p-3 rounded">
              {analysis.careerHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Experience</h3>
              <p className="aw-content-section p-3 rounded">{analysis.yearsOfExperience}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">Education</h3>
              <p className="aw-content-section p-3 rounded">{analysis.educationLevel}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">AI Recommendations</h3>
            <ul className="list-disc pl-5 aw-content-section p-3 rounded">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
