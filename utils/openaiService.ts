import OpenAI from 'openai';

// Initialize the OpenAI client
// In production, use environment variables for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Interface for the resume analysis request
 */
export interface ResumeAnalysisRequest {
  resumeContent: string;
}

/**
 * Interface for the resume analysis response
 */
export interface ResumeAnalysisResponse {
  summary: string;
  keySkills: string[];
  yearsOfExperience: string;
  educationLevel: string;
  careerHighlights: string[];
  industryExperience: string[];
  recommendations: string[];
}

/**
 * Analyzes resume content using OpenAI's GPT model
 * @param resumeContent The content of the resume to analyze
 * @returns Structured analysis of the resume
 */
export async function analyzeResume(resumeContent: string): Promise<ResumeAnalysisResponse> {
  try {
    // Define the system message to set the context for the AI
    const systemMessage = `
      You are an expert resume analyzer with deep knowledge of the tech industry, particularly software development and design.

      Your task is to extract key information from the resume and provide a structured analysis that captures the essence of the candidate's experience, skills, and career trajectory.

      Your analysis should be written in first person, as if the resume owner is speaking directly to the reader.
      Use a conversational, natural tone following J.D. Salinger's writing style - authentic, direct, and slightly introspective.

      Focus on these aspects:
      1. Technical skills and expertise (programming languages, frameworks, tools)
      2. Creative abilities (design, UI/UX, illustration)
      3. Professional experience and accomplishments
      4. Educational background
      5. Industries worked in
      6. Career aspirations and strengths

      IMPORTANT: Your response must be a valid JSON object with EXACTLY these fields and no others:
      - summary: A string with a first-person summary that captures the essence of the candidate's professional identity (100-150 words)
      - keySkills: An array of strings listing 6-8 core technical and creative skills
      - yearsOfExperience: A string describing experience in first person, including total years and key roles
      - educationLevel: A string describing education in first person, including degrees and institutions
      - careerHighlights: An array of 3-4 strings with career highlights in first person, focusing on major accomplishments
      - industryExperience: An array of strings listing industries the candidate has worked in
      - recommendations: An array of 3 strings with career goals/recommendations in first person, reflecting the candidate's aspirations

      Do not include any additional fields or metadata in your response.
      Ensure all text is properly formatted and free of markdown or special characters.
    `;

    // Define the user message with the resume content
    const userMessage = `
      Analyze this resume content and provide a structured analysis in JSON format.

      Pay special attention to:
      - The candidate's blend of technical and creative skills
      - Their experience with React, AWS, and enterprise applications
      - Their work across different industries (like Cox Communications, Bayer, etc.)
      - Their educational background in both design and philosophy
      - Their career progression and leadership roles

      Remember to write in first person as if the candidate is speaking, using J.D. Salinger's conversational style.
      Focus on creating a narrative that shows the candidate's unique blend of technical expertise and creative abilities.

      For the recommendations section, suggest career directions that would leverage both their technical and creative strengths.

      Resume content:
      ${resumeContent}
    `;

    // Define the expected response format
    const responseFormat = {
      summary: "A first-person summary of the candidate's background and expertise",
      keySkills: ["Skill 1", "Skill 2", "Skill 3"],
      yearsOfExperience: "First-person statement about years of experience",
      educationLevel: "First-person statement about education",
      careerHighlights: ["Highlight 1", "Highlight 2", "Highlight 3"],
      industryExperience: ["Industry 1", "Industry 2", "Industry 3"],
      recommendations: ["Career goal/recommendation 1", "Career goal/recommendation 2", "Career goal/recommendation 3"]
    };

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4, // Balanced temperature for creativity while maintaining consistency
      response_format: { type: "json_object" },
      max_tokens: 1500, // Ensure we have enough tokens for a detailed response
      top_p: 0.95, // Slightly more diverse responses
      presence_penalty: 0.1, // Slight penalty for repetition
      frequency_penalty: 0.1, // Slight penalty for frequent tokens
    });

    // Parse the response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in the OpenAI response");
    }

    console.log('Raw OpenAI response content:', content);

    // Parse the JSON response
    try {
      const analysis = JSON.parse(content) as ResumeAnalysisResponse;

      // Validate the response structure
      if (!analysis.summary || !analysis.keySkills || !analysis.yearsOfExperience) {
        console.error('Invalid response structure:', analysis);
        throw new Error('Invalid response structure from OpenAI');
      }

      // Perform additional validation
      const validationIssues = [];

      if (analysis.summary.length < 50) validationIssues.push('Summary too short');
      if (analysis.keySkills.length < 3) validationIssues.push('Too few skills');
      if (analysis.careerHighlights.length < 2) validationIssues.push('Too few career highlights');
      if (analysis.recommendations.length < 2) validationIssues.push('Too few recommendations');

      // Check for non-first-person language
      const thirdPersonPatterns = [
        /\bhe\b/i, /\bshe\b/i, /\bhis\b/i, /\bher\b/i,
        /\bthe candidate\b/i, /\bthe applicant\b/i,
        /\bthey have\b/i, /\bthey are\b/i
      ];

      const hasThirdPerson = thirdPersonPatterns.some(pattern =>
        pattern.test(analysis.summary) ||
        pattern.test(analysis.yearsOfExperience) ||
        pattern.test(analysis.educationLevel) ||
        analysis.careerHighlights.some(h => pattern.test(h)) ||
        analysis.recommendations.some(r => pattern.test(r))
      );

      if (hasThirdPerson) validationIssues.push('Contains third-person language');

      if (validationIssues.length > 0) {
        console.warn('Response validation issues:', validationIssues);
      }

      // Log the parsed analysis
      console.log('Parsed analysis:', {
        summary: analysis.summary.substring(0, 75) + '...',
        keySkills: `${analysis.keySkills.length} skills: ${analysis.keySkills.join(', ')}`,
        yearsOfExperience: analysis.yearsOfExperience.substring(0, 50) + '...',
        educationLevel: analysis.educationLevel.substring(0, 50) + '...',
        careerHighlights: `${analysis.careerHighlights.length} highlights`,
        industryExperience: analysis.industryExperience.join(', '),
        recommendations: `${analysis.recommendations.length} recommendations`
      });

      return analysis;
    } catch (error) {
      const parseError = error as Error;
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content that failed to parse:', content);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error analyzing resume with OpenAI:", error);
    throw error;
  }
}
