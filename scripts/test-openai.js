/**
 * Test OpenAI Script
 * 
 * This script tests the OpenAI integration by analyzing the extracted content
 * and comparing it with the stored analyzed content.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the OpenAI service
const { analyzeResumeContent } = require('./openai-pdf-analyzer');

async function testOpenAI() {
  try {
    console.log('🧠 Testing OpenAI integration...');
    
    // Check if OpenAI API key is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('❌ OpenAI API key is not available');
      console.log('💡 Make sure you have set the OPENAI_API_KEY environment variable');
      process.exit(1);
    }
    
    // Read the extracted text content
    const textPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.txt');
    
    if (!fs.existsSync(textPath)) {
      console.error(`❌ Extracted text file not found at ${textPath}`);
      process.exit(1);
    }
    
    const rawText = fs.readFileSync(textPath, 'utf8');
    console.log(`📄 Read ${rawText.length} characters from extracted text`);
    
    // Analyze the content
    console.log('🧠 Analyzing content with OpenAI...');
    console.time('OpenAI analysis');
    const result = await analyzeResumeContent(rawText);
    console.timeEnd('OpenAI analysis');
    
    // Check if we got a valid result
    if (result && result.structuredContent && result.structuredContent.name) {
      console.log('✅ OpenAI analysis successful!');
      console.log('📄 Name detected:', result.structuredContent.name);
      console.log('📄 Sections:', Object.keys(result.sections).join(', '));
      console.log('📄 Structured sections:', Object.keys(result.structuredContent).join(', '));
      
      // Compare with stored analyzed content
      const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
      
      if (fs.existsSync(analyzedPath)) {
        const storedContent = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));
        
        console.log('\n📊 Comparison with stored content:');
        console.log('📄 Stored name:', storedContent.structuredContent.name);
        console.log('📄 Stored sections:', Object.keys(storedContent.sections).join(', '));
        console.log('📄 Stored structured sections:', Object.keys(storedContent.structuredContent).join(', '));
        
        // Check if the names match
        console.log('\n🔍 Name match:', result.structuredContent.name === storedContent.structuredContent.name ? '✅ Yes' : '❌ No');
        
        // Check if the sections match
        const resultSections = Object.keys(result.sections).sort().join(',');
        const storedSections = Object.keys(storedContent.sections).sort().join(',');
        console.log('🔍 Sections match:', resultSections === storedSections ? '✅ Yes' : '❌ No');
        
        // Check if the structured sections match
        const resultStructuredSections = Object.keys(result.structuredContent).sort().join(',');
        const storedStructuredSections = Object.keys(storedContent.structuredContent).sort().join(',');
        console.log('🔍 Structured sections match:', resultStructuredSections === storedStructuredSections ? '✅ Yes' : '❌ No');
      } else {
        console.log('\n⚠️ No stored analyzed content found for comparison');
      }
      
      // Save the result to a temporary file for inspection
      const tempPath = path.join(process.cwd(), 'temp-openai-result.json');
      fs.writeFileSync(tempPath, JSON.stringify(result, null, 2));
      console.log(`\n📄 Result saved to ${tempPath} for inspection`);
      
      process.exit(0);
    } else {
      console.error('❌ OpenAI analysis failed or returned invalid data');
      console.error('Result:', result);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing OpenAI:', error);
    process.exit(1);
  }
}

// Run the test
testOpenAI();
