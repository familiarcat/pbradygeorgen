# Automated Testing Guide

This document provides instructions for using the automated testing tools to validate the Download Resume functionality and ensure code quality before committing changes.

## Automated Test Scripts

The project includes several automated test scripts:

### 1. Download Functionality Test

Tests the enhanced Download Resume functionality by:
- Starting the application in production mode
- Testing downloads in different formats (PDF, Markdown, Text)
- Verifying content and formatting of downloaded files
- Testing error handling with edge cases

```bash
npm run test:download
```

This script generates a detailed HTML report showing test results, including:
- Test summary (passed/failed/skipped)
- Content validation results
- Error details for failed tests

### 2. Pre-Commit Test

A comprehensive test suite that runs before committing code:
- Linting to ensure code quality
- Download functionality tests
- Build check to ensure the application builds successfully

```bash
npm run test:pre-commit
```

### 3. Git Hooks Setup

Sets up Git hooks to automatically run tests before committing:

```bash
npm run setup:git-hooks
```

This will install a pre-commit hook that runs the pre-commit test suite automatically when you try to commit changes.

## Philosophical Framework

The automated testing approach embodies our four philosophical principles:

- **Hesse (Structure and Balance)**: Structured, balanced testing approach that covers all formats and edge cases
- **Salinger (Authenticity)**: Authentic validation of content integrity across different formats
- **Derrida (Deconstruction)**: Deconstructing formats to verify content preservation during transformation
- **Dante (Navigation)**: Guided journey through success and error paths with clear reporting

## Development Workflow

1. Make changes to the codebase
2. Run `npm run test:download` to test the Download Resume functionality
3. Fix any issues identified by the tests
4. Run `npm run test:pre-commit` to ensure all tests pass
5. Commit your changes (tests will run automatically if Git hooks are set up)

## Continuous Integration

The automated tests can be integrated into a CI/CD pipeline:

1. Run tests on every pull request
2. Block merging if tests fail
3. Run tests before deploying to AWS Amplify

## Troubleshooting

If tests fail, check the following:

1. Review the test report for specific error details
2. Verify that the application builds successfully with `npm run build:local`
3. Check that the Download Resume functionality works manually
4. Ensure that error handling is properly implemented for edge cases

## Adding New Tests

To add new test cases:

1. Edit `scripts/test-download-functionality.js`
2. Add new test cases to the `testCases` object
3. Define expected content patterns for each format
4. Add setup and teardown functions if needed

Example:

```javascript
testCases: {
  // Existing test cases...
  
  // New test case
  customFormat: {
    description: 'Custom format download',
    setup: () => {
      // Setup code here
    },
    teardown: () => {
      // Teardown code here
    },
    expectedContent: {
      pdf: ['expected', 'patterns', 'in', 'pdf'],
      markdown: ['expected', 'patterns', 'in', 'markdown'],
      text: ['expected', 'patterns', 'in', 'text']
    }
  }
}
```
