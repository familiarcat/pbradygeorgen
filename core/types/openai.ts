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
