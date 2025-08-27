/**
 * React Example for Dante Logger
 * 
 * This example demonstrates how to use Dante Logger in a React application.
 */

import React, { useState, useEffect } from 'react';
import { 
  DanteLoggerProvider, 
  useDanteLogger,
  useComponentLogger,
  usePerformanceLogger
} from 'dante-logger/react';

// Configure the logger for browser environment
const loggerConfig = {
  formatting: {
    includeTimestamp: false,  // Browsers add timestamps automatically
    includeEmoji: true,
    colorize: true
  }
};

// Main App component
function App() {
  return (
    <DanteLoggerProvider config={loggerConfig}>
      <div className="app">
        <h1>Dante Logger React Example</h1>
        <Counter />
        <UserProfile userId={123} />
        <ErrorButton />
      </div>
    </DanteLoggerProvider>
  );
}

// Simple counter component with component logging
function Counter() {
  const [count, setCount] = useState(0);
  const logger = useComponentLogger('Counter', { 
    logMount: true,
    logUnmount: true,
    logRender: true
  });
  
  const handleIncrement = () => {
    logger.success.basic('Counter incremented');
    setCount(count + 1);
  };
  
  const handleDecrement = () => {
    if (count > 0) {
      logger.success.basic('Counter decremented');
      setCount(count - 1);
    } else {
      logger.warn.validation('Cannot decrement below zero');
    }
  };
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
}

// User profile component with performance logging
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use performance logger to track render times
  const logger = usePerformanceLogger('UserProfile', [user, loading, error]);
  
  useEffect(() => {
    logger.success.basic(`Fetching user data for ID: ${userId}`);
    
    // Simulate API call
    setTimeout(() => {
      // Simulate successful response
      if (userId === 123) {
        logger.success.core('User data fetched successfully');
        setUser({ id: 123, name: 'John Doe', email: 'john@example.com' });
        setLoading(false);
      } 
      // Simulate error
      else {
        logger.error.dataFlow(`Failed to fetch user data for ID: ${userId}`);
        setError('User not found');
        setLoading(false);
      }
    }, 1000);
  }, [userId]);
  
  if (loading) {
    return <div>Loading user data...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

// Button that triggers an error
function ErrorButton() {
  const logger = useDanteLogger();
  
  const handleClick = () => {
    try {
      logger.warn.security('About to trigger an error');
      // Deliberately cause an error
      const obj = null;
      obj.nonExistentMethod();
    } catch (error) {
      logger.error.runtime('Error button clicked', { error });
    }
  };
  
  return (
    <div className="error-button">
      <h2>Error Testing</h2>
      <button onClick={handleClick}>Trigger Error</button>
    </div>
  );
}

export default App;
