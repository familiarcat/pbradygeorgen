/**
 * OpenAI prompt for resume analysis
 * 
 * This module provides the prompt for analyzing resumes with OpenAI.
 * It follows the Hesse philosophy of mathematical precision and the
 * Kantian ethics of professional business orientation.
 */

/**
 * Generate a prompt for resume analysis
 * 
 * @param {string} resumeText - The text content of the resume
 * @param {Object} basicInfo - Basic information extracted from the resume
 * @returns {string} - The prompt for OpenAI
 */
function generateResumeAnalysisPrompt(resumeText, basicInfo = {}) {
  return `
You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of resume parsing and optimization. Your task is to analyze the following resume text and extract structured information.

RESUME TEXT:
\`\`\`
${resumeText}
\`\`\`

BASIC INFORMATION ALREADY EXTRACTED:
\`\`\`json
${JSON.stringify(basicInfo, null, 2)}
\`\`\`

Please analyze this resume carefully and provide the following information in a structured JSON format:

1. Personal Information:
   - Full name (correctly identifying the person's name, not company names or titles)
   - First name
   - Last name
   - Email address
   - Phone number
   - Location/address
   - LinkedIn profile (if present)
   - Personal website (if present)

2. Professional Summary:
   - Current or most recent job title
   - Years of experience (total)
   - Industry specialization
   - Career level (entry, mid, senior, executive)
   - A brief professional summary (2-3 sentences)

3. Skills:
   - Technical skills (list of specific technical skills)
   - Soft skills (list of specific soft skills)
   - Languages (programming and human languages)
   - Tools and technologies (specific tools, software, platforms)
   - Certifications (list of professional certifications)

4. Experience:
   - List of work experiences with:
     - Company name
     - Job title
     - Start date (MM/YYYY format if possible)
     - End date (MM/YYYY format or "Present")
     - Key responsibilities (bullet points)
     - Achievements (bullet points with metrics if available)

5. Education:
   - List of educational experiences with:
     - Institution name
     - Degree
     - Field of study
     - Graduation year
     - GPA (if mentioned)
     - Honors/Awards

6. ATS Keywords:
   - List of 15-20 most relevant keywords for ATS optimization
   - Industry-specific terms that would be valuable for ATS matching

7. File Naming:
   - A suggested file prefix based on the person's name (lowercase, no spaces)
   - Suggested resume filename (prefix_resume)
   - Suggested introduction filename (prefix_introduction)

8. Additional Information:
   - Volunteer work
   - Projects
   - Publications
   - Patents
   - Awards
   - Professional affiliations

IMPORTANT GUIDELINES:
- Focus on accuracy over completeness - if information is not clearly present, don't invent it
- Pay special attention to correctly identifying the person's name (not mistaking company names or titles for person names)
- For skills, focus on extracting specific technologies, tools, and methodologies
- Extract dates in a consistent format when possible
- Identify industry-specific keywords that would be valuable for ATS matching
- If the basic information already extracted contains errors, please correct them

Return ONLY a JSON object with no additional text or explanation. The JSON should follow this structure:
{
  "name": "Full Name",
  "firstName": "First",
  "lastName": "Last",
  "fullName": "Full Name",
  "email": "email@example.com",
  "phone": "123-456-7890",
  "location": "City, State",
  "linkedin": "linkedin.com/in/username",
  "website": "example.com",
  "title": "Current Job Title",
  "yearsOfExperience": 5,
  "industry": "Technology",
  "careerLevel": "Senior",
  "summary": "Brief professional summary",
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Skill 1", "Skill 2"],
    "languages": ["Language 1", "Language 2"],
    "tools": ["Tool 1", "Tool 2"],
    "certifications": ["Cert 1", "Cert 2"]
  },
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "graduationYear": "YYYY",
      "gpa": "4.0",
      "honors": ["Honor 1", "Honor 2"]
    }
  ],
  "keywords": ["Keyword 1", "Keyword 2"],
  "filePrefix": "firstname-lastname",
  "resumeFileName": "firstname-lastname_resume",
  "introductionFileName": "firstname-lastname_introduction",
  "additional": {
    "volunteer": ["Item 1", "Item 2"],
    "projects": ["Project 1", "Project 2"],
    "publications": ["Publication 1", "Publication 2"],
    "patents": ["Patent 1", "Patent 2"],
    "awards": ["Award 1", "Award 2"],
    "affiliations": ["Affiliation 1", "Affiliation 2"]
  }
}
`;
}

module.exports = {
  generateResumeAnalysisPrompt
};
