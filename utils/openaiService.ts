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
      You are an expert resume analyzer. Extract key information from the resume and provide a structured analysis.
      Your analysis should be in first person, as if the resume owner is speaking directly to the reader.
      Use a conversational, natural tone following J.D. Salinger's writing style.
    `;

    // Define the user message with the resume content
    const userMessage = `
      Analyze this resume content and provide a structured analysis including:
      - A summary (in first person)
      - Key skills
      - Years of experience (in first person)
      - Education level (in first person)
      - Career highlights (in first person)
      - Industry experience
      - Recommendations/career goals (in first person)

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
      temperature: 0.3, // Lower temperature for more consistent results
      response_format: { type: "json_object" },
    });

    // Parse the response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in the OpenAI response");
    }

    // Parse the JSON response
    const analysis = JSON.parse(content) as ResumeAnalysisResponse;
    return analysis;
  } catch (error) {
    console.error("Error analyzing resume with OpenAI:", error);
    throw error;
  }
}
