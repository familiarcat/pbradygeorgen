"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlaywrightRunner;
const react_1 = require("react");
function PlaywrightRunner() {
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [selectedSuite, setSelectedSuite] = (0, react_1.useState)('all');
    const [selectedBrowser, setSelectedBrowser] = (0, react_1.useState)('chromium');
    const [testResults, setTestResults] = (0, react_1.useState)([]);
    const [liveOutput, setLiveOutput] = (0, react_1.useState)([]);
    // Mock test suites based on your actual test files
    const testSuites = [
        {
            id: 'unified-testing',
            name: 'Unified N8N Testing Interface',
            description: 'E2E tests for the unified testing console',
            testCount: 12,
            file: 'tests/e2e/unified-testing.spec.ts'
        },
        {
            id: 'n8n-endpoints',
            name: 'N8N API Endpoints',
            description: 'API endpoint testing and validation',
            testCount: 8,
            file: 'tests/api/n8n-endpoints.spec.ts'
        },
        {
            id: 'theme-system',
            name: 'Theme System',
            description: 'UI theme switching and persistence',
            testCount: 6,
            file: 'tests/components/theme-system.spec.ts'
        },
        {
            id: 'n8n-workflow-connectivity',
            name: 'N8N Workflow Connectivity',
            description: 'Integration tests for workflow connections',
            testCount: 10,
            file: 'tests/integration/n8n-workflow-connectivity.spec.ts'
        },
        {
            id: 'comprehensive-e2e',
            name: 'Comprehensive E2E',
            description: 'Full system integration tests',
            testCount: 15,
            file: 'tests/integration/comprehensive-e2e.spec.ts'
        }
    ];
    const browsers = [
        { id: 'chromium', name: 'Chromium', icon: '🖥️' },
        { id: 'firefox', name: 'Firefox', icon: '🦊' },
        { id: 'webkit', name: 'WebKit (Safari)', icon: '🧭' },
        { id: 'mobile-chrome', name: 'Mobile Chrome', icon: '📱' },
        { id: 'mobile-safari', name: 'Mobile Safari', icon: '📱' }
    ];
    const runTests = async (suite = 'all', browser = 'chromium') => {
        setIsRunning(true);
        setLiveOutput([]);
        setTestResults([]);
        // Simulate test execution
        const output = [
            '🎭 Starting Playwright Test Runner...',
            `🌐 Browser: ${browser}`,
            `📦 Test Suite: ${suite}`,
            '🛡️ DEVELOPMENT MODE: Cost protection active',
            '',
            '🚀 Running tests...'
        ];
        setLiveOutput(output);
        try {
            const response = await fetch('/api/playwright-runner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    suite: suite === 'all' ? undefined : suite,
                    browser,
                    project: browser
                })
            });
            const data = await response.json();
            if (data.success) {
                setTestResults(data.results);
                setLiveOutput(prev => [...prev, '✅ Tests completed successfully!']);
            }
            else {
                setLiveOutput(prev => [...prev, '❌ Test execution failed:', data.error]);
            }
        }
        catch (error) {
            setLiveOutput(prev => [...prev, '❌ Failed to run tests:', error instanceof Error ? error.message : 'Unknown error']);
        }
        finally {
            setIsRunning(false);
        }
    };
    const openPlaywrightUI = async () => {
        try {
            const response = await fetch('/api/playwright-runner/ui', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success && data.url) {
                window.open(data.url, '_blank');
            }
            else {
                setLiveOutput(prev => [...prev, '❌ Failed to open Playwright UI']);
            }
        }
        catch (error) {
            setLiveOutput(prev => [...prev, '❌ Failed to open Playwright UI:', error instanceof Error ? error.message : 'Unknown error']);
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return '✅';
            case 'failed': return '❌';
            case 'running': return '⏳';
            default: return '⏸️';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'passed': return '#10b981';
            case 'failed': return '#ef4444';
            case 'running': return '#3b82f6';
            default: return '#6b7280';
        }
    };
    return (<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>🎭 Playwright Test Runner</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Visual browser testing with real-time feedback
          </p>
        </div>
        <div style={{
            backgroundColor: '#f0fdf4',
            color: '#166534',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #bbf7d0'
        }}>
          🛡️ Cost Protection Active
        </div>
      </div>

      {/* Control Panel */}
      <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 8px 0' }}>🎮 Test Controls</h2>
        <p style={{ color: '#666', margin: '0 0 24px 0' }}>
          Configure and run your Playwright tests with visual feedback
        </p>

        {/* Browser Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
            Browser Target
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {browsers.map(browser => (<button key={browser.id} onClick={() => setSelectedBrowser(browser.id)} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: selectedBrowser === browser.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: selectedBrowser === browser.id ? '#eff6ff' : 'white',
                color: selectedBrowser === browser.id ? '#1d4ed8' : '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem'
            }}>
                <span>{browser.icon}</span>
                {browser.name}
              </button>))}
          </div>
        </div>

        {/* Test Suite Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
            Test Suite
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
            <button onClick={() => setSelectedSuite('all')} style={{
            padding: '12px',
            borderRadius: '6px',
            border: selectedSuite === 'all' ? '2px solid #3b82f6' : '1px solid #d1d5db',
            backgroundColor: selectedSuite === 'all' ? '#eff6ff' : 'white',
            color: selectedSuite === 'all' ? '#1d4ed8' : '#374151',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.875rem'
        }}>
              🎯 All Tests ({testSuites.reduce((acc, suite) => acc + suite.testCount, 0)})
            </button>
            {testSuites.map(suite => (<button key={suite.id} onClick={() => setSelectedSuite(suite.id)} style={{
                padding: '12px',
                borderRadius: '6px',
                border: selectedSuite === suite.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                backgroundColor: selectedSuite === suite.id ? '#eff6ff' : 'white',
                color: selectedSuite === suite.id ? '#1d4ed8' : '#374151',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem'
            }} title={suite.description}>
                <div style={{ fontWeight: '500' }}>{suite.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{suite.testCount} tests</div>
              </button>))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={() => runTests(selectedSuite, selectedBrowser)} disabled={isRunning} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isRunning ? '#9ca3af' : '#3b82f6',
            color: 'white',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
        }}>
            {isRunning ? (<>
                <span>⏳</span>
                Running Tests...
              </>) : (<>
                <span>▶️</span>
                Run Tests
              </>)}
          </button>

          <button onClick={openPlaywrightUI} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
        }}>
            <span>👁️</span>
            Open Playwright UI
          </button>

          <button onClick={() => {
            setTestResults([]);
            setLiveOutput([]);
        }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
        }}>
            <span>🔄</span>
            Clear Results
          </button>
        </div>
      </div>

      {/* Live Output */}
      {liveOutput.length > 0 && (<div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
          <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
            📊 Live Test Output
            {isRunning && <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>}
          </h3>
          <div style={{
                height: '160px',
                overflowY: 'auto',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
            }}>
            {liveOutput.map((line, index) => (<div key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                {line}
              </div>))}
          </div>
        </div>)}

      {/* Test Results */}
      {testResults.length > 0 && (<div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>📋 Test Results</h2>
          {testResults.map((suite, index) => (<div key={index} style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>
                    {suite.name}
                  </h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>
                    Duration: {suite.duration}ms
                  </p>
                </div>
                <div style={{
                    backgroundColor: suite.failedTests > 0 ? '#fef2f2' : '#f0fdf4',
                    color: suite.failedTests > 0 ? '#dc2626' : '#166534',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                  {suite.passedTests}/{suite.totalTests} passed
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {suite.tests.map((test, testIndex) => (<div key={testIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{getStatusIcon(test.status)}</span>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{test.name}</div>
                        {test.duration && (<div style={{ color: '#666', fontSize: '0.75rem' }}>
                            {test.duration}ms
                          </div>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {test.browser && (<span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                          {test.browser}
                        </span>)}
                      <span style={{
                        backgroundColor: test.status === 'passed' ? '#f0fdf4' : test.status === 'failed' ? '#fef2f2' : '#f0f9ff',
                        color: test.status === 'passed' ? '#166534' : test.status === 'failed' ? '#dc2626' : '#1d4ed8',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                    }}>
                        {test.status}
                      </span>
                    </div>
                  </div>))}
              </div>
            </div>))}
        </div>)}

      {/* Test Suite Info */}
      <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 8px 0' }}>📚 Available Test Suites</h3>
        <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '0.875rem' }}>
          Overview of your Playwright test files and their coverage
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {testSuites.map(suite => (<div key={suite.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>{suite.name}</h4>
                <span style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem'
            }}>
                  {suite.testCount} tests
                </span>
              </div>
              <p style={{ color: '#666', fontSize: '0.75rem', margin: '0 0 8px 0' }}>{suite.description}</p>
              <p style={{ color: '#9ca3af', fontSize: '0.625rem', fontFamily: 'monospace', margin: 0 }}>{suite.file}</p>
            </div>))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>);
}
//# sourceMappingURL=page.js.map