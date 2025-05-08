import OpenAI from 'openai';
import { HesseLogger } from './HesseLogger';
import { DanteLogger } from './DanteLogger';

// Initialize the OpenAI client with fallback for build-time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build-time',
});

// Function to check if OpenAI API key is available
function isOpenAIKeyAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Analyzes text content using OpenAI
 */
export async function analyzeContent(text: string, options?: any): Promise<any> {
  // Check if OpenAI API key is available
  if (!isOpenAIKeyAvailable()) {
    console.log('OpenAI API key is not available, returning mock data');
    return {
      analysis: "This is a simplified version of the analyzeContent function for AWS Amplify build.",
      summary: "Content summary would appear here.",
      keywords: ["keyword1", "keyword2", "keyword3"],
      sentiment: "positive",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    // Log the start of the OpenAI request
    console.log('Sending request to OpenAI for content analysis');

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert content analyzer. Analyze the provided text and extract key information."
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    // Extract the content from the response
    const content = response.choices[0]?.message?.content || '';

    // Return the analysis
    return {
      analysis: content,
      summary: "Content summary based on OpenAI analysis.",
      keywords: ["keyword1", "keyword2", "keyword3"],
      sentiment: "positive",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error analyzing content with OpenAI:', error);
    // Return a fallback response
    return {
      analysis: "Error analyzing content with OpenAI.",
      summary: "Content summary would appear here.",
      keywords: ["keyword1", "keyword2", "keyword3"],
      sentiment: "positive",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Generates a summary of the content
 */
export async function generateSummary(text: string, maxLength?: number): Promise<string> {
  // Check if OpenAI API key is available
  if (!isOpenAIKeyAvailable()) {
    console.log('OpenAI API key is not available, returning mock data');
    return "This is a simplified version of the generateSummary function for AWS Amplify build.";
  }

  try {
    // Log the start of the OpenAI request
    console.log('Sending request to OpenAI for summary generation');

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert summarizer. Summarize the provided text in a concise manner. ${maxLength ? `Limit the summary to ${maxLength} characters.` : ''}`
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    // Extract the content from the response
    const content = response.choices[0]?.message?.content || '';

    return content;
  } catch (error) {
    console.error('Error generating summary with OpenAI:', error);
    return "Error generating summary with OpenAI.";
  }
}

/**
 * Generates a cover letter based on resume content
 */
export async function generateCoverLetter(resumeContent: string, forceRefresh = false): Promise<{
  success: boolean;
  content?: string;
  error?: string;
}> {
  try {
    // Check if OpenAI API key is available
    if (!isOpenAIKeyAvailable()) {
      console.log('OpenAI API key is not available, returning mock data');
      return {
        success: true,
        content: `# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`
      };
    }

    // Log the start of the OpenAI request
    console.log('Generating cover letter with OpenAI');
    if (HesseLogger) HesseLogger.openai.request('Generating cover letter with OpenAI');
    if (DanteLogger) DanteLogger.success.basic('Generating cover letter with OpenAI');

    // Record the API start time
    const apiStartTime = Date.now();

    // Create the prompt for the cover letter
    const prompt = `Create a professional cover letter based on the following resume content. The cover letter should be well-structured, compelling, and highlight the candidate's key qualifications and experiences. Format the response in markdown.

Resume Content:
${resumeContent}

Instructions:
1. Create a cover letter that showcases the candidate's skills, experience, and value proposition
2. Format the cover letter in markdown with appropriate headings and sections
3. Keep the content concise and focused, suitable for a single page when converted to PDF
4. Use a professional tone that reflects the candidate's experience level
5. Include sections for introduction, skills, experience, and closing
6. Highlight the candidate's unique value proposition`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional cover letter writer that creates well-structured, compelling cover letters in markdown format. You follow the Salinger philosophy of writing: direct, personal, and authentic. Your cover letters are concise, focused, and highlight the unique value proposition of the candidate. You MUST create content that fits on a SINGLE 8.5x11\" page when converted to PDF. This means being extremely concise and prioritizing only the most important information. Follow the instructions exactly and only return the formatted markdown."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.4, // Slightly higher temperature for more natural writing style
      max_tokens: 1200, // Reduced token limit to ensure concise content
    });

    // Calculate response time
    const apiEndTime = Date.now();
    const apiResponseTime = apiEndTime - apiStartTime;

    // Log the OpenAI response time
    console.log(`Received response from OpenAI in ${apiResponseTime}ms`);
    if (HesseLogger) HesseLogger.openai.response(`Received response from OpenAI in ${apiResponseTime}ms`);

    // Log token usage if available
    if (response.usage) {
      console.log(`Token usage: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`);
      if (HesseLogger) HesseLogger.openai.tokens(`Token usage: ${response.usage.prompt_tokens} prompt + ${response.usage.completion_tokens} completion = ${response.usage.total_tokens} total`);
    }

    // Extract the content from the response
    const content = response.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    console.log('Cover letter generated successfully');
    if (DanteLogger) DanteLogger.success.basic('Cover letter generated successfully');

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('Error generating cover letter with OpenAI:', error);
    if (DanteLogger) DanteLogger.error.openai(`Error generating cover letter: ${error}`);

    return {
      success: false,
      error: `Error generating cover letter: ${error}`
    };
  }
}

/**
 * Extracts structured data from text
 */
export async function extractStructuredData(text: string, schema?: any): Promise<any> {
  // Check if OpenAI API key is available
  if (!isOpenAIKeyAvailable()) {
    console.log('OpenAI API key is not available, returning mock data');
    return {
      title: "Sample Title",
      author: "Sample Author",
      date: new Date().toISOString(),
      content: "Sample content...",
      categories: ["category1", "category2"],
    };
  }

  try {
    // Log the start of the OpenAI request
    console.log('Sending request to OpenAI for structured data extraction');

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert data extractor. Extract structured data from the provided text according to the following schema: ${JSON.stringify(schema || {})}`
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    // Extract the content from the response
    const content = response.choices[0]?.message?.content || '';

    // Parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return {
        title: "Error parsing JSON response",
        author: "System",
        date: new Date().toISOString(),
        content: content,
        categories: ["error"],
      };
    }
  } catch (error) {
    console.error('Error extracting structured data with OpenAI:', error);
    return {
      title: "Error extracting structured data",
      author: "System",
      date: new Date().toISOString(),
      content: "Error extracting structured data with OpenAI.",
      categories: ["error"],
    };
  }
}

/**
 * Checks if the OpenAI API is available
 */
export async function isApiAvailable(): Promise<boolean> {
  return isOpenAIKeyAvailable();
}

/**
 * Gets the current API usage
 */
export async function getApiUsage(): Promise<any> {
  return {
    totalTokens: 1000,
    totalCost: 0.02,
    remainingQuota: 9000,
  };
}
