import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';

type SummaryResponse = {
  success: boolean;
  summary?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SummaryResponse>
) {
  try {
    // Path to the AI analysis file
    const aiAnalysisPath = path.join(process.cwd(), 'public', 'extracted', 'ai_analysis.md');
    
    // Check if the file exists
    if (!fs.existsSync(aiAnalysisPath)) {
      DanteLogger.error.api('Summary file not found');
      return res.status(404).json({ 
        success: false, 
        error: 'Summary file not found' 
      });
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(aiAnalysisPath, 'utf8');
    
    // Format the summary content
    const formattedSummary = formatSummary(fileContent);
    
    DanteLogger.success.api('Summary loaded successfully');
    
    // Return the summary content
    return res.status(200).json({
      success: true,
      summary: formattedSummary
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    DanteLogger.error.api(`Error loading summary: ${errorMessage}`);
    
    return res.status(500).json({
      success: false,
      error: `Error loading summary: ${errorMessage}`
    });
  }
}

function formatSummary(content: string): string {
  // Remove any metadata or headers that might be present
  let formattedContent = content;
  
  // Add a title if not present
  if (!formattedContent.startsWith('# ')) {
    formattedContent = '# Resume Summary\n\n' + formattedContent;
  }
  
  // Ensure proper markdown formatting
  formattedContent = formattedContent
    // Ensure paragraphs have proper spacing
    .replace(/\n{3,}/g, '\n\n')
    // Add emphasis to key points
    .replace(/\b(skills|experience|education|projects|achievements)\b/gi, '**$1**');
  
  return formattedContent;
}
