'use client';

import React, { useState } from 'react';
import { PhilosophicalLogger } from '@/utils/PhilosophicalLogger';
import { useLogger, useComponentLogger } from '@/contexts/LoggerContext';

/**
 * Example component demonstrating direct use of PhilosophicalLogger
 */
export function DirectLoggerExample() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Log the user interaction
    PhilosophicalLogger.ux.interaction('Button clicked');
    
    // Log the process
    PhilosophicalLogger.process.start('Incrementing counter');
    
    // Increment the counter
    setCount(count + 1);
    
    // Log the process completion
    PhilosophicalLogger.process.complete('Counter incremented');
    
    // Log system information
    PhilosophicalLogger.system.info('Counter state updated', { newCount: count + 1 });
  };

  return (
    <div>
      <h2>Direct Logger Example</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

/**
 * Example component demonstrating use of useLogger hook
 */
export function UseLoggerExample() {
  const logger = useLogger();
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Log the user interaction
    logger.ux.interaction('Button clicked');
    
    // Log the process
    logger.process.start('Incrementing counter');
    
    // Increment the counter
    setCount(count + 1);
    
    // Log the process completion
    logger.process.complete('Counter incremented');
    
    // Log system information
    logger.system.info('Counter state updated', { newCount: count + 1 });
  };

  return (
    <div>
      <h2>useLogger Hook Example</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

/**
 * Example component demonstrating use of useComponentLogger hook
 */
export function UseComponentLoggerExample() {
  const logger = useComponentLogger('UseComponentLoggerExample', {
    logMount: true,
    logUnmount: true,
    logRender: false,
    logProps: false,
    logErrors: true,
  });
  
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Log the user interaction
    logger.interaction('Button clicked');
    
    // Log information
    logger.info('Incrementing counter');
    
    // Increment the counter
    setCount(count + 1);
    
    // Log debug information
    logger.debug('Counter state updated', { newCount: count + 1 });
  };

  const handleError = () => {
    try {
      // Simulate an error
      throw new Error('Example error');
    } catch (error) {
      // Log the error
      logger.error('An error occurred', { error });
    }
  };

  return (
    <div>
      <h2>useComponentLogger Hook Example</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleError}>Simulate Error</button>
    </div>
  );
}

/**
 * Example component demonstrating error logging
 */
export function ErrorLoggingExample() {
  const logger = useLogger();

  const handleValidationError = () => {
    // Log a validation error
    logger.error.validation('Invalid input', { input: 'example' });
  };

  const handleDataFlowError = () => {
    // Log a data flow error
    logger.error.dataFlow('Failed to fetch data', { url: 'https://example.com/api' });
  };

  const handleRuntimeError = () => {
    // Log a runtime error
    logger.error.runtime('Unexpected error occurred', { error: new Error('Example error') });
  };

  const handleSystemError = () => {
    // Log a system error
    logger.error.system('Critical system failure', { component: 'ErrorLoggingExample' });
  };

  return (
    <div>
      <h2>Error Logging Example</h2>
      <button onClick={handleValidationError}>Validation Error</button>
      <button onClick={handleDataFlowError}>Data Flow Error</button>
      <button onClick={handleRuntimeError}>Runtime Error</button>
      <button onClick={handleSystemError}>System Error</button>
    </div>
  );
}

/**
 * Example component demonstrating AI and OpenAI logging
 */
export function AILoggingExample() {
  const logger = useLogger();

  const handleAIProcess = () => {
    // Log AI process start
    logger.ai.start('Starting AI analysis');
    
    // Log AI information
    logger.ai.info('AI processing data');
    
    // Simulate AI processing
    setTimeout(() => {
      // Log AI success
      logger.ai.success('AI analysis completed successfully');
    }, 1000);
  };

  const handleOpenAIRequest = () => {
    // Log OpenAI request
    logger.openai.request('Sending request to OpenAI');
    
    // Simulate OpenAI request
    setTimeout(() => {
      // Log OpenAI response
      logger.openai.response('Received response from OpenAI');
    }, 1000);
  };

  const handleAIError = () => {
    // Log AI warning
    logger.ai.warning('AI encountered a non-critical issue');
    
    // Log AI error
    logger.ai.error('AI analysis failed');
  };

  const handleOpenAIError = () => {
    // Log OpenAI error
    logger.openai.error('OpenAI request failed');
  };

  return (
    <div>
      <h2>AI Logging Example</h2>
      <button onClick={handleAIProcess}>AI Process</button>
      <button onClick={handleOpenAIRequest}>OpenAI Request</button>
      <button onClick={handleAIError}>AI Error</button>
      <button onClick={handleOpenAIError}>OpenAI Error</button>
    </div>
  );
}

/**
 * Main example component that combines all examples
 */
export default function LoggingExample() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Philosophical Logger Examples</h1>
      
      <DirectLoggerExample />
      <hr />
      
      <UseLoggerExample />
      <hr />
      
      <UseComponentLoggerExample />
      <hr />
      
      <ErrorLoggingExample />
      <hr />
      
      <AILoggingExample />
    </div>
  );
}
