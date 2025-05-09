#!/usr/bin/env node

/**
 * Test S3 Storage Manager
 *
 * This script tests the S3 Storage Manager functionality to ensure it works correctly
 * both locally and with AWS S3.
 *
 * Philosophical Framework:
 * - Hesse: Testing the harmonious patterns across different content types
 * - Salinger: Ensuring authentic representation by verifying content integrity
 * - Derrida: Deconstructing storage operations to verify each component
 * - Dante: Guiding content through its journey from creation to retrieval
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { S3StorageManager } = require('../utils/s3StorageManager.js');
require('dotenv').config();

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Test data
const testData = {
  text: 'This is a test text file created by the S3 Storage Manager test script.',
  markdown: '# Test Markdown\n\nThis is a **markdown** file created by the S3 Storage Manager test script.',
  html: '<!DOCTYPE html><html><head><title>Test HTML</title></head><body><h1>Test HTML</h1><p>This is an HTML file created by the S3 Storage Manager test script.</p></body></html>',
  json: {
    title: 'Test JSON',
    description: 'This is a JSON file created by the S3 Storage Manager test script.',
    timestamp: new Date().toISOString(),
    testArray: [1, 2, 3, 4, 5]
  }
};

// Test metadata
const testMetadata = {
  createdBy: 'test-s3-storage-manager.js',
  timestamp: new Date().toISOString(),
  testPurpose: 'Verify S3 Storage Manager functionality'
};

// Test content fingerprint (for testing purposes)
const testContentFingerprint = 'test-' + Date.now().toString(36);

/**
 * Main test function
 */
async function runTests() {
  console.log(`\n${colors.cyan}${colors.bright}🧪 TESTING S3 STORAGE MANAGER${colors.reset}`);
  console.log(`${colors.cyan}=============================`);

  // Get the S3 Storage Manager instance
  const s3Manager = S3StorageManager.getInstance();

  // Check if S3 is available
  const isS3Ready = s3Manager.isS3Ready();
  console.log(`${colors.yellow}S3 is ${isS3Ready ? 'available' : 'not available'} - ${isS3Ready ? 'using S3' : 'using local storage'}${colors.reset}`);

  // Run the tests
  try {
    // Test 1: Upload and download text
    await testTextOperations(s3Manager);

    // Test 2: Upload and download markdown
    await testMarkdownOperations(s3Manager);

    // Test 3: Upload and download HTML
    await testHtmlOperations(s3Manager);

    // Test 4: Upload and download JSON
    await testJsonOperations(s3Manager);

    // Test 5: Check if file exists
    await testFileExists(s3Manager);

    // Test 6: Test S3 key generation
    testKeyGeneration(s3Manager);

    console.log(`\n${colors.green}${colors.bright}✅ ALL TESTS COMPLETED SUCCESSFULLY${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ TEST FAILED: ${error.message}${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

/**
 * Test text operations
 */
async function testTextOperations(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}🔤 Testing Text Operations${colors.reset}`);

  // Generate the S3 key
  const s3Key = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'test.txt');

  // Upload text
  console.log(`Uploading text to ${s3Key}...`);
  const uploadResult = await s3Manager.uploadText(testData.text, s3Key, testMetadata);

  if (!uploadResult.success) {
    throw new Error(`Failed to upload text: ${uploadResult.message}`);
  }

  console.log(`${colors.green}✓ Text uploaded successfully${colors.reset}`);
  console.log(`  - S3 Key: ${uploadResult.s3Key}`);
  console.log(`  - Local Path: ${uploadResult.localPath || 'N/A'}`);
  console.log(`  - Content Fingerprint: ${uploadResult.contentFingerprint}`);

  // Download text
  console.log(`Downloading text from ${s3Key}...`);
  const downloadResult = await s3Manager.downloadText(s3Key);

  if (!downloadResult.success) {
    throw new Error(`Failed to download text: ${downloadResult.message}`);
  }

  console.log(`${colors.green}✓ Text downloaded successfully${colors.reset}`);
  console.log(`  - Content: ${downloadResult.content.substring(0, 50)}...`);
  console.log(`  - Metadata: ${JSON.stringify(downloadResult.metadata)}`);

  // Verify content integrity
  if (downloadResult.content !== testData.text) {
    throw new Error('Content integrity check failed: Downloaded content does not match uploaded content');
  }

  console.log(`${colors.green}✓ Content integrity verified${colors.reset}`);
}

/**
 * Test markdown operations
 */
