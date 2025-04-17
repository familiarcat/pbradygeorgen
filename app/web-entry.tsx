import React, { useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import App from '../App';
import { WebRouter } from './web-router';

// This is the entry point for web builds
// It simply re-exports the main App component

function WebApp() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Add console logs to verify the app is loaded
      console.log('WebApp component mounted successfully');

      // Remove loading message
      const loadingElement = document.querySelector('.loading');
      if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
      }

      // Log environment info
      console.log('Environment:', {
        window: typeof window !== 'undefined',
        location: window?.location?.href,
        navigator: window?.navigator?.userAgent
      });

      // Add global error handler
      window.onerror = (message, source, lineno, colno, err) => {
        console.error('Global error caught:', { message, source, lineno, colno, err });
        setError(err || new Error(String(message)));
        return true; // Prevent default error handling
      };
    } catch (e) {
      console.error('Error in WebApp useEffect:', e);
      setError(e instanceof Error ? e : new Error('Unknown error'));
    }
  }, []);

  // If there's an error, show a simple error message
  if (error) {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
        <h1>Something went wrong</h1>
        <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  // For web, we'll use our WebRouter component directly
  // This ensures that the root URL shows the ResumeScreen
  try {
    // Check if we're on the web
    const isWeb = typeof window !== 'undefined' && window.location && window.location.href.includes('pbradygeorgen.com');

    if (isWeb) {
      console.log('Using WebRouter for direct routing to ResumeScreen');
      return <WebRouter />;
    } else {
      // Use the normal App component for non-web environments
      return <App />;
    }
  } catch (e) {
    console.error('Error rendering App:', e);
    setError(e instanceof Error ? e : new Error('Error rendering App'));
    return null;
  }
}

// Register the root component for web
registerRootComponent(WebApp);

// Export the component as default
export default WebApp;
