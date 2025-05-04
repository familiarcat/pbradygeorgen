'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DownloadFormat {
  name: string;
  description: string;
  path: string;
  icon: string;
}

interface DownloadTestReport {
  pdfSource: string;
  formats: DownloadFormat[];
  timestamp: string;
}

interface BuildInfo {
  sourcePdf: string;
  lastUpdated: string;
  buildMode: string;
  processedWithOpenAI: boolean;
}

export default function DownloadTest() {
  const router = useRouter();
  const [report, setReport] = useState<DownloadTestReport | null>(null);
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load the download test report
        const reportResponse = await fetch('/download_test_report.json');
        if (!reportResponse.ok) {
          throw new Error(`Failed to load download test report: ${reportResponse.status}`);
        }
        const reportData = await reportResponse.json();
        setReport(reportData);

        // Load the build info
        try {
          const buildInfoResponse = await fetch('/extracted/build_info.json');
          if (buildInfoResponse.ok) {
            const buildInfoData = await buildInfoResponse.json();
            setBuildInfo(buildInfoData);
            console.log('👑🌊 [Dante:Purgatorio] Build info loaded:', buildInfoData);
          } else {
            console.warn('👑🔥 [Dante:Inferno:Warning] Failed to load build info:', buildInfoResponse.status);
          }
        } catch (buildInfoErr) {
          console.warn('👑🔥 [Dante:Inferno:Warning] Error loading build info:', buildInfoErr);
        }

        // Load the preview content
        try {
          const previewResponse = await fetch('/extracted/resume_content.json');
          if (previewResponse.ok) {
            const previewData = await previewResponse.json();
            setPreviewContent(previewData);
            console.log('👑⭐ [Dante:Paradiso] Preview content loaded successfully');
          } else {
            // Fallback to downloads directory
            const fallbackResponse = await fetch('/downloads/preview_content.json');
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setPreviewContent(fallbackData);
              console.log('👑🌊 [Dante:Purgatorio] Preview content loaded from fallback location');
            } else {
              throw new Error(`Failed to load preview content: ${previewResponse.status}`);
            }
          }
        } catch (previewErr) {
          console.error('👑🔥 [Dante:Inferno:Error] Error loading preview content:', previewErr);
          throw previewErr;
        }
      } catch (err) {
        console.error('👑🔥 [Dante:Inferno:Error] Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Function to handle download
  const handleDownload = (path: string) => {
    window.open(path, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-t-4 border-amber-700 border-solid rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading Download Test...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl w-full mb-4">
          <h2 className="text-xl font-bold mb-2">Error Loading Download Test</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Functionality Test</h1>
          <p className="text-gray-700">
            This page tests the download functionality for different formats of the resume content.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preview Section */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 overflow-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Content Preview</h2>
            {previewContent ? (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-900">{previewContent.title}</h3>
                <p className="text-gray-800 italic mb-4">{previewContent.summary}</p>

                {previewContent.sections && Array.isArray(previewContent.sections) ? (
                  // Handle array format
                  previewContent.sections.map((section: any, index: number) => (
                    <div key={index} className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded">{section.title}</h4>
                      <div className="pl-4 border-l-2 border-blue-600 mt-2">
                        {section.content && typeof section.content === 'string' ? (
                          <p className="text-gray-800">{section.content}</p>
                        ) : section.content && Array.isArray(section.content) ? (
                          <ul className="list-disc pl-5 text-gray-800">
                            {section.content.map((item: string, i: number) => (
                              <li key={i} className="mb-1">{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : previewContent.sections && typeof previewContent.sections === 'object' ? (
                  // Handle object format
                  Object.entries(previewContent.sections).map(([key, value]: [string, any], index: number) => {
                    if (Array.isArray(value) && value.length === 0) return null;
                    return (
                      <div key={index} className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 bg-gray-50 p-2 rounded">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </h4>
                        <div className="pl-4 border-l-2 border-blue-600 mt-2">
                          {Array.isArray(value) ? (
                            <ul className="list-disc pl-5 text-gray-800">
                              {value.map((item: string, i: number) => (
                                <li key={i} className="mb-1">{item}</li>
                              ))}
                            </ul>
                          ) : typeof value === 'string' ? (
                            <p className="text-gray-800">{value}</p>
                          ) : (
                            <p className="text-gray-500 italic">No content available</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : null}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 italic mb-4">No preview content available</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Generate Preview
                </button>
              </div>
            )}
          </div>

          {/* Download Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">Download Options</h2>
            {report ? (
              <>
                <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                  <strong>Source:</strong> {report.pdfSource}
                  <br />
                  <strong>Last updated:</strong> {new Date(report.timestamp).toLocaleString()}

                  {buildInfo && (
                    <>
                      <hr className="my-2 border-gray-200" />
                      <strong>Build Info:</strong>
                      <ul className="mt-1 space-y-1">
                        <li><span className="font-medium">Source PDF:</span> {buildInfo.sourcePdf}</li>
                        <li><span className="font-medium">Build Mode:</span> {buildInfo.buildMode}</li>
                        <li><span className="font-medium">Last Updated:</span> {new Date(buildInfo.lastUpdated).toLocaleString()}</li>
                        <li>
                          <span className="font-medium">OpenAI Processing:</span>{' '}
                          {buildInfo.processedWithOpenAI ? (
                            <span className="text-green-600">✓ Enabled</span>
                          ) : (
                            <span className="text-red-600">✗ Disabled</span>
                          )}
                        </li>
                      </ul>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  {report.formats.map((format, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleDownload(format.path)}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{format.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{format.name}</h3>
                          <p className="text-sm text-gray-700">{format.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 italic mb-4">No download options available</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Generate Options
                </button>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                >
                  Return Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
                <button
                  onClick={() => {
                    // Run the PDF reference manager
                    fetch('/api/process-pdf', { method: 'POST' })
                      .then(response => {
                        if (response.ok) {
                          window.location.reload();
                        } else {
                          alert('Failed to process PDF. Please try again.');
                        }
                      })
                      .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again.');
                      });
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Reprocess PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
