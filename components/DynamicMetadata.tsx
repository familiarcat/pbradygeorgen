'use client';

import { useEffect, useState } from 'react';
import { Metadata } from 'next';

/**
 * DynamicMetadata component
 *
 * This component dynamically updates the document title and description
 * based on the name extracted from the PDF.
 *
 * It follows the Derrida philosophy of deconstructing hardcoded values
 * and replacing them with dynamic content.
 */
export default function DynamicMetadata() {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    // Function to format a name with proper capitalization
    const formatName = (name: string): string => {
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
    };

    // Function to update the document metadata
    const updateDocumentMetadata = (formattedName: string) => {
      try {
        // Update the document title
        document.title = `Resume - ${formattedName}`;

        // Find and update the meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', `Professional resume for ${formattedName}`);
        }

        // Store the name in state
        setName(formattedName);

        console.log(`Updated document metadata with name: ${formattedName}`);
      } catch (error) {
        console.error('Error updating document metadata:', error);
      }
    };

    // Function to fetch the name from the resume content
    const fetchName = async () => {
      try {
        // Add a cache-busting parameter to avoid getting cached responses
        const timestamp = new Date().getTime();
        const response = await fetch(`/extracted/resume_content.json?t=${timestamp}`);

        if (!response.ok) {
          console.warn(`Could not fetch resume content for metadata: ${response.status} ${response.statusText}`);
          return;
        }

        const resumeContent = await response.json();

        // Extract the name from the raw text
        if (resumeContent && resumeContent.rawText) {
          // Extract the first name from the raw text (assuming it's at the beginning)
          const firstLine = resumeContent.rawText.split('\n')[0] || '';
          const firstWords = firstLine.split(' ');

          if (firstWords.length >= 2) {
            // Assume the first two words are the first and last name
            const rawName = `${firstWords[0]} ${firstWords[1]}`;
            const formattedName = formatName(rawName);

            if (formattedName) {
              updateDocumentMetadata(formattedName);
            } else {
              console.warn('Could not format name from raw text');
            }
          } else {
            console.warn('First line does not contain at least two words');
          }
        } else {
          console.warn('Resume content does not contain raw text');
        }
      } catch (error) {
        console.error('Error fetching name for metadata:', error);
      }
    };

    // Fetch the name when the component mounts
    fetchName();

    // Also update when the window gains focus (in case the PDF was changed)
    const handleFocus = () => {
      fetchName();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}
