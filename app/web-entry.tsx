import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import App from '../App';

// This is the entry point for web builds
// It simply re-exports the main App component

function WebApp() {
  useEffect(() => {
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
  }, []);

  return <App />;
}

// Register the root component for web
registerRootComponent(WebApp);

// Export the component as default
export default WebApp;
