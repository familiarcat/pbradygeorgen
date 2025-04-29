'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

export default function TestSSRPage() {
  const [serverContent, setServerContent] = useState<any>(null);
  const [clientContent, setClientContent] = useState<any>(null);
  const [serverTimestamp, setServerTimestamp] = useState<string>('');
  const [clientTimestamp, setClientTimestamp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Fetch content from the server
  useEffect(() => {
    const fetchServerContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch content from the server
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/refresh-content?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setServerContent(data);
        setServerTimestamp(new Date().toISOString());
        
        // Log success
        DanteLogger.success.core('Server content fetched successfully');
        console.log('Server content fetched successfully:', data);
      } catch (error) {
        // Log error
        DanteLogger.error.dataFlow('Error fetching server content');
        console.error('Error fetching server content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServerContent();
  }, [refreshCount]);

  // Fetch content directly from the client
  useEffect(() => {
    const fetchClientContent = async () => {
      try {
        // Fetch content directly from the client
        const timestamp = new Date().getTime();
        const response = await fetch(`/extracted/resume_content_analyzed.json?t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setClientContent(data);
        setClientTimestamp(new Date().toISOString());
        
        // Log success
        DanteLogger.success.core('Client content fetched successfully');
        console.log('Client content fetched successfully');
      } catch (error) {
        // Log error
        DanteLogger.error.dataFlow('Error fetching client content');
        console.error('Error fetching client content:', error);
      }
    };
    
    fetchClientContent();
  }, [refreshCount]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshCount(prevCount => prevCount + 1);
  };

  // Handle manual update
  const handleManualUpdate = async () => {
    try {
      // Call the update-content script via API
      const response = await fetch('/api/refresh-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log success
      DanteLogger.success.core('Content updated successfully');
      console.log('Content updated successfully:', data);
      
      // Refresh the content
      handleRefresh();
    } catch (error) {
      // Log error
      DanteLogger.error.dataFlow('Error updating content');
      console.error('Error updating content:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">SSR Content Test</h1>
      
      <div className="mb-4 flex space-x-2">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Content'}
        </button>
        
        <button
          onClick={handleManualUpdate}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Force Content Update'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Server-rendered Content</h2>
          <p className="mb-2"><strong>Timestamp:</strong> {serverTimestamp || 'Loading...'}</p>
          
          {serverContent ? (
            <div>
              <h3 className="text-lg font-semibold">Build Info</h3>
              <div className="bg-gray-100 p-2 rounded mb-4">
                <p><strong>Build Timestamp:</strong> {serverContent.buildInfo?.buildTimestamp}</p>
                <p><strong>PDF Path:</strong> {serverContent.buildInfo?.pdfInfo?.path}</p>
                <p><strong>Last Modified:</strong> {serverContent.buildInfo?.pdfInfo?.lastModified}</p>
              </div>
              
              {serverContent.analyzedInfo && (
                <div>
                  <h3 className="text-lg font-semibold">Analyzed Content</h3>
                  <div className="bg-gray-100 p-2 rounded">
                    <p><strong>Name:</strong> {serverContent.analyzedInfo.name}</p>
                    <p><strong>Sections:</strong> {serverContent.analyzedInfo.sections.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading server content...</p>
          )}
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Client-fetched Content</h2>
          <p className="mb-2"><strong>Timestamp:</strong> {clientTimestamp || 'Loading...'}</p>
          
          {clientContent ? (
            <div>
              <h3 className="text-lg font-semibold">Structured Content</h3>
              <div className="bg-gray-100 p-2 rounded mb-4">
                <p><strong>Name:</strong> {clientContent.structuredContent.name}</p>
                <p><strong>Summary:</strong> {clientContent.structuredContent.summary}</p>
              </div>
              
              <h3 className="text-lg font-semibold">Sections</h3>
              <div className="bg-gray-100 p-2 rounded">
                <p><strong>Sections:</strong> {Object.keys(clientContent.sections).join(', ')}</p>
                <p><strong>Structured Sections:</strong> {Object.keys(clientContent.structuredContent).join(', ')}</p>
              </div>
            </div>
          ) : (
            <p>Loading client content...</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Content Comparison</h2>
        
        {serverContent && clientContent ? (
          <div className="bg-gray-100 p-4 rounded">
            <p>
              <strong>Name Match:</strong>{' '}
              {serverContent.analyzedInfo?.name === clientContent.structuredContent.name ? (
                <span className="text-green-600">✅ Yes</span>
              ) : (
                <span className="text-red-600">❌ No</span>
              )}
            </p>
            
            <div className="mt-2">
              <p><strong>Server Name:</strong> {serverContent.analyzedInfo?.name}</p>
              <p><strong>Client Name:</strong> {clientContent.structuredContent.name}</p>
            </div>
            
            <p className="mt-4">
              <strong>Sections Match:</strong>{' '}
              {JSON.stringify(serverContent.analyzedInfo?.sections.sort()) === 
               JSON.stringify(Object.keys(clientContent.sections).sort()) ? (
                <span className="text-green-600">✅ Yes</span>
              ) : (
                <span className="text-red-600">❌ No</span>
              )}
            </p>
          </div>
        ) : (
          <p>Loading content for comparison...</p>
        )}
      </div>
    </div>
  );
}
