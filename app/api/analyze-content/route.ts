import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // This is a mock analysis for demonstration purposes
    // In a real application, you would use an AI API like OpenAI or a custom ML model
    const analysis = analyzeContent(content);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

function analyzeContent(content: string) {
  // Simple keyword-based analysis
  const lowerContent = content.toLowerCase();
  
  // Extract skills
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node', 'html', 'css', 'aws', 
    'python', 'java', 'c#', 'angular', 'vue', 'sql', 'nosql', 'mongodb',
    'docker', 'kubernetes', 'ci/cd', 'agile', 'scrum', 'leadership',
    'management', 'communication', 'problem-solving', 'analytics', 'design',
    'ui/ux', 'mobile', 'web', 'cloud', 'security', 'testing', 'devops'
  ];
  
  const keySkills = skillKeywords
    .filter(skill => lowerContent.includes(skill))
    .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));
  
  // Extract industry experience
  const industryKeywords = [
    'healthcare', 'finance', 'banking', 'insurance', 'technology', 'retail',
    'e-commerce', 'education', 'government', 'manufacturing', 'automotive',
    'energy', 'telecommunications', 'media', 'entertainment', 'consulting',
    'non-profit', 'real estate', 'transportation', 'logistics', 'hospitality'
  ];
  
  const industryExperience = industryKeywords
    .filter(industry => lowerContent.includes(industry))
    .map(industry => industry.charAt(0).toUpperCase() + industry.slice(1));
  
  // Extract years of experience
  let yearsOfExperience = 'Not specified';
  const yearsMatch = content.match(/(\d+)(?:\+)?\s+years?(?:\s+of)?\s+experience/i);
  if (yearsMatch) {
    yearsOfExperience = `${yearsMatch[1]}+ years of professional experience`;
  }
  
  // Extract education level
  let educationLevel = 'Not specified';
  if (lowerContent.includes('phd') || lowerContent.includes('doctorate')) {
    educationLevel = 'PhD / Doctorate';
  } else if (lowerContent.includes('master') || lowerContent.includes('mba') || lowerContent.includes('ms ')) {
    educationLevel = 'Master\'s Degree';
  } else if (lowerContent.includes('bachelor') || lowerContent.includes('bs ') || lowerContent.includes('ba ')) {
    educationLevel = 'Bachelor\'s Degree';
  } else if (lowerContent.includes('associate')) {
    educationLevel = 'Associate\'s Degree';
  }
  
  // Extract career highlights
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const highlightKeywords = [
    'led', 'developed', 'created', 'implemented', 'managed', 'designed',
    'architected', 'improved', 'increased', 'reduced', 'achieved', 'awarded',
    'recognized', 'published', 'presented', 'launched', 'spearheaded'
  ];
  
  const careerHighlights = sentences
    .filter(sentence => 
      highlightKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      ) && sentence.length > 30
    )
    .map(sentence => sentence.trim())
    .slice(0, 5);
  
  // Generate recommendations
  const recommendations = [];
  
  if (keySkills.length < 5) {
    recommendations.push('Consider highlighting more specific technical skills in your resume');
  }
  
  if (!lowerContent.includes('github') && !lowerContent.includes('portfolio')) {
    recommendations.push('Add links to your GitHub profile or portfolio to showcase your work');
  }
  
  if (!lowerContent.includes('certification')) {
    recommendations.push('Consider adding relevant certifications to strengthen your credentials');
  }
  
  if (careerHighlights.length < 3) {
    recommendations.push('Include more quantifiable achievements and results in your experience descriptions');
  }
  
  if (!lowerContent.includes('volunteer') && !lowerContent.includes('community')) {
    recommendations.push('Consider adding volunteer work or community involvement to show well-roundedness');
  }
  
  // Generate summary
  const summary = `This resume appears to be for a ${
    keySkills.includes('Management') ? 'senior-level professional' : 'professional'
  } with expertise in ${
    keySkills.slice(0, 3).join(', ')
  }${
    industryExperience.length > 0 ? ` and experience in the ${industryExperience.join(', ')} ${industryExperience.length > 1 ? 'industries' : 'industry'}` : ''
  }. ${yearsOfExperience !== 'Not specified' ? yearsOfExperience + '.' : ''} ${
    educationLevel !== 'Not specified' ? `Education includes a ${educationLevel}.` : ''
  }`;
  
  return {
    summary,
    keySkills: keySkills.length > 0 ? keySkills : ['Not specified'],
    industryExperience: industryExperience.length > 0 ? industryExperience : ['Not specified'],
    careerHighlights: careerHighlights.length > 0 ? careerHighlights : ['Not specified'],
    yearsOfExperience,
    educationLevel,
    recommendations: recommendations.length > 0 ? recommendations : ['Resume appears comprehensive']
  };
}
