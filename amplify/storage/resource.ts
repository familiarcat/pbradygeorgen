import { defineStorage } from '@aws-amplify/backend';

/**
 * Define your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'alexai-storage',
  access: ['auth', 'guest'],
  // Define the folder structure
  folders: {
    // PDFs folder for storing original PDF files
    pdfs: {
      access: ['auth', 'guest'],
    },
    // Extracted folder for storing extracted content
    extracted: {
      access: ['auth', 'guest'],
    },
    // Analyzed folder for storing analyzed content
    analyzed: {
      access: ['auth', 'guest'],
    },
    // Cover letters folder for storing generated cover letters
    'cover-letters': {
      access: ['auth', 'guest'],
    },
  },
});
