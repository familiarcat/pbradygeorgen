#!/usr/bin/env node

/**
 * Simple OpenAI Connection Test
 * 
 * This script tests the connection to the OpenAI API using a direct fetch call
 * to verify that the API key and model are working correctly.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ OpenAI API key not found in environment variables');
  process.exit(1);
}

console.log('✅ OpenAI API key found');
console.log(`API key format check: ${OPENAI_API_KEY.substring(0, 3)}...`);

// Test the OpenAI API connection
async function testOpenAIConnection() {
  console.log('🔄 Testing OpenAI API connection...');
  
  try {
    // Make a simple API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello, this is a test of the OpenAI API connection. Please respond with "Connection successful."'
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error: ${response.status} ${errorText}`);
      process.exit(1);
    }
    
    // Parse the response
    const responseData = await response.json();
    
    // Extract the content from the response
    const content = responseData.choices[0].message.content;
    
    // Log the response
    console.log('✅ Received response from OpenAI API');
    console.log(`Response: ${content}`);
    
    // Test passed
    console.log('✅ OpenAI connection test passed');
    process.exit(0);
  } catch (error) {
    console.error(`❌ OpenAI connection test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testOpenAIConnection();
