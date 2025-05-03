'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Download Functionality Test Report Page
 *
 * This page displays a report of the download functionality test results,
 * including previews of the various download formats.
 *
 * Philosophical Framework:
 * - Salinger: Simplifying the interface to focus on content
 * - Hesse: Balancing structure (test report) with flexibility (preview options)
 * - Derrida: Deconstructing the download formats
 * - Dante: Guiding the user through the download options
 */
export default function DownloadTestPage() {
  const [testReport, setTestReport] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('downloads');
  const [activePreviewTab, setActivePreviewTab] = useState('text');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 [Dante:Debug] Fetching download test data...');

        // Fetch the test report
        console.log('🔍 [Dante:Debug] Fetching test report from /download_test_report.json');
        const reportResponse = await fetch('/download_test_report.json');
        if (!reportResponse.ok) {
          console.error(`❌ [Dante:Error] Failed to fetch test report: ${reportResponse.status}`);
          throw new Error(`Failed to fetch test report: ${reportResponse.status}`);
        }

        const reportData = await reportResponse.json();
        console.log('✅ [Dante:Success] Test report fetched successfully');
        console.log('📊 [Dante:Data] Test report data:', reportData);
        setTestReport(reportData);

        // Fetch the preview content
        console.log('🔍 [Dante:Debug] Fetching preview content from /downloads/preview_content.json');
        const previewResponse = await fetch('/downloads/preview_content.json');
        if (previewResponse.ok) {
          const previewData = await previewResponse.json();
          console.log('✅ [Dante:Success] Preview content fetched successfully');
          setPreviewContent(previewData);
        } else {
          console.warn(`⚠️ [Dante:Warning] Failed to fetch preview content: ${previewResponse.status}`);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ [Dante:Error] Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Download Functionality Test Report</h1>
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-gray-600">Loading report data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Download Functionality Test Report</h1>
          <div className="bg-white shadow rounded-lg p-8">
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Download Functionality Test Report</h1>

        {/* Tab navigation */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'downloads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('downloads')}
              >
                Download Links
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Content Preview
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('report')}
              >
                Test Report
              </button>
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow rounded-lg p-8">
          {/* Downloads Tab */}
          {activeTab === 'downloads' && testReport && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Downloads</h2>
              <p className="mb-6">Report generated at: {new Date(testReport.timestamp).toLocaleString()}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testReport.formats?.text?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Text Format</h3>
                    <p className="text-gray-600 mb-4">Plain text format for maximum compatibility.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.text.size} bytes</p>
                    <Link
                      href={testReport.formats.text.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download Text
                    </Link>
                  </div>
                )}

                {testReport.formats?.markdown?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Markdown Format</h3>
                    <p className="text-gray-600 mb-4">Formatted text with Markdown syntax.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.markdown.size} bytes</p>
                    <Link
                      href={testReport.formats.markdown.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download Markdown
                    </Link>
                  </div>
                )}

                {testReport.formats?.json?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">JSON Format</h3>
                    <p className="text-gray-600 mb-4">Structured data in JSON format.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.json.size} bytes</p>
                    <Link
                      href={testReport.formats.json.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download JSON
                    </Link>
                  </div>
                )}

                {testReport.formats?.html?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">HTML Format</h3>
                    <p className="text-gray-600 mb-4">Formatted HTML document.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.html.size} bytes</p>
                    <Link
                      href={testReport.formats.html.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download HTML
                    </Link>
                  </div>
                )}

                {testReport.formats?.coverLetter?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
                    <p className="text-gray-600 mb-4">Generated cover letter in Markdown format.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.coverLetter.size} bytes</p>
                    <Link
                      href={testReport.formats.coverLetter.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download Cover Letter
                    </Link>
                  </div>
                )}

                {testReport.formats?.coverLetterHtml?.available && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Cover Letter HTML</h3>
                    <p className="text-gray-600 mb-4">Generated cover letter in HTML format.</p>
                    <p className="text-sm text-gray-500 mb-4">Size: {testReport.formats.coverLetterHtml.size} bytes</p>
                    <Link
                      href={testReport.formats.coverLetterHtml.path}
                      className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      target="_blank"
                    >
                      Download Cover Letter HTML
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && previewContent && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Content Preview</h2>

              {/* Preview tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex overflow-x-auto -mb-px">
                  <button
                    className={`mr-6 py-2 border-b-2 font-medium text-sm ${
                      activePreviewTab === 'text'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActivePreviewTab('text')}
                  >
                    Text
                  </button>
                  <button
                    className={`mr-6 py-2 border-b-2 font-medium text-sm ${
                      activePreviewTab === 'markdown'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActivePreviewTab('markdown')}
                  >
                    Markdown
                  </button>
                  <button
                    className={`mr-6 py-2 border-b-2 font-medium text-sm ${
                      activePreviewTab === 'json'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActivePreviewTab('json')}
                  >
                    JSON
                  </button>
                  <button
                    className={`mr-6 py-2 border-b-2 font-medium text-sm ${
                      activePreviewTab === 'coverLetter'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActivePreviewTab('coverLetter')}
                  >
                    Cover Letter
                  </button>
                </nav>
              </div>

              {/* Preview content */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="overflow-auto" style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' }}>
                  {activePreviewTab === 'text' && (
                    <pre className="whitespace-pre-wrap">{previewContent.formats?.text}</pre>
                  )}

                  {activePreviewTab === 'markdown' && (
                    <SyntaxHighlighter language="markdown" style={tomorrow}>
                      {previewContent.formats?.markdown}
                    </SyntaxHighlighter>
                  )}

                  {activePreviewTab === 'json' && (
                    <SyntaxHighlighter language="json" style={tomorrow}>
                      {previewContent.formats?.json}
                    </SyntaxHighlighter>
                  )}

                  {activePreviewTab === 'coverLetter' && (
                    <SyntaxHighlighter language="markdown" style={tomorrow}>
                      {previewContent.formats?.coverLetter}
                    </SyntaxHighlighter>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>Preview content generated at: {new Date(previewContent.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && testReport && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Test Report</h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">All Formats Available</div>
                    <div className="mt-1 flex items-center">
                      <span className={`inline-block w-4 h-4 rounded-full mr-2 ${testReport.tests?.allFormatsAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-lg font-medium">{testReport.tests?.allFormatsAvailable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">Format Count</div>
                    <div className="mt-1 text-lg font-medium">{testReport.tests?.formatCount}</div>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <div className="text-sm text-gray-500">Total Size</div>
                    <div className="mt-1 text-lg font-medium">{testReport.tests?.totalSize} bytes</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Format Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Format</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Size</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Path</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {Object.entries(testReport.formats || {}).map(([format, info]) => (
                        <tr key={format}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{format}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {info.available ? 'Available' : 'Not Available'}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{info.size} bytes</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{info.path}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Download Functionality Test Report</p>
          <p>Generated with the Salinger philosophy of information transparency</p>
          <p className="mt-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
