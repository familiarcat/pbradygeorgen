'use client';

import React, { useEffect, useState } from 'react';
import { unifiedEnvironment } from '@/utils/UnifiedEnvironment';
import { unifiedStorage, STORAGE_FOLDERS, CONTENT_TYPES } from '@/utils/UnifiedStorageService';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * EnvironmentTester Component
 * 
 * This component tests the UnifiedEnvironment and UnifiedStorageService
 * to verify that they are working correctly in both local and remote environments.
 */
export default function EnvironmentTester() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function runTests() {
      try {
        setIsLoading(true);
        setTestResults([]);
        
        // Test 1: Verify UnifiedEnvironment
        const envTest = `Environment: ${unifiedEnvironment.environment}, Platform: ${unifiedEnvironment.platform}, Storage: ${unifiedEnvironment.storageType}`;
        setTestResults(prev => [...prev, `✅ UnifiedEnvironment: ${envTest}`]);
        
        // Log environment details using DanteLogger
        DanteLogger.debug.environment(`Testing environment: ${envTest}`);
        
        // Test 2: Test file upload with UnifiedStorageService
        const testContent = `Test content generated at ${new Date().toISOString()}`;
        const testFilePath = `${STORAGE_FOLDERS.TEMP}test-${Date.now()}.txt`;
        
        const uploadResult = await unifiedStorage.uploadText(
          testContent,
          testFilePath,
          { testId: 'environment-test' }
        );
        
        if (uploadResult.success) {
          setTestResults(prev => [...prev, `✅ UnifiedStorageService Upload: ${uploadResult.path}`]);
          DanteLogger.success.core(`File uploaded successfully: ${uploadResult.path}`);
        } else {
          setTestResults(prev => [...prev, `❌ UnifiedStorageService Upload Failed: ${uploadResult.message}`]);
          DanteLogger.error.system(`File upload failed: ${uploadResult.message}`);
        }
        
        // Test 3: Log browser details
        const browserInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          platform: navigator.platform,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        };
        
        setTestResults(prev => [...prev, `✅ Browser Info: ${JSON.stringify(browserInfo, null, 2)}`]);
        DanteLogger.debug.environment(`Browser info: ${JSON.stringify(browserInfo)}`);
        
        // Test complete
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        DanteLogger.error.system('Environment test failed', err);
      }
    }
    
    runTests();
  }, []);
  
  return (
    <div className="environment-tester" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Environment Test Results</h2>
      
      {isLoading && <p>Running environment tests...</p>}
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px', marginBottom: '1rem' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {testResults.length > 0 && (
        <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Test Results</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {testResults.join('\n')}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '1rem' }}>
        <h3>Environment Configuration</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify(unifiedEnvironment, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Run Tests Again
        </button>
      </div>
    </div>
  );
}
