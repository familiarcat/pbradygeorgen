/**
 * ContentFormatter - Server Component
 * 
 * This component handles OpenAI formatting on the server side.
 * It uses React's cache function to deduplicate requests and
 * integrates with the existing caching mechanism.
 */

import { cache } from 'react';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { HesseLogger } from '@/utils/HesseLogger';
import { dynamicStringCache } from '@/utils/dynamicCacheService';
import { ContentStateService } from '@/utils/ContentStateService';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache the formatting function to deduplicate requests
export const getFormattedContent = cache(async (
  content: string, 
  contentType: string, 
  format: 'markdown' | 'text'
): Promise<{
  success: boolean;
  data: string;
  error?: string;
}> => {
  try {
    HesseLogger.summary.start(`Formatting content as ${format}`);
    
    // Get the content state service
    const contentStateService = ContentStateService.getInstance();
    
    // Check if the content is fresh
    const pdfPath = path.join(process.cwd(), 'public', 'default_resume.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const currentFingerprint = ContentStateService.generateContentFingerprint(pdfBuffer);
    const storedFingerprint = contentStateService.getFingerprint();
    
    // Generate a cache key based on the content and format
    const cacheKey = dynamicStringCache.generateCacheKey(`${content}_${format}_${contentType}`);
    
    // Check if we need to refresh the cache
    const forceRefresh = currentFingerprint !== storedFingerprint;
    
    if (forceRefresh) {
      HesseLogger.cache.invalidate(`PDF content has changed, clearing cache`);
      dynamicStringCache.clearCache();
    } else {
      // Check if we have a cached response
      const cachedResponse = dynamicStringCache.getItem(cacheKey);
      if (cachedResponse) {
        HesseLogger.cache.hit(`Using cached formatted content for key: ${cacheKey.substring(0, 8)}...`);
        return {
          success: true,
          data: cachedResponse
        };
      }
      HesseLogger.cache.miss(`Cache miss for key: ${cacheKey.substring(0, 8)}...`);
    }
    
    // Create a prompt based on the content type
    let systemPrompt = `You are a document formatting expert. Format the provided content as clean, professional ${format}.`;
    
    // Add specific formatting instructions based on content type
    if (contentType === 'resume' || contentType === 'cv') {
      systemPrompt += `
      This is a RESUME. Format it with proper structure, including:
      - Clear section headers
      - Consistent formatting for dates and positions
      - Bullet points for achievements and responsibilities
      - Proper spacing between sections`;
    } else if (contentType === 'cover_letter') {
      systemPrompt += `
      This is a COVER LETTER. Format it with proper structure, including:
      - Professional greeting
      - Clear introduction, body, and conclusion
      - Proper paragraph spacing
      - Professional closing`;
    }
    
    // Check if we have ChatGPT-analyzed content
    const analyzedContentPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');
    if (fs.existsSync(analyzedContentPath)) {
      try {
        // Read the analyzed content
        const analyzedContent = JSON.parse(fs.readFileSync(analyzedContentPath, 'utf8'));
        
        // Use the analyzed content to create a better prompt
        if (analyzedContent.structuredContent) {
          systemPrompt += `
          The content has the following structure:
          ${JSON.stringify(analyzedContent.structuredContent, null, 2)}
          
          Use this structure to guide your formatting.`;
        }
      } catch (analyzeError) {
        console.error('Error using ChatGPT-analyzed content:', analyzeError);
        // Continue with default formatting
      }
    }
    
    // Start timing the request
    const apiStartTime = Date.now();
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please format this content as ${format}:\n\n${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });
    
    // Calculate response time
    const apiEndTime = Date.now();
    const apiResponseTime = apiEndTime - apiStartTime;
    
    // Log the OpenAI response time
    HesseLogger.openai.response(`Received response from OpenAI in ${apiResponseTime}ms`);
    
    // Get the formatted content
    const formattedContent = response.choices[0]?.message?.content || content;
    
    // Store the response in the dynamic string cache
    dynamicStringCache.setItem(cacheKey, formattedContent);
    HesseLogger.cache.update(`Stored formatted content with key: ${cacheKey.substring(0, 8)}...`);
    
    // Log success
    HesseLogger.summary.complete(`Successfully formatted content as ${format}`);
    
    return {
      success: true,
      data: formattedContent
    };
  } catch (error) {
    console.error(`Error formatting content as ${format}:`, error);
    HesseLogger.summary.error(`Error formatting content as ${format}: ${error instanceof Error ? error.message : String(error)}`);
    
    // Return original content if formatting fails
    return {
      success: false,
      data: content || '',
      error: `Failed to format content as ${format}`
    };
  }
});

// Server Component for formatting content
export default async function ContentFormatter({
  content,
  contentType,
  format
}: {
  content: string;
  contentType: string;
  format: 'markdown' | 'text';
}) {
  const result = await getFormattedContent(content, contentType, format);
  
  if (!result.success) {
    return (
      <div className="text-red-500">
        Error formatting content: {result.error}
      </div>
    );
  }
  
  return (
    <div className="formatted-content">
      {format === 'markdown' ? (
        <div className="markdown-content">{result.data}</div>
      ) : (
        <pre className="text-content">{result.data}</pre>
      )}
    </div>
  );
}
