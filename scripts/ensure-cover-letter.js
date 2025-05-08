#!/usr/bin/env node

/**
 * Ensure Cover Letter Content Script
 * 
 * This script ensures that the cover letter content is available in the public/extracted directory
 * by copying it from the public/downloads directory if it exists, or generating a default one if not.
 * 
 * Philosophical Framework:
 * - Derrida: Ensuring content availability through différance
 * - Hesse: Balancing structure with flexibility
 * - Salinger: Simplifying the user experience
 * - Dante: Guiding the content through a transformative journey
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Dante emoji logger
const danteEmoji = {
  success: {
    basic: '😇☀️: ',
    core: '😇🌟: ',
    perfection: '😇🌈: '
  },
  error: {
    system: '👑💢: ',
    dataFlow: '⚠️⚡: ',
    validation: '⚠️🔥: '
  },
  warn: {
    deprecated: '⚠️🌊: ',
    performance: '⚠️⏱️: ',
    security: '⚠️🔒: '
  }
};

// Dante logger
const danteLogger = {
  success: {
    basic: (message) => console.log(`${colors.green}${danteEmoji.success.basic}${message}${colors.reset}`),
    core: (message) => console.log(`${colors.green}${danteEmoji.success.core}${message}${colors.reset}`),
    perfection: (message) => console.log(`${colors.green}${danteEmoji.success.perfection}${message}${colors.reset}`)
  },
  error: {
    system: (message, error) => console.log(`${colors.red}${danteEmoji.error.system}${message}${error ? ': ' + error : ''}${colors.reset}`),
    dataFlow: (message) => console.log(`${colors.red}${danteEmoji.error.dataFlow}${message}${colors.reset}`),
    validation: (message) => console.log(`${colors.red}${danteEmoji.error.validation}${message}${colors.reset}`)
  },
  warn: {
    deprecated: (message) => console.log(`${colors.yellow}${danteEmoji.warn.deprecated}${message}${colors.reset}`),
    performance: (message) => console.log(`${colors.yellow}${danteEmoji.warn.performance}${message}${colors.reset}`),
    security: (message) => console.log(`${colors.yellow}${danteEmoji.warn.security}${message}${colors.reset}`)
  }
};

// Default cover letter content
const DEFAULT_COVER_LETTER = `# P. Brady Georgen - Cover Letter

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`;

/**
 * Main function to ensure cover letter content
 */
async function ensureCoverLetterContent() {
  try {
    console.log(`\n${colors.cyan}${colors.bright}🔄 ENSURING COVER LETTER CONTENT${colors.reset}`);
    console.log(`${colors.cyan}=============================`);
    
    danteLogger.success.basic('Starting cover letter content verification');
    
    // Set up directories
    const publicDir = path.join(process.cwd(), 'public');
    const extractedDir = path.join(publicDir, 'extracted');
    const downloadsDir = path.join(publicDir, 'downloads');
    
    // Ensure directories exist
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
      danteLogger.success.basic('Created extracted directory');
    }
    
    // Define file paths
    const coverLetterSourcePath = path.join(downloadsDir, 'cover_letter.md');
    const coverLetterDestPath = path.join(extractedDir, 'cover_letter.md');
    
    // Check if cover letter exists in downloads directory
    if (fs.existsSync(coverLetterSourcePath)) {
      // Copy the cover letter from downloads to extracted
      fs.copyFileSync(coverLetterSourcePath, coverLetterDestPath);
      danteLogger.success.core('Copied cover letter from downloads to extracted directory');
    } else {
      // Create a default cover letter in the extracted directory
      fs.writeFileSync(coverLetterDestPath, DEFAULT_COVER_LETTER);
      danteLogger.success.core('Created default cover letter in extracted directory');
    }
    
    // Verify the cover letter exists in the extracted directory
    if (fs.existsSync(coverLetterDestPath)) {
      const stats = fs.statSync(coverLetterDestPath);
      danteLogger.success.perfection(`Cover letter verified in extracted directory (${stats.size} bytes)`);
    } else {
      throw new Error('Failed to create or copy cover letter');
    }
    
    console.log(`\n${colors.green}${colors.bright}✅ COVER LETTER CONTENT VERIFICATION COMPLETED${colors.reset}`);
    console.log(`${colors.green}=============================`);
    console.log(`Cover letter saved to: ${coverLetterDestPath}`);
    
    return {
      success: true,
      path: coverLetterDestPath
    };
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ COVER LETTER CONTENT VERIFICATION FAILED${colors.reset}`);
    console.error(`${colors.red}=============================`);
    console.error(`Error: ${error.message}`);
    
    danteLogger.error.system('Cover letter content verification failed', error);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the main function
ensureCoverLetterContent();
