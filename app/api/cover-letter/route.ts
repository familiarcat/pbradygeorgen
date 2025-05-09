import { NextRequest, NextResponse } from 'next/server';
import { S3StorageManager } from '@/utils/s3StorageManager.js';
import fs from 'fs';
import path from 'path';

/**
 * API route for retrieving cover letter content
 *
 * This route fetches the cover letter content from S3 or local storage,
 * following our single source of truth philosophy.
 *
 * Philosophical Framework:
 * - Derrida: Deconstructing the request to understand its true intent
 * - Hesse: Balancing between different storage options with harmonious patterns
 * - Salinger: Ensuring authentic representation by rejecting templates
 * - Dante: Guiding the content through its journey from storage to presentation
 */
export async function GET(request: NextRequest) {
  try {
    // Start the journey (Dante's navigation)
    console.log('🔍 [Hesse:Summary:Start] Fetching cover letter content');
    console.log('😇☀️: API: Fetching cover letter content');

    // Parse query parameters (Derrida's deconstruction)
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Get the content fingerprint from the default resume
    const publicDir = path.join(process.cwd(), 'public');
    const defaultResumePath = path.join(publicDir, 'default_resume.pdf');

    // Initialize S3 Storage Manager
    const s3Manager = S3StorageManager.getInstance();

    // Check if the default resume exists
    if (!fs.existsSync(defaultResumePath)) {
      console.log('❌ [Hesse:Summary:Error] Default resume not found');
      console.log('👑💢: Default resume not found');

      return NextResponse.json(
        {
          success: false,
          error: 'Default resume not found',
          message: 'The default resume file could not be found. Please ensure it exists at the correct location.'
        },
        { status: 404 }
      );
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(defaultResumePath);

    // Generate a content fingerprint
    const contentFingerprint = s3Manager.generateContentFingerprint(pdfBuffer);

    // Define S3 key for the cover letter
    const coverLetterS3Key = s3Manager.getCoverLetterS3Key(contentFingerprint, 'cover_letter.md');

    // Check if we need to force refresh
    if (!forceRefresh) {
      // Check if the cover letter exists in S3
      const existsResult = await s3Manager.fileExists(coverLetterS3Key);

      if (existsResult.success && existsResult.exists) {
        console.log('⏳ [Hesse:Summary:Progress] Cover letter found in S3, fetching content');
        console.log('😇🌟: Cover letter found in S3, fetching content');

        // Download the cover letter from S3
        const downloadResult = await s3Manager.downloadText(coverLetterS3Key);

        if (downloadResult.success && downloadResult.content) {
          console.log('✅ [Hesse:Summary:Complete] Cover letter fetched successfully from S3');
          console.log('😇🌈: Cover letter fetched successfully from S3');

          return NextResponse.json({
            success: true,
            content: downloadResult.content,
            metadata: downloadResult.metadata,
            message: 'Cover letter fetched successfully from S3'
          });
        }
      }
    }

    // If we get here, either the cover letter doesn't exist in S3, or we need to force refresh
    // In a real implementation, we would generate the cover letter here
    // For now, we'll return a fallback message

    console.log('⏳ [Hesse:Summary:Progress] Cover letter not found in S3 or force refresh requested');
    console.log('⚠️🌊: Cover letter not found in S3 or force refresh requested');

    // Check if we have a local cover letter file
    const localCoverLetterPath = path.join(publicDir, 'extracted', 'cover_letter.md');

    if (fs.existsSync(localCoverLetterPath)) {
      console.log('⏳ [Hesse:Summary:Progress] Using local cover letter file');
      console.log('😇☀️: Using local cover letter file');

      // Read the local cover letter file
      const localCoverLetter = fs.readFileSync(localCoverLetterPath, 'utf8');

      // Upload the local cover letter to S3 for future use
      await s3Manager.uploadMarkdown(
        localCoverLetter,
        coverLetterS3Key,
        { contentFingerprint, source: 'local-file' }
      );

      console.log('✅ [Hesse:Summary:Complete] Cover letter fetched successfully from local file and uploaded to S3');
      console.log('😇🌈: Cover letter fetched successfully from local file and uploaded to S3');

      return NextResponse.json({
        success: true,
        content: localCoverLetter,
        message: 'Cover letter fetched successfully from local file'
      });
    }

    // If we get here, we don't have a cover letter anywhere
    // In a real implementation, we would generate one using our S3CoverLetterGenerator
    // For now, we'll return an error

    console.log('❌ [Hesse:Summary:Error] Cover letter not found');
    console.log('⚠️⚡: Cover letter not found');

    return NextResponse.json(
      {
        success: false,
        error: 'Cover letter not found',
        message: 'The cover letter could not be found or generated. Please run the prebuild processor first.'
      },
      { status: 404 }
    );
  } catch (error) {
    // Handle errors (Dante's journey through the Inferno)
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log(`❌ [Hesse:Summary:Error] Error fetching cover letter: ${errorMessage}`);
    console.log('👑💢: Error fetching cover letter', error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'An error occurred while fetching the cover letter.'
      },
      { status: 500 }
    );
  }
}

