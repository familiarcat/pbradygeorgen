import React from 'react';
import { registerRootComponent } from 'expo';
import App from '../App';

// This is the entry point for web builds
// It simply re-exports the main App component

export default function WebApp() {
  return <App />;
}

// Register the root component for web
registerRootComponent(WebApp);
