#!/usr/bin/env node

/**
 * Test OpenAI Connection
 * 
 * This script tests the connection to the OpenAI API by:
 * 1. Checking if the OpenAI API key is available
 * 2. Making a simple API call to verify connectivity
 * 3. Validating the response format
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/UnifiedLogger');

// Import the OpenAI service
let openaiService;
try {
  openaiService = require('../utils/openaiService');
} catch (error) {
  try {
    openaiService = require('../src/api/openai/openaiService');
  } catch (innerError) {
    logger.error.system(`Failed to import OpenAI service: ${innerError.message}`);
    process.exit(1);
  }
}

// Check if the OpenAI API key is available
function checkOpenAIApiKey() {
  logger.summary.start('Checking OpenAI API key');
  
  // Check environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    logger.warning.security('OPENAI_API_KEY environment variable not found');
    
    // Check .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/OPENAI_API_KEY=([^\n]+)/);
      
      if (match && match[1]) {
        logger.success.security('Found OpenAI API key in .env.local file');
        process.env.OPENAI_API_KEY = match[1];
        return true;
      }
    }
    
    // Check .env file
    const defaultEnvPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(defaultEnvPath)) {
      const envContent = fs.readFileSync(defaultEnvPath, 'utf8');
      const match = envContent.match(/OPENAI_API_KEY=([^\n]+)/);
      
      if (match && match[1]) {
        logger.success.security('Found OpenAI API key in .env file');
        process.env.OPENAI_API_KEY = match[1];
        return true;
      }
    }
    
    logger.error.security('OpenAI API key not found in environment variables or .env files');
    return false;
  }
  
  logger.success.security('OpenAI API key found in environment variables');
  return true;
}

// Test the OpenAI API connection
async function testOpenAIConnection() {
  logger.summary.start('Testing OpenAI API connection');
  
  try {
    // Check if the API key is available
    if (!checkOpenAIApiKey()) {
      logger.error.security('Cannot proceed with OpenAI connection test without API key');
      process.exit(1);
    }
    
    // Make a simple API call
    logger.summary.progress('Making a simple API call to OpenAI');
    
    const prompt = 'Hello, this is a test of the OpenAI API connection. Please respond with "Connection successful."';
    
    const response = await openaiService.generateCompletion(prompt, {
      max_tokens: 50,
      temperature: 0.7
    });
    
    // Check if the response is valid
    if (!response || !response.data) {
      logger.error.dataFlow('OpenAI API call failed: Invalid response');
      process.exit(1);
    }
    
    // Log the response
    logger.summary.progress('Received response from OpenAI API');
    logger.summary.progress(`Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    
    // Check if the response contains the expected content
    const responseText = response.data.choices[0].message.content;
    
    if (!responseText.includes('Connection successful')) {
      logger.warning.dataFlow('OpenAI response does not contain expected content');
      logger.warning.dataFlow(`Response: ${responseText}`);
    }
    
    // Test passed
    logger.success.perfection('OpenAI connection test passed');
    process.exit(0);
  } catch (error) {
    logger.error.runtime(`OpenAI connection test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testOpenAIConnection();