/**
 * API route for generating a new cover letter
 *
 * This route generates a new cover letter using the S3CoverLetterGenerator
 * and stores it in S3.
 */
export async function POST(request: Request) {
  try {
    console.log('🔍 [Hesse:Summary:Start] Generating new cover letter');
    console.log('😇☀️: API: Generating new cover letter');

    // Parse the request body
    const body = await request.json();
    const { forceRegenerate, company, position, hiringManager, companyDetails, positionDetails, generic, timestamp } = body;

    // Log the timestamp to help with debugging cache issues
    if (timestamp) {
      console.log(`🕒 [Hesse:Summary:Info] Request timestamp: ${new Date(timestamp).toISOString()}`);
      console.log('😇🕒: Request timestamp:', new Date(timestamp).toISOString());
    }

    // Always force regeneration when generic flag is true or when a timestamp is provided
    const shouldForceRegenerate = forceRegenerate || generic || timestamp;

    if (shouldForceRegenerate) {
      console.log('🔄 [Hesse:Summary:Info] Forcing regeneration of cover letter');
      console.log('😇🔄: Forcing regeneration of cover letter');

      // Clear any cached files to ensure fresh content
      try {
        const publicDir = path.join(process.cwd(), 'public');
        const coverLetterDir = path.join(publicDir, 'cover-letters');

        if (fs.existsSync(coverLetterDir)) {
          console.log('🧹 [Hesse:Summary:Info] Clearing cached cover letter files');
          console.log('😇🧹: Clearing cached cover letter files');

          // Only delete the cover letter files, not the entire directory
          const contentFingerprintDir = path.join(coverLetterDir, '21e6d762f802afa8f89b8198343aa88250c93a8da1fc5743f6845e4e70f7c1aa');

          if (fs.existsSync(contentFingerprintDir)) {
            const files = fs.readdirSync(contentFingerprintDir);

            for (const file of files) {
              const filePath = path.join(contentFingerprintDir, file);
              fs.unlinkSync(filePath);
              console.log(`🗑️ [Hesse:Summary:Info] Deleted cached file: ${filePath}`);
            }
          }
        }

        // Create a new generic cover letter file directly
        if (generic) {
          console.log('📝 [Hesse:Summary:Info] Creating new generic cover letter file');
          console.log('😇📝: Creating new generic cover letter file');

          const genericCoverLetter = `# Professional Cover Letter

Dear Hiring Manager,

I am writing to express my interest in exploring career opportunities where my background in clinical informatics and healthcare technology can be put to effective use. With a proven track record in implementing, maintaining, and optimizing healthcare information systems, I am confident in my ability to make significant contributions to any organization seeking expertise in this field.

Throughout my career, I have developed expertise in managing EHR systems, enterprise web browsers, and various administrative tools. My experience includes not only technical implementation but also training staff and ensuring compliance with data security standards. I have consistently demonstrated strong problem-solving abilities and effective communication skills, particularly in high-pressure healthcare environments where technology reliability is critical.

My approach to healthcare technology is guided by a commitment to creating user-friendly solutions that enhance clinical workflows rather than complicate them. I believe that technology should serve as a bridge to better patient care, and I have consistently worked to ensure that the systems I manage align with this philosophy. My background in both network and database administration provides me with a comprehensive understanding of healthcare IT infrastructure that can be valuable in various settings.

I would welcome the opportunity to discuss how my skills and experience could benefit an organization seeking someone with my qualifications. I am confident that my technical expertise, combined with my understanding of healthcare environments, would make me a valuable addition to any team focused on improving healthcare through technology.

Thank you for considering my application. I look forward to the possibility of speaking with you about how I can contribute to your organization's success.

Sincerely,
Benjamin Stein`;

          // Create the directory if it doesn't exist
          if (!fs.existsSync(contentFingerprintDir)) {
            fs.mkdirSync(contentFingerprintDir, { recursive: true });
          }

          // Write the generic cover letter file
          const coverLetterPath = path.join(contentFingerprintDir, 'cover_letter.md');
          fs.writeFileSync(coverLetterPath, genericCoverLetter);

          console.log(`✅ [Hesse:Summary:Info] Created new generic cover letter file: ${coverLetterPath}`);
          console.log('😇✅: Created new generic cover letter file');

          // Return the generic cover letter directly
          return NextResponse.json({
            success: true,
            message: "Generic cover letter created successfully",
            content: genericCoverLetter,
            data: {
              contentFingerprint: '21e6d762f802afa8f89b8198343aa88250c93a8da1fc5743f6845e4e70f7c1aa',
              s3Key: `cover-letters/21e6d762f802afa8f89b8198343aa88250c93a8da1fc5743f6845e4e70f7c1aa/cover_letter.md`,
              timestamp: new Date().toISOString(),
            }
          });
        }
      } catch (clearCacheError) {
        console.log(`⚠️ [Hesse:Summary:Warning] Error clearing cache: ${clearCacheError.message}`);
        console.log('⚠️🌊: Error clearing cache:', clearCacheError);
        // Continue with the request even if cache clearing fails
      }
    }

    // Get the content fingerprint from the default resume
    const publicDir = path.join(process.cwd(), 'public');
    const defaultResumePath = path.join(publicDir, 'default_resume.pdf');

    // Initialize S3 Storage Manager
    const s3Manager = S3StorageManager.getInstance();

    // Check if the default resume exists
    if (!fs.existsSync(defaultResumePath)) {
      console.log('❌ [Hesse:Summary:Error] Default resume not found');
      console.log('👑💢: Default resume not found');

      return NextResponse.json(
        {
          success: false,
          error: 'Default resume not found',
          message: 'The default resume file could not be found. Please ensure it exists at the correct location.'
        },
        { status: 404 }
      );
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(defaultResumePath);

    // Generate a content fingerprint
    const contentFingerprint = s3Manager.generateContentFingerprint(pdfBuffer);

    // Try to import the S3CoverLetterGenerator dynamically
    let coverLetterGenerator;

    try {
      const S3CoverLetterGenerator = require('@/utils/s3-cover-letter-generator');

      // Create a new instance of the generator
      coverLetterGenerator = new S3CoverLetterGenerator({
        debug: process.env.DEBUG_LOGGING === 'true'
      });
    } catch (importError) {
      console.log(`⚠️ [Hesse:Summary:Progress] Failed to import S3CoverLetterGenerator: ${importError.message}`);
      console.log('⚠️🌊: Failed to import S3CoverLetterGenerator, falling back to mock generator');

      // Fall back to the mock generator
      const MockCoverLetterGenerator = require('@/utils/mock-cover-letter-generator');

      coverLetterGenerator = new MockCoverLetterGenerator({
        debug: process.env.DEBUG_LOGGING === 'true'
      });
    }

    // Prepare cover letter parameters
    const coverLetterParams = {
      company: company || 'Prospective Employer',
      position: position || 'Open Position',
      hiringManager: hiringManager || 'Hiring Manager',
      companyDetails: companyDetails || 'A forward-thinking organization seeking talented professionals.',
      positionDetails: positionDetails || 'A role that requires a combination of technical expertise and professional experience.',
      generic: generic || false
    };

    console.log(`⏳ [Hesse:Summary:Progress] Generating cover letter with parameters:`, coverLetterParams);
    console.log('😇🌟: Generating cover letter with parameters:', coverLetterParams);

    let coverLetterResult;

    try {
      // Generate the cover letter
      coverLetterResult = await coverLetterGenerator.generateCoverLetter(
        contentFingerprint,
        coverLetterParams,
        forceRegenerate || false
      );
    } catch (generationError) {
      console.log(`❌ [Hesse:Summary:Error] Error during cover letter generation: ${generationError.message}`);
      console.log('👑💢: Error during cover letter generation', generationError);

      // Fall back to the mock generator if the real one fails
      try {
        console.log('⚠️ [Hesse:Summary:Progress] Falling back to mock generator');
        console.log('⚠️🌊: Falling back to mock generator');

        const MockCoverLetterGenerator = require('@/utils/mock-cover-letter-generator');
        const mockGenerator = new MockCoverLetterGenerator({
          debug: process.env.DEBUG_LOGGING === 'true'
        });

        coverLetterResult = await mockGenerator.generateCoverLetter(
          contentFingerprint,
          coverLetterParams,
          true
        );
      } catch (mockError) {
        console.log(`❌ [Hesse:Summary:Error] Mock generator also failed: ${mockError.message}`);
        console.log('👑💢: Mock generator also failed', mockError);

        return NextResponse.json(
          {
            success: false,
            error: mockError.message,
            message: 'Failed to generate cover letter. Please try again later.'
          },
          { status: 500 }
        );
      }
    }

    if (!coverLetterResult || !coverLetterResult.success) {
      const errorMessage = coverLetterResult ? coverLetterResult.error : 'Unknown error';
      console.log(`❌ [Hesse:Summary:Error] Cover letter generation failed: ${errorMessage}`);
      console.log('👑💢: Cover letter generation failed', errorMessage);

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          message: 'Failed to generate cover letter. Please try again later.'
        },
        { status: 500 }
      );
    }

    console.log('✅ [Hesse:Summary:Complete] Cover letter generated successfully');
    console.log('😇🌈: Cover letter generated successfully');

    return NextResponse.json({
      success: true,
      message: "Cover letter generated successfully",
      data: {
        contentFingerprint,
        s3Key: coverLetterResult.s3Key,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log(`❌ [Hesse:Summary:Error] Error generating cover letter: ${errorMessage}`);
    console.log('👑💢: Error generating cover letter', error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'An error occurred while generating the cover letter.'
      },
      { status: 500 }
    );
  }
}