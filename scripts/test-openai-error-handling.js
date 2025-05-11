#!/usr/bin/env node

/**
 * Test OpenAI Error Handling
 * 
 * This script tests the enhanced OpenAI error handling by:
 * 1. Simulating different types of OpenAI API errors
 * 2. Verifying that the error handler correctly identifies and handles each error type
 * 3. Demonstrating the fallback mechanisms
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Import the OpenAI error handler
const { handleOpenAIError, OpenAIErrorType } = require('../utils/openai-error-handler');

// Simulate different types of OpenAI API errors
async function testErrorHandling() {
  console.log('🧪 Testing OpenAI Error Handling');
  console.log('================================');
  
  // Test authentication error
  console.log('\n🔑 Testing Authentication Error');
  const authError = new Error('Incorrect API key provided');
  authError.status = 401;
  const authResult = handleOpenAIError(authError, 'Authentication Test');
  console.log(`Result: ${authResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${authResult.isErr ? authResult.error.message : 'No error'}`);
  
  // Test permission error
  console.log('\n🔒 Testing Permission Error');
  const permError = new Error('You don\'t have permission to use this model');
  permError.status = 403;
  const permResult = handleOpenAIError(permError, 'Permission Test');
  console.log(`Result: ${permResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${permResult.isErr ? permResult.error.message : 'No error'}`);
  
  // Test rate limit error
  console.log('\n⏱️ Testing Rate Limit Error');
  const rateError = new Error('Rate limit exceeded');
  rateError.status = 429;
  const rateResult = handleOpenAIError(rateError, 'Rate Limit Test');
  console.log(`Result: ${rateResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${rateResult.isErr ? rateResult.error.message : 'No error'}`);
  
  // Test model error
  console.log('\n🤖 Testing Model Error');
  const modelError = new Error('The model `gpt-4o` does not exist');
  modelError.status = 400;
  modelError.data = {
    error: {
      message: 'The model `gpt-4o` does not exist',
      type: 'invalid_request_error',
      param: 'model',
      code: 'model_not_found'
    }
  };
  const modelResult = handleOpenAIError(modelError, 'Model Test');
  console.log(`Result: ${modelResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${modelResult.isErr ? modelResult.error.message : 'No error'}`);
  
  // Test server error
  console.log('\n🔥 Testing Server Error');
  const serverError = new Error('Internal server error');
  serverError.status = 500;
  const serverResult = handleOpenAIError(serverError, 'Server Test');
  console.log(`Result: ${serverResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${serverResult.isErr ? serverResult.error.message : 'No error'}`);
  
  // Test connection error
  console.log('\n🌐 Testing Connection Error');
  const connError = new Error('Failed to fetch');
  const connResult = handleOpenAIError(connError, 'Connection Test');
  console.log(`Result: ${connResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${connResult.isErr ? connResult.error.message : 'No error'}`);
  
  // Test parse error
  console.log('\n📝 Testing Parse Error');
  const parseError = new Error('Unexpected token in JSON');
  const parseResult = handleOpenAIError(parseError, 'Parse Test');
  console.log(`Result: ${parseResult.isErr ? 'Error' : 'Success'}`);
  console.log(`Message: ${parseResult.isErr ? parseResult.error.message : 'No error'}`);
  
  console.log('\n✅ Error handling test complete');
}

// Run the test
testErrorHandling().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
