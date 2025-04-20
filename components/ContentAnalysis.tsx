'use client';

import { useState, useEffect } from 'react';

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

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
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
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-start mb-4">
        <button
          onClick={analyzeContent}
          disabled={isAnalyzing}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300 flex items-center text-sm"
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
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {isAnalyzing && !analysis && (
        <div className="animate-pulse space-y-4 py-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="prose max-w-none max-h-[500px] overflow-y-auto pr-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Summary</h3>
            <p className="bg-gray-50 p-3 rounded">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Key Skills</h3>
              <ul className="list-disc pl-5 bg-gray-50 p-3 rounded">
                {analysis.keySkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Industry Experience</h3>
              <ul className="list-disc pl-5 bg-gray-50 p-3 rounded">
                {analysis.industryExperience.map((industry, index) => (
                  <li key={index}>{industry}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Career Highlights</h3>
            <ul className="list-disc pl-5 bg-gray-50 p-3 rounded">
              {analysis.careerHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Experience</h3>
              <p className="bg-gray-50 p-3 rounded">{analysis.yearsOfExperience}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">Education</h3>
              <p className="bg-gray-50 p-3 rounded">{analysis.educationLevel}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white py-2">AI Recommendations</h3>
            <ul className="list-disc pl-5 bg-gray-50 p-3 rounded">
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
