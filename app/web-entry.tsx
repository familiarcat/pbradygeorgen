import React from 'react';
import { registerRootComponent } from 'expo';
import App from '../App';

// This is the entry point for web builds
// It simply re-exports the main App component

function WebApp() {
  // Add a console log to verify the app is loaded
  console.log('WebApp component loaded successfully');
  return <App />;
}

// Register the root component for web
registerRootComponent(WebApp);

// Export the component as default
export default WebApp;
