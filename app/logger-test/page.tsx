'use client';

import React, { useEffect } from 'react';
import { PhilosophicalLogger } from '@/utils/PhilosophicalLogger';
import { useLogger, useComponentLogger } from '@/contexts/LoggerContext';

export default function LoggerTestPage() {
  const logger = useLogger();
  const componentLogger = useComponentLogger('LoggerTestPage');

  useEffect(() => {
    // Test direct PhilosophicalLogger
    console.log('Testing direct PhilosophicalLogger:');
    PhilosophicalLogger.system.info('Direct PhilosophicalLogger test');
    PhilosophicalLogger.error.validation('Test validation error', { test: true });
    PhilosophicalLogger.process.start('Test process');
    PhilosophicalLogger.process.complete('Test process completed');
    PhilosophicalLogger.ux.interaction('Test user interaction');
    PhilosophicalLogger.ai.start('Test AI process');
    PhilosophicalLogger.openai.request('Test OpenAI request');

    // Test useLogger hook
    console.log('Testing useLogger hook:');
    logger.system.info('useLogger hook test');
    logger.error.validation('Test validation error from hook', { test: true });
    logger.process.start('Test process from hook');
    logger.process.complete('Test process completed from hook');
    logger.ux.interaction('Test user interaction from hook');
    logger.ai.start('Test AI process from hook');
    logger.openai.request('Test OpenAI request from hook');

    // Test useComponentLogger hook
    console.log('Testing useComponentLogger hook:');
    componentLogger.info('useComponentLogger hook test');
    componentLogger.error('Test error from component logger', { test: true });
    componentLogger.debug('Test debug from component logger');
    componentLogger.interaction('Test interaction from component logger');
  }, [logger, componentLogger]);

  const handleTestClick = () => {
    logger.ux.interaction('Test button clicked');
    logger.system.info('Button click handler executed');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PhilosophicalLogger Test Page</h1>
      <p>Check the console for log messages.</p>
      <button 
        onClick={handleTestClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Logger
      </button>
    </div>
  );
}
