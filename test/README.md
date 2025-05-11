# AlexAI Testing Framework

This document outlines the testing framework for the AlexAI project, explaining the philosophy, structure, and usage of the testing system.

## Core Principles

The testing framework follows these core principles:

1. **Dante (Structure)**: Hierarchical organization of test suites and cases
2. **Hesse (Precision)**: Technical precision and intellectual clarity in tests
3. **Salinger (Authenticity)**: Human-readable, authentic test results
4. **Derrida (Deconstruction)**: Breaking down complex functionality into testable units

## Testing Structure

The testing framework is organized into the following components:

### 1. Unified Test Harness

The unified test harness (`scripts/unified-test-harness.js`) is the core of the testing framework. It provides a structured way to run tests across different areas of the application. The harness:

- Organizes tests into logical suites
- Provides consistent logging and reporting
- Handles test failures gracefully
- Generates comprehensive test reports

### 2. Test Suites

Tests are organized into the following suites:

- **PDF Extraction**: Tests for extracting content from PDFs
- **OpenAI Integration**: Tests for OpenAI API integration
- **Download Functionality**: Tests for downloading content in different formats
- **Environment Setup**: Tests for environment configuration
- **Build Process**: Tests for the application build process
- **Deployment**: Tests for deployment to production environments

### 3. Unified Logger

The unified logger (`utils/UnifiedLogger.js`) provides consistent logging across all tests. It follows the four philosophical approaches:

- **Dante**: Hierarchical organization of log types
- **Hesse**: Technical precision and intellectual clarity
- **Salinger**: Human-readable, authentic representation
- **Derrida**: Breaking down traditional logging categories

## Running Tests

### Command Line Interface

The testing framework provides a simple command-line interface for running tests:

```bash
# Run all tests
npm test

# Run all test suites
npm run test:all

# Run a specific test suite
npm run test:pdf
npm run test:openai
npm run test:download
npm run test:env
npm run test:build
npm run test:deploy

# Run end-to-end tests
npm run test:e2e
```

### Test Runner

You can also use the test runner directly for more control:

```bash
# Run all tests
node scripts/run-unified-tests.js

# Run a specific test suite
node scripts/run-unified-tests.js --suite=pdf-extraction

# Run all test suites
node scripts/run-unified-tests.js --all

# Show help
node scripts/run-unified-tests.js --help
```

## Test Reports

The testing framework generates comprehensive test reports in both JSON and HTML formats. These reports include:

- Test summary (total, passed, failed, skipped)
- Detailed test results for each test case
- Error messages and stack traces for failed tests
- Content previews for content validation tests

Reports are saved in the `test-results` directory with timestamps.

## Writing Tests

### Test Structure

Each test script should follow this structure:

1. **Setup**: Prepare the test environment
2. **Execution**: Run the functionality being tested
3. **Verification**: Verify the results
4. **Cleanup**: Clean up the test environment

### Using the Unified Logger

Tests should use the unified logger for consistent logging:

```javascript
const logger = require('../utils/UnifiedLogger');

// Log a test start
logger.summary.start('Starting test');

// Log test progress
logger.summary.progress('Test in progress');

// Log test success
logger.success.basic('Test passed');

// Log test failure
logger.error.runtime('Test failed');

// Log test completion
logger.summary.complete('Test completed');
```

### Error Handling

Tests should handle errors gracefully and provide clear error messages:

```javascript
try {
  // Test code
} catch (error) {
  logger.error.runtime(`Test failed: ${error.message}`);
  process.exit(1);
}
```

## Extending the Framework

### Adding a New Test Suite

To add a new test suite:

1. Create a new test script in the `scripts` directory
2. Add the suite to the `suites` array in `unified-test-harness.js`
3. Add a new npm script to `package.json`

### Adding a New Test Case

To add a new test case to an existing suite:

1. Add the test case to the appropriate test script
2. Update the test suite to include the new test case

## Philosophical Alignment

The testing framework aligns with the four core philosophical approaches:

- **Dante (Structure)**: Tests are organized in a hierarchical structure, with clear dependencies and flow.
- **Hesse (Precision)**: Tests are precise and technical, with clear documentation and error handling.
- **Salinger (Authenticity)**: Tests provide human-readable output and authentic representation of the functionality.
- **Derrida (Deconstruction)**: Tests break down complex functionality into smaller, more testable units.
