'use server';

import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * Extracts the name from the resume content and returns metadata
 *
 * This function follows the Derrida philosophy of deconstructing hardcoded values
 * and replacing them with dynamic content derived from the source PDF.
 */
export async function getMetadata(): Promise<Metadata> {
  try {
    // Default metadata in case we can't extract the name
    let metadata: Metadata = {
      title: "Professional Resume",
      description: "Professional resume created with AlexAI",
    };

    // Path to the resume content JSON file
    const contentPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content.json');

    // Check if the file exists
    if (fs.existsSync(contentPath)) {
      try {
        // Read and parse the JSON file
        const contentRaw = fs.readFileSync(contentPath, 'utf-8');
        const content = JSON.parse(contentRaw);

        // Extract the name from the raw text
        if (content && content.rawText) {
          // Extract the first name from the raw text (assuming it's at the beginning)
          const firstLine = content.rawText.split('\n')[0] || '';
          const firstWords = firstLine.split(' ');

          if (firstWords.length >= 2) {
            // Assume the first two words are the first and last name
            const rawName = `${firstWords[0]} ${firstWords[1]}`;
            const formattedName = formatName(rawName);

            if (formattedName) {
              // Update the metadata with the extracted name
              metadata = {
                title: `Resume - ${formattedName}`,
                description: `Professional resume for ${formattedName}`,
              };

              console.log(`Generated metadata with extracted name: ${formattedName}`);
              try {
                DanteLogger.success.core(`Generated metadata with extracted name: ${formattedName}`);
              } catch (logError) {
                // Ignore logging errors in server components
                console.log('DanteLogger error (ignored):', logError);
              }
            }
          }
        } else {
          console.log('Resume content file exists but has no rawText property');
        }
      } catch (parseError) {
        console.error('Error parsing resume content:', parseError);
      }
    } else {
      console.log('Resume content file not found, using default metadata');
      try {
        DanteLogger.warning.dataFlow('Resume content file not found, using default metadata');
      } catch (logError) {
        // Ignore logging errors in server components
        console.log('DanteLogger error (ignored):', logError);
      }
    }

    return metadata;
  } catch (error) {
    console.error(`Error generating metadata:`, error);

    try {
      DanteLogger.error.dataFlow(`Error generating metadata: ${error}`);
    } catch (logError) {
      // Ignore logging errors in server components
      console.log('DanteLogger error (ignored):', logError);
    }

    // Return default metadata in case of error
    return {
      title: "Professional Resume",
      description: "Professional resume created with AlexAI",
    };
  }
}

/**
 * Formats a name with proper capitalization
 */
function formatName(name: string): string {
  if (!name) return '';

  // Split the name into words and capitalize the first letter of each word
  return name
    .split(' ')
    .map(word => {
      // Handle empty words
      if (!word) return '';

      // Handle all caps words (like "BENJAMIN STEIN")
      if (word === word.toUpperCase()) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // Otherwise just capitalize the first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
