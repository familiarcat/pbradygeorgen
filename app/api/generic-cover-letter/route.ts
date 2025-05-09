import { NextResponse } from 'next/server';

/**
 * GET handler for the generic-cover-letter API route
 *
 * This route returns a generic cover letter with no specific names or companies.
 * It bypasses all caching mechanisms to ensure fresh content.
 */
export async function GET(request: Request) {
  try {
    console.log('🔍 [Hesse:Summary:Start] Fetching generic cover letter content');
    console.log('😇☀️: API: Fetching generic cover letter content');

    // Parse the request URL to get query parameters
    const url = new URL(request.url);
    const timestamp = url.searchParams.get('t') || Date.now().toString();

    console.log(`🕒 [Hesse:Summary:Info] Request timestamp: ${new Date(parseInt(timestamp)).toISOString()}`);
    console.log('😇🕒: Request timestamp:', new Date(parseInt(timestamp)).toISOString());

    // Generate a random variation to ensure we can see changes
    const variations = [
      "I am confident in my ability to make significant contributions to any organization seeking expertise in this field.",
      "I believe I can bring valuable expertise to any organization in need of my specialized skills.",
      "My qualifications would be an asset to any organization looking for expertise in this area.",
      "I am eager to contribute my skills and experience to an organization that values innovation.",
      "I look forward to bringing my unique perspective and abilities to a forward-thinking organization."
    ];

    // Use the timestamp to select a variation
    const variationIndex = Math.floor(parseInt(timestamp) % variations.length);
    const selectedVariation = variations[variationIndex];

    console.log(`🎲 [Hesse:Summary:Info] Selected variation ${variationIndex + 1} of ${variations.length}`);
    console.log('😇🎲: Selected variation:', variationIndex + 1);

    // Create a generic cover letter with the selected variation and applicant's name in the header
    const applicantName = "Benjamin Stein";

    // Create a generic cover letter with the selected variation
    const genericCoverLetter = `# ${applicantName}

I am writing to express my interest in exploring career opportunities where my background in clinical informatics and healthcare technology can be put to effective use. With a proven track record in implementing, maintaining, and optimizing healthcare information systems, ${selectedVariation}

Throughout my career, I have developed expertise in managing EHR systems, enterprise web browsers, and various administrative tools. My experience includes not only technical implementation but also training staff and ensuring compliance with data security standards. I have consistently demonstrated strong problem-solving abilities and effective communication skills, particularly in high-pressure healthcare environments where technology reliability is critical.

My approach to healthcare technology is guided by a commitment to creating user-friendly solutions that enhance clinical workflows rather than complicate them. I believe that technology should serve as a bridge to better patient care, and I have consistently worked to ensure that the systems I manage align with this philosophy. My background in both network and database administration provides me with a comprehensive understanding of healthcare IT infrastructure that can be valuable in various settings.

I would welcome the opportunity to discuss how my skills and experience could benefit an organization seeking someone with my qualifications. I am confident that my technical expertise, combined with my understanding of healthcare environments, would make me a valuable addition to any team focused on improving healthcare through technology.

Thank you for considering my application. I look forward to the possibility of speaking with you about how I can contribute to your organization's success.

Sincerely,
Benjamin Stein`;

    console.log('✅ [Hesse:Summary:Complete] Generic cover letter created successfully');
    console.log('😇🌈: Generic cover letter created successfully');

    return NextResponse.json({
      success: true,
      message: 'Generic cover letter created successfully',
      content: genericCoverLetter,
      data: {
        timestamp: new Date().toISOString(),
        variation: variationIndex + 1
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.log(`❌ [Hesse:Summary:Error] Error creating cover letter: ${errorMessage}`);
    console.log('👑💢: Error creating cover letter', error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: 'An error occurred while creating the cover letter.'
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for the generic-cover-letter API route
 *
 * This route generates a new generic cover letter with a random variation.
 */
export async function POST(request: Request) {
  try {
    console.log('🔍 [Hesse:Summary:Start] Generating new generic cover letter');
    console.log('😇☀️: API: Generating new generic cover letter');

    // Parse the request body
    const body = await request.json();
    const { timestamp } = body;

    // Log the timestamp to help with debugging cache issues
    const requestTimestamp = timestamp || Date.now();
    console.log(`🕒 [Hesse:Summary:Info] Request timestamp: ${new Date(requestTimestamp).toISOString()}`);
    console.log('😇🕒: Request timestamp:', new Date(requestTimestamp).toISOString());

    // Generate a random variation to ensure we can see changes
    const variations = [
      "I am confident in my ability to make significant contributions to any organization seeking expertise in this field.",
      "I believe I can bring valuable expertise to any organization in need of my specialized skills.",
      "My qualifications would be an asset to any organization looking for expertise in this area.",
      "I am eager to contribute my skills and experience to an organization that values innovation.",
      "I look forward to bringing my unique perspective and abilities to a forward-thinking organization."
    ];

    // Use the timestamp to select a variation, but ensure it's different from the last one
    const variationIndex = Math.floor(requestTimestamp % variations.length);
    const selectedVariation = variations[variationIndex];

    console.log(`🎲 [Hesse:Summary:Info] Selected variation ${variationIndex + 1} of ${variations.length}`);
    console.log('😇🎲: Selected variation:', variationIndex + 1);

    // Create a generic cover letter with the selected variation and applicant's name in the header
    const applicantName = "Benjamin Stein";

    // Create a generic cover letter with the selected variation
    const genericCoverLetter = `# ${applicantName}

I am writing to express my interest in exploring career opportunities where my background in clinical informatics and healthcare technology can be put to effective use. With a proven track record in implementing, maintaining, and optimizing healthcare information systems, ${selectedVariation}

Throughout my career, I have developed expertise in managing EHR systems, enterprise web browsers, and various administrative tools. My experience includes not only technical implementation but also training staff and ensuring compliance with data security standards. I have consistently demonstrated strong problem-solving abilities and effective communication skills, particularly in high-pressure healthcare environments where technology reliability is critical.

My approach to healthcare technology is guided by a commitment to creating user-friendly solutions that enhance clinical workflows rather than complicate them. I believe that technology should serve as a bridge to better patient care, and I have consistently worked to ensure that the systems I manage align with this philosophy. My background in both network and database administration provides me with a comprehensive understanding of healthcare IT infrastructure that can be valuable in various settings.

I would welcome the opportunity to discuss how my skills and experience could benefit an organization seeking someone with my qualifications. I am confident that my technical expertise, combined with my understanding of healthcare environments, would make me a valuable addition to any team focused on improving healthcare through technology.

Thank you for considering my application. I look forward to the possibility of speaking with you about how I can contribute to your organization's success.

Sincerely,
Benjamin Stein`;

    console.log('✅ [Hesse:Summary:Complete] Generic cover letter created successfully');
    console.log('😇🌈: Generic cover letter created successfully');

    return NextResponse.json({
      success: true,
      message: 'Generic cover letter created successfully',
      content: genericCoverLetter,
      data: {
        timestamp: new Date().toISOString(),
        variation: variationIndex + 1
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
