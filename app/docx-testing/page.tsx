'use client';

/**
 * DOCX Testing Page
 * 
 * This page provides a comprehensive testing environment for DOCX file generation,
 * preview, and download functionality. It follows:
 * - Hesse philosophy by ensuring mathematical harmony in color theory
 * - Müller-Brockmann philosophy with clean, grid-based structure
 * - Derrida philosophy by deconstructing hardcoded implementations
 * - Dante philosophy with methodical logging
 * - Kantian ethics by maintaining professional business orientation
 */

import React, { useState, useEffect } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import DocxService from '@/utils/DocxService';
import DocxDownloadHandler from '@/components/DocxDownloadHandler';
import DynamicThemeProvider from '@/components/DynamicThemeProvider';

// Sample content for testing
const SAMPLE_CONTENT = `# DOCX Testing Document

## Introduction

This is a sample document for testing DOCX generation, preview, and download functionality.

## Features

- PDF-extracted font styling
- PDF-extracted color styling
- Proper heading hierarchy
- Lists and formatting

## Technical Details

The DOCX generation process uses:

1. A reference.docx template with PDF-extracted styles
2. Pandoc for conversion from Markdown to DOCX
3. Client-side download handling with proper MIME types

## Testing Results

| Test Case | Expected Result | Actual Result |
|-----------|----------------|---------------|
| Font Styling | PDF fonts applied | ✅ |
| Color Styling | PDF colors applied | ✅ |
| Download | File downloads correctly | ✅ |
| Preview | Preview displays correctly | ✅ |

## Conclusion

This document confirms that the DOCX generation, preview, and download functionality is working correctly.
`;

export default function DocxTestingPage() {
  // State for test results
  const [testResults, setTestResults] = useState<{
    [key: string]: {
      status: 'pending' | 'running' | 'success' | 'failure';
      message: string;
      details?: string;
    }
  }>({
    preGenerated: { status: 'pending', message: 'Checking pre-generated DOCX files...' },
    apiEndpoint: { status: 'pending', message: 'Testing API endpoint...' },
    downloadHandler: { status: 'pending', message: 'Testing DocxDownloadHandler component...' },
    styling: { status: 'pending', message: 'Testing PDF-extracted styling...' },
  });

  // State for console output
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  // Add to console output
  const logToConsole = (message: string) => {
    setConsoleOutput(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // Run tests on component mount
  useEffect(() => {
    const runTests = async () => {
      // Test 1: Check pre-generated DOCX files
      try {
        logToConsole('Starting Test 1: Checking pre-generated DOCX files');
        setTestResults(prev => ({
          ...prev,
          preGenerated: { ...prev.preGenerated, status: 'running' }
        }));

        // Check if resume.docx exists
        const resumeResponse = await fetch('/extracted/resume.docx', { method: 'HEAD' });
        if (!resumeResponse.ok) {
          throw new Error(`Resume DOCX not found: ${resumeResponse.status}`);
        }
        logToConsole('✅ resume.docx exists');

        // Check if introduction.docx exists
        const introResponse = await fetch('/extracted/introduction.docx', { method: 'HEAD' });
        if (!introResponse.ok) {
          throw new Error(`Introduction DOCX not found: ${introResponse.status}`);
        }
        logToConsole('✅ introduction.docx exists');

        // Check file sizes
        const resumeSize = resumeResponse.headers.get('Content-Length');
        const introSize = introResponse.headers.get('Content-Length');
        
        logToConsole(`Resume DOCX size: ${resumeSize} bytes`);
        logToConsole(`Introduction DOCX size: ${introSize} bytes`);

        if (parseInt(resumeSize || '0') < 1000 || parseInt(introSize || '0') < 1000) {
          throw new Error('DOCX files are too small, may be invalid');
        }

        // Update test result
        setTestResults(prev => ({
          ...prev,
          preGenerated: { 
            status: 'success', 
            message: 'Pre-generated DOCX files exist and are valid',
            details: `Resume: ${resumeSize} bytes, Introduction: ${introSize} bytes`
          }
        }));
      } catch (error) {
        logToConsole(`❌ Error in Test 1: ${error}`);
        setTestResults(prev => ({
          ...prev,
          preGenerated: { 
            status: 'failure', 
            message: 'Failed to verify pre-generated DOCX files',
            details: String(error)
          }
        }));
      }

      // Test 2: Test API endpoint
      try {
        logToConsole('Starting Test 2: Testing API endpoint');
        setTestResults(prev => ({
          ...prev,
          apiEndpoint: { ...prev.apiEndpoint, status: 'running' }
        }));

        // Test GET endpoint
        const getResponse = await fetch('/api/generate-docx?fileName=resume');
        if (!getResponse.ok) {
          throw new Error(`API GET request failed: ${getResponse.status}`);
        }
        
        const getData = await getResponse.json();
        logToConsole(`API GET response: ${JSON.stringify(getData)}`);
        
        if (!getData.success || !getData.docxUrl) {
          throw new Error('API GET response is invalid');
        }
        
        logToConsole('✅ API GET endpoint works correctly');

        // Test POST endpoint with minimal content
        const postResponse = await fetch('/api/generate-docx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markdownContent: '# Test Document',
            fileName: 'test-docx',
          }),
        });
        
        if (!postResponse.ok) {
          throw new Error(`API POST request failed: ${postResponse.status}`);
        }
        
        const postData = await postResponse.json();
        logToConsole(`API POST response: ${JSON.stringify(postData)}`);
        
        if (!postData.success || !postData.docxUrl) {
          throw new Error('API POST response is invalid');
        }
        
        logToConsole('✅ API POST endpoint works correctly');

        // Update test result
        setTestResults(prev => ({
          ...prev,
          apiEndpoint: { 
            status: 'success', 
            message: 'API endpoints are working correctly',
            details: `GET: ${getData.docxUrl}, POST: ${postData.docxUrl}`
          }
        }));
      } catch (error) {
        logToConsole(`❌ Error in Test 2: ${error}`);
        setTestResults(prev => ({
          ...prev,
          apiEndpoint: { 
            status: 'failure', 
            message: 'Failed to test API endpoints',
            details: String(error)
          }
        }));
      }

      // Test 3: Test DocxDownloadHandler component
      // This is a visual test that requires user interaction
      logToConsole('Starting Test 3: Testing DocxDownloadHandler component');
      setTestResults(prev => ({
        ...prev,
        downloadHandler: { 
          status: 'running', 
          message: 'Please use the download buttons below to test the component'
        }
      }));

      // Test 4: Test PDF-extracted styling
      // This is a visual test that requires user inspection
      logToConsole('Starting Test 4: Testing PDF-extracted styling');
      setTestResults(prev => ({
        ...prev,
        styling: { 
          status: 'running', 
          message: 'Please download and open the DOCX files to verify styling'
        }
      }));
    };

    runTests();
  }, []);

  // Handle download handler test completion
  const handleDownloadHandlerTest = (success: boolean, details?: string) => {
    setTestResults(prev => ({
      ...prev,
      downloadHandler: { 
        status: success ? 'success' : 'failure', 
        message: success ? 'DocxDownloadHandler component works correctly' : 'DocxDownloadHandler component test failed',
        details
      }
    }));
  };

  // Handle styling test completion
  const handleStylingTest = (success: boolean, details?: string) => {
    setTestResults(prev => ({
      ...prev,
      styling: { 
        status: success ? 'success' : 'failure', 
        message: success ? 'PDF-extracted styling works correctly' : 'PDF-extracted styling test failed',
        details
      }
    }));
  };

  return (
    <DynamicThemeProvider pdfUrl="/resume.pdf">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">DOCX Testing Page</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([key, test]) => (
              <div 
                key={key} 
                className={`p-4 rounded-lg border ${
                  test.status === 'success' ? 'border-green-500 bg-green-50' : 
                  test.status === 'failure' ? 'border-red-500 bg-red-50' : 
                  'border-yellow-500 bg-yellow-50'
                }`}
              >
                <h3 className="font-semibold mb-2 capitalize">{key} Test</h3>
                <p className="mb-2">{test.message}</p>
                {test.details && (
                  <div className="text-sm bg-white bg-opacity-50 p-2 rounded">
                    {test.details}
                  </div>
                )}
                <div className="mt-2 text-sm">
                  Status: {' '}
                  <span className={`font-semibold ${
                    test.status === 'success' ? 'text-green-600' : 
                    test.status === 'failure' ? 'text-red-600' : 
                    test.status === 'running' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Manual Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Test Pre-Generated Files</h3>
              <p className="mb-4">Download the pre-generated DOCX files to verify they work correctly:</p>
              <div className="flex flex-col space-y-4">
                <a 
                  href="/extracted/resume.docx" 
                  download="resume.docx"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  onClick={() => logToConsole('Downloading pre-generated resume.docx')}
                >
                  Download Resume DOCX
                </a>
                <a 
                  href="/extracted/introduction.docx" 
                  download="introduction.docx"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  onClick={() => logToConsole('Downloading pre-generated introduction.docx')}
                >
                  Download Introduction DOCX
                </a>
              </div>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Test DocxDownloadHandler</h3>
              <p className="mb-4">Use the DocxDownloadHandler component to generate and download DOCX files:</p>
              <div className="flex flex-col space-y-4">
                <DocxDownloadHandler
                  content={SAMPLE_CONTENT}
                  fileName="test-document"
                  documentType="resume"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  buttonText="Download Test Document"
                  usePdfStyles={true}
                  onDownloadStart={() => logToConsole('Starting DOCX download via DocxDownloadHandler')}
                  onDownloadComplete={() => {
                    logToConsole('DOCX download completed successfully');
                    handleDownloadHandlerTest(true, 'Download completed successfully');
                  }}
                  onError={(error) => {
                    logToConsole(`Error downloading DOCX: ${error}`);
                    handleDownloadHandlerTest(false, String(error));
                  }}
                />
                
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={() => handleStylingTest(true, 'Styling verified manually by user')}
                  >
                    Styling Works ✅
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleStylingTest(false, 'Styling reported as broken by user')}
                  >
                    Styling Broken ❌
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Console Output</h2>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            {consoleOutput.map((line, index) => (
              <div key={index} className="mb-1">{line}</div>
            ))}
            {consoleOutput.length === 0 && (
              <div className="text-gray-500">No console output yet...</div>
            )}
          </div>
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