async function testMarkdownOperations(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}📝 Testing Markdown Operations${colors.reset}`);

  // Generate the S3 key
  const s3Key = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'test.md');

  // Upload markdown
  console.log(`Uploading markdown to ${s3Key}...`);
  const uploadResult = await s3Manager.uploadMarkdown(testData.markdown, s3Key, testMetadata);

  if (!uploadResult.success) {
    throw new Error(`Failed to upload markdown: ${uploadResult.message}`);
  }

  console.log(`${colors.green}✓ Markdown uploaded successfully${colors.reset}`);

  // Download markdown
  console.log(`Downloading markdown from ${s3Key}...`);
  const downloadResult = await s3Manager.downloadText(s3Key);

  if (!downloadResult.success) {
    throw new Error(`Failed to download markdown: ${downloadResult.message}`);
  }

  console.log(`${colors.green}✓ Markdown downloaded successfully${colors.reset}`);

  // Verify content integrity
  if (downloadResult.content !== testData.markdown) {
    throw new Error('Content integrity check failed: Downloaded content does not match uploaded content');
  }

  console.log(`${colors.green}✓ Content integrity verified${colors.reset}`);
}

/**
 * Test HTML operations
 */
async function testHtmlOperations(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}🌐 Testing HTML Operations${colors.reset}`);

  // Generate the S3 key
  const s3Key = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'test.html');

  // Upload HTML
  console.log(`Uploading HTML to ${s3Key}...`);
  const uploadResult = await s3Manager.uploadHtml(testData.html, s3Key, testMetadata);

  if (!uploadResult.success) {
    throw new Error(`Failed to upload HTML: ${uploadResult.message}`);
  }

  console.log(`${colors.green}✓ HTML uploaded successfully${colors.reset}`);

  // Download HTML
  console.log(`Downloading HTML from ${s3Key}...`);
  const downloadResult = await s3Manager.downloadText(s3Key);

  if (!downloadResult.success) {
    throw new Error(`Failed to download HTML: ${downloadResult.message}`);
  }

  console.log(`${colors.green}✓ HTML downloaded successfully${colors.reset}`);

  // Verify content integrity
  if (downloadResult.content !== testData.html) {
    throw new Error('Content integrity check failed: Downloaded content does not match uploaded content');
  }

  console.log(`${colors.green}✓ Content integrity verified${colors.reset}`);
}

/**
 * Test JSON operations
 */
async function testJsonOperations(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}🔄 Testing JSON Operations${colors.reset}`);

  // Generate the S3 key
  const s3Key = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'test.json');

  // Upload JSON
  console.log(`Uploading JSON to ${s3Key}...`);
  const uploadResult = await s3Manager.uploadJson(testData.json, s3Key, testMetadata);

  if (!uploadResult.success) {
    throw new Error(`Failed to upload JSON: ${uploadResult.message}`);
  }

  console.log(`${colors.green}✓ JSON uploaded successfully${colors.reset}`);

  // Download JSON
  console.log(`Downloading JSON from ${s3Key}...`);
  const downloadResult = await s3Manager.downloadText(s3Key);

  if (!downloadResult.success) {
    throw new Error(`Failed to download JSON: ${downloadResult.message}`);
  }

  console.log(`${colors.green}✓ JSON downloaded successfully${colors.reset}`);

  // Parse the JSON
  const downloadedJson = JSON.parse(downloadResult.content);

  // Verify content integrity (compare key properties)
  if (downloadedJson.title !== testData.json.title ||
    downloadedJson.description !== testData.json.description ||
    !Array.isArray(downloadedJson.testArray) ||
    downloadedJson.testArray.length !== testData.json.testArray.length) {
    throw new Error('Content integrity check failed: Downloaded JSON does not match uploaded JSON');
  }

  console.log(`${colors.green}✓ Content integrity verified${colors.reset}`);
}

/**
 * Test file exists functionality
 */
async function testFileExists(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}🔍 Testing File Exists${colors.reset}`);

  // Generate the S3 keys
  const existingKey = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'test.txt');
  const nonExistingKey = s3Manager.getExtractedContentS3Key(testContentFingerprint, 'non-existing-file.txt');

  // Check if existing file exists
  console.log(`Checking if ${existingKey} exists...`);
  const existingResult = await s3Manager.fileExists(existingKey);

  if (!existingResult.success) {
    throw new Error(`Failed to check if file exists: ${existingResult.message}`);
  }

  if (!existingResult.exists) {
    throw new Error(`File should exist but doesn't: ${existingKey}`);
  }

  console.log(`${colors.green}✓ Existing file check passed${colors.reset}`);

  // Check if non-existing file exists
  console.log(`Checking if ${nonExistingKey} exists...`);
  const nonExistingResult = await s3Manager.fileExists(nonExistingKey);

  if (!nonExistingResult.success) {
    throw new Error(`Failed to check if file exists: ${nonExistingResult.message}`);
  }

  if (nonExistingResult.exists) {
    throw new Error(`File shouldn't exist but does: ${nonExistingKey}`);
  }

  console.log(`${colors.green}✓ Non-existing file check passed${colors.reset}`);
}

/**
 * Test S3 key generation
 */
function testKeyGeneration(s3Manager) {
  console.log(`\n${colors.magenta}${colors.bright}🔑 Testing S3 Key Generation${colors.reset}`);

  const contentFingerprint = 'test-fingerprint';

  // Test PDF key generation
  const pdfKey = s3Manager.getPdfS3Key(contentFingerprint);
  console.log(`PDF Key: ${pdfKey}`);

  // Test extracted content key generation
  const extractedKey = s3Manager.getExtractedContentS3Key(contentFingerprint, 'content.txt');
  console.log(`Extracted Content Key: ${extractedKey}`);

  // Test analyzed content key generation
  const analyzedKey = s3Manager.getAnalyzedContentS3Key(contentFingerprint, 'analysis.json');
  console.log(`Analyzed Content Key: ${analyzedKey}`);

  // Test cover letter key generation
  const coverLetterKey = s3Manager.getCoverLetterS3Key(contentFingerprint, 'cover_letter.md');
  console.log(`Cover Letter Key: ${coverLetterKey}`);

  // Test download key generation
  const downloadKey = s3Manager.getDownloadS3Key(contentFingerprint, 'resume.pdf');
  console.log(`Download Key: ${downloadKey}`);

  console.log(`${colors.green}✓ Key generation tests passed${colors.reset}`);
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}${colors.bright}❌ ERROR: ${error.message}${colors.reset}`);
  console.error(error);
  process.exit(1);
});
