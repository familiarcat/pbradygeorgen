import { NextRequest, NextResponse } from 'next/server';
import { ContentStateService } from '@/utils/ContentStateService';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import path from 'path';
import fs from 'fs';
import { AmplifyStorageService } from '@/utils/amplifyStorageService';
import { getCoverLetterFromAmplify, processPdfWithAmplify } from '@/utils/amplifyGenPdfProcessor';

/**
 * API route to get the Cover Letter content
 *
 * This endpoint handles the generation of Cover Letter content,
 * ensuring it uses the latest PDF content and properly formats it.
 * It's been updated to work with AWS Amplify deployment using S3 storage.
 *
 * Philosophical Framework:
 * - Hesse: Balancing structure (API response) with flexibility (dynamic generation)
 * - Salinger: Ensuring authentic representation through content freshness checks
 * - Derrida: Deconstructing content into API response with metadata
 * - Dante: Guiding the request through different processing stages
 */
export async function GET(request: NextRequest) {
  try {
    // Begin the journey (Dante's navigation)
    const requestStart = Date.now();
    HesseLogger.summary.start('Getting Cover Letter content');

    // Get the query parameters (Derrida's deconstruction of the request)
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    const timestamp = searchParams.get('t'); // Cache-busting parameter
    const includeMetadata = searchParams.get('metadata') === 'true';
    const isAmplify = !!process.env.AWS_EXECUTION_ENV; // Check if running in AWS Amplify

    console.log(`Cover Letter API called with forceRefresh=${forceRefresh}, timestamp=${timestamp}, includeMetadata=${includeMetadata}, isAmplify=${isAmplify}`);
    DanteLogger.success.basic(`Cover Letter API called with forceRefresh=${forceRefresh}`);

    // Get the content state service (Hesse's structured approach)
    const contentStateService = ContentStateService.getInstance();

    // Get the current content fingerprint
    const contentFingerprint = contentStateService.getFingerprint() || '';

    // Get the Amplify storage service
    const amplifyStorageService = AmplifyStorageService.getInstance();

    // Check if Amplify Storage is available and should be used
    const useAmplify = amplifyStorageService.isAmplifyStorageReady() &&
                      (isAmplify || process.env.AMPLIFY_USE_STORAGE === 'true');

    if (process.env.DEBUG_LOGGING === 'true') {
      console.log(`🔍 [CoverLetterAPI] isAmplifyStorageReady: ${amplifyStorageService.isAmplifyStorageReady()}`);
      console.log(`🔍 [CoverLetterAPI] isAmplify: ${isAmplify}`);
      console.log(`🔍 [CoverLetterAPI] AMPLIFY_USE_STORAGE: ${process.env.AMPLIFY_USE_STORAGE}`);
      console.log(`🔍 [CoverLetterAPI] useAmplify: ${useAmplify}`);
      console.log(`🔍 [CoverLetterAPI] contentFingerprint: ${contentFingerprint}`);
    }

    if (useAmplify) {
      console.log('Using Amplify storage for content');
      DanteLogger.success.basic('Using Amplify storage for content');

      try {
        if (process.env.DEBUG_LOGGING === 'true') {
          console.log(`🔍 [CoverLetterAPI] Getting cover letter from Amplify with fingerprint: ${contentFingerprint}`);
          console.log(`🔍 [CoverLetterAPI] forceRefresh: ${forceRefresh}`);
        }

        // Get the cover letter from Amplify
        const amplifyResult = await getCoverLetterFromAmplify(contentFingerprint, forceRefresh);

        if (process.env.DEBUG_LOGGING === 'true') {
          console.log(`🔍 [CoverLetterAPI] Amplify result success: ${amplifyResult.success}`);
          console.log(`🔍 [CoverLetterAPI] Amplify result message: ${amplifyResult.message}`);
          console.log(`🔍 [CoverLetterAPI] Amplify result content length: ${amplifyResult.content?.length || 0}`);
        }

        if (!amplifyResult.success) {
          throw new Error(amplifyResult.message);
        }

        // Calculate request duration
        const requestDuration = Date.now() - requestStart;

        // Construct response
        const responseData = {
          success: true,
          content: amplifyResult.content,
          isStale: amplifyResult.isStale,
          timestamp: new Date().toISOString(),
          requestDuration,

          // Include metadata if requested
          ...(includeMetadata && amplifyResult.metadata ? {
            metadata: {
              ...amplifyResult.metadata,
              contentLength: amplifyResult.content?.length || 0,
              processingStage: 'amplify_storage'
            }
          } : {})
        };

        // Return the Cover Letter content
        return new NextResponse(
          JSON.stringify(responseData),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Processing-Time': `${requestDuration}ms`,
              'X-Storage-Type': 'amplify'
            }
          }
        );
      } catch (amplifyError) {
        console.error('Error using Amplify storage:', amplifyError);
        DanteLogger.error.dataFlow(`Error using Amplify storage: ${amplifyError}`);

        // Fall back to the standard approach
        console.log('Falling back to standard approach');
        DanteLogger.warn.deprecated('Falling back to standard approach');
      }
    } else {
      console.log('Using local file system for content');
      DanteLogger.success.basic('Using local file system for content');
    }

    // Try to get the Cover Letter content using the unified approach first
    console.log('Calling getFormattedContent for cover_letter...');
    let result;

    try {
      result = await contentStateService.getFormattedContent('cover_letter', 'markdown', forceRefresh);
      console.log('getFormattedContent result:', {
        success: result.success,
        isStale: result.isStale,
        contentLength: result.content?.length,
        format: result.metadata?.format,
        contentType: result.metadata?.contentType
      });
    } catch (formatError) {
      console.error('Error getting formatted content:', formatError);
      DanteLogger.error.dataFlow(`Error getting formatted content: ${formatError}`);

      // If the unified approach fails, try to read the cover letter file directly
      console.log('Trying to read cover letter file directly as fallback');
      DanteLogger.warn.deprecated('Trying to read cover letter file directly as fallback');

      const coverLetterPath = path.join(process.cwd(), 'public', 'extracted', 'cover_letter.md');

      if (fs.existsSync(coverLetterPath)) {
        try {
          const content = fs.readFileSync(coverLetterPath, 'utf8');

          result = {
            success: true,
            content,
            isStale: false,
            metadata: {
              generationTime: 0,
              contentFingerprint: contentStateService.getFingerprint() || '',
              sections: [],
              format: 'markdown',
              contentType: 'cover_letter'
            }
          };

          console.log('Successfully read cover letter file directly');
          DanteLogger.success.basic('Successfully read cover letter file directly');
        } catch (readError) {
          console.error('Error reading cover letter file:', readError);
          DanteLogger.error.dataFlow(`Error reading cover letter file: ${readError}`);

          // If reading the file fails, create a simple cover letter
          console.log('Creating simple cover letter as fallback');
          DanteLogger.warn.deprecated('Creating simple cover letter as fallback');

          const coverLetterContent = `# Cover Letter

## Summary

This is a fallback cover letter generated due to an error in processing the PDF content.

## Skills

- Professional skills demonstrated through experience
- Technical expertise in relevant areas
- Strong communication and collaboration abilities

## Experience Highlights

- Successfully completed projects with measurable results
- Worked effectively in team environments
- Demonstrated leadership and initiative

## Why I'm a Great Fit

I believe my experience and skills align well with your requirements, and I'm excited about the opportunity to contribute to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to your organization.

Sincerely,
Applicant
`;

          result = {
            success: true,
            content: coverLetterContent,
            isStale: true,
            metadata: {
              generationTime: 0,
              contentFingerprint: contentStateService.getFingerprint() || '',
              sections: ['Summary', 'Skills', 'Experience Highlights', 'Why I\'m a Great Fit'],
              format: 'markdown',
              contentType: 'cover_letter'
            }
          };

          // Save the fallback cover letter for future use
          try {
            // Try to save to Amplify storage if we're in Amplify
            if (isAmplify || useAmplify) {
              const coverLetterStorageKey = amplifyStorageService.getCoverLetterStorageKey(contentFingerprint, 'cover_letter.md');
              await amplifyStorageService.uploadMarkdown(coverLetterContent, coverLetterStorageKey);
              console.log('Saved fallback cover letter to Amplify storage');
              DanteLogger.success.basic('Saved fallback cover letter to Amplify storage');
            } else {
              // Ensure the extracted directory exists
              const extractedDir = path.join(process.cwd(), 'public', 'extracted');
              if (!fs.existsSync(extractedDir)) {
                fs.mkdirSync(extractedDir, { recursive: true });
              }

              fs.writeFileSync(path.join(extractedDir, 'cover_letter.md'), coverLetterContent);
              console.log('Saved fallback cover letter');
              DanteLogger.success.basic('Saved fallback cover letter');
            }
          } catch (writeError) {
            console.error('Error saving fallback cover letter:', writeError);
            DanteLogger.error.dataFlow(`Error saving fallback cover letter: ${writeError}`);
          }
        }
      } else {
        // If the cover letter file doesn't exist, create a simple cover letter
        console.log('Cover letter file not found, creating simple cover letter');
        DanteLogger.warn.deprecated('Cover letter file not found, creating simple cover letter');

        const coverLetterContent = `# Cover Letter

## Summary

This is a fallback cover letter generated due to an error in processing the PDF content.

## Skills

- Professional skills demonstrated through experience
- Technical expertise in relevant areas
- Strong communication and collaboration abilities

## Experience Highlights

- Successfully completed projects with measurable results
- Worked effectively in team environments
- Demonstrated leadership and initiative

## Why I'm a Great Fit

I believe my experience and skills align well with your requirements, and I'm excited about the opportunity to contribute to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to your organization.

Sincerely,
Applicant
`;

        result = {
          success: true,
          content: coverLetterContent,
          isStale: true,
          metadata: {
            generationTime: 0,
            contentFingerprint: contentStateService.getFingerprint() || '',
            sections: ['Summary', 'Skills', 'Experience Highlights', 'Why I\'m a Great Fit'],
            format: 'markdown',
            contentType: 'cover_letter'
          }
        };

        // Save the fallback cover letter for future use
        try {
          // Try to save to Amplify storage if we're in Amplify
          if (isAmplify || useAmplify) {
            const coverLetterStorageKey = amplifyStorageService.getCoverLetterStorageKey(contentFingerprint, 'cover_letter.md');
            await amplifyStorageService.uploadMarkdown(coverLetterContent, coverLetterStorageKey);
            console.log('Saved fallback cover letter to Amplify storage');
            DanteLogger.success.basic('Saved fallback cover letter to Amplify storage');
          } else {
            // Ensure the extracted directory exists
            const extractedDir = path.join(process.cwd(), 'public', 'extracted');
            if (!fs.existsSync(extractedDir)) {
              fs.mkdirSync(extractedDir, { recursive: true });
            }

            fs.writeFileSync(path.join(extractedDir, 'cover_letter.md'), coverLetterContent);
            console.log('Saved fallback cover letter');
            DanteLogger.success.basic('Saved fallback cover letter');
          }
        } catch (writeError) {
          console.error('Error saving fallback cover letter:', writeError);
          DanteLogger.error.dataFlow(`Error saving fallback cover letter: ${writeError}`);
        }
      }
    }

    // If we still don't have a successful result, return an error
    if (!result || !result.success) {
      const errorMsg = result?.message || 'Failed to get Cover Letter content';
      console.error('Error formatting Cover Letter content:', errorMsg);
      DanteLogger.error.dataFlow(`Error formatting Cover Letter content: ${errorMsg}`);

      return NextResponse.json({
        success: false,
        error: errorMsg,
        isStale: result?.isStale || true,
        timestamp: new Date().toISOString(),
        requestDuration: Date.now() - requestStart
      }, { status: 500 });
    }

    // Verify content is not empty
    if (!result.content || result.content.trim() === '') {
      const errorMsg = 'Cover Letter content is empty';
      console.error(errorMsg);
      DanteLogger.error.dataFlow(errorMsg);

      return NextResponse.json({
        success: false,
        error: errorMsg,
        isStale: true,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Log content length for debugging (Dante's journey completion)
    console.log(`Cover Letter content retrieved successfully (${result.content.length} characters)`);
    DanteLogger.success.core('Cover Letter content retrieved successfully');
    HesseLogger.summary.complete('Cover Letter content retrieved successfully');

    // Calculate request duration (Dante's journey metrics)
    const requestDuration = Date.now() - requestStart;

    // Construct response based on philosophical framework
    const responseData = {
      // Core response (Hesse's balanced structure)
      success: true,
      content: result.content,
      isStale: result.isStale,
      timestamp: new Date().toISOString(),
      requestDuration,

      // Include metadata if requested (Derrida's deeper deconstruction)
      ...(includeMetadata && result.metadata ? {
        metadata: {
          ...result.metadata,
          contentLength: result.content.length,
          processingStage: contentStateService.getState().processingStage
        }
      } : {})
    };

    // Return the Cover Letter content with cache control headers (Salinger's authentic delivery)
    return new NextResponse(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`,
          'X-Storage-Type': 'local'
        }
      }
    );
  } catch (error) {
    console.error('Error getting Cover Letter content:', error);
    HesseLogger.summary.error(`Error getting Cover Letter content: ${error}`);
    DanteLogger.error.system('Error getting Cover Letter content', error);

    // Calculate request duration even for errors (Dante's complete journey)
    const requestDuration = Date.now() - requestStart;

    // Structured error response (Hesse's balanced approach to errors)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get Cover Letter content',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        requestDuration,
        // Include error stage information (Dante's journey stage where error occurred)
        errorStage: 'api_processing'
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Processing-Time': `${requestDuration}ms`,
          'X-Error-Stage': 'api_processing'
        }
      }
    );
  }
}
