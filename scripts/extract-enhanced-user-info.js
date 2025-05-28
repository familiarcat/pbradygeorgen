/**
 * Enhanced ATS-based User Information Extraction
 * 
 * This module provides enhanced extraction of user information from PDF resumes
 * using ATS (Applicant Tracking System) techniques combined with OpenAI analysis.
 * 
 * It builds upon the existing extraction functionality but adds more sophisticated
 * pattern matching and industry-specific keyword detection.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createLogger } = require('./core/logger');
const { extractUserInfo } = require('./extract-user-info');
const { analyzeResumeWithOpenAI } = require('./openai/analyzer');
const config = require('./core/config');
const utils = require('./core/utils');
const buildSummary = require('./core/build-summary');

// Create a logger for this module
const logger = createLogger('ats');

/**
 * Extract enhanced user information from a PDF file
 * 
 * @param {string} pdfPath - Path to the PDF file
 * @param {Object} options - Extraction options
 * @returns {Promise<Object>} - Extracted user information
 */
async function extractEnhancedUserInfo(pdfPath, options = {}) {
  logger.info(`Extracting enhanced user information from ${pdfPath}`);
  buildSummary.startTask('build.ats');

  try {
    // Create output directory
    const outputDir = options.outputDir || path.join(process.cwd(), 'public', 'extracted');
    utils.ensureDir(outputDir);

    // Extract text content if it doesn't exist
    const textPath = path.join(outputDir, 'resume_content.txt');
    if (!fs.existsSync(textPath)) {
      logger.info('Text content not found, extracting from PDF...');
      execSync(`node scripts/extract-pdf-text-improved.js "${pdfPath}"`, { stdio: 'inherit' });
    }

    // Read the text content
    const textContent = fs.readFileSync(textPath, 'utf8');

    // First use the basic extraction to get initial user info
    logger.info('Performing basic ATS extraction...');
    const basicUserInfo = extractUserInfo(textContent);

    // Then enhance with OpenAI analysis
    logger.info('Enhancing with OpenAI analysis...');
    buildSummary.startTask('build.ats.openai');
    const enhancedUserInfo = await enhanceWithOpenAI(textContent, basicUserInfo);
    buildSummary.completeTask('build.ats.openai');

    // Save the enhanced user info
    const outputPath = path.join(outputDir, 'user_info.json');
    fs.writeFileSync(outputPath, JSON.stringify(enhancedUserInfo, null, 2));
    logger.success(`Enhanced user information saved to ${outputPath}`);

    // Complete the ATS task
    buildSummary.completeTask('build.ats');

    return enhancedUserInfo;
  } catch (error) {
    logger.error(`Error extracting enhanced user information: ${error.message}`);
    buildSummary.failTask('build.ats', error.message);
    throw error;
  }
}

/**
 * Enhance user information with OpenAI analysis
 * 
 * @param {string} textContent - The text content of the PDF
 * @param {Object} basicUserInfo - The basic user information
 * @returns {Promise<Object>} - Enhanced user information
 */
async function enhanceWithOpenAI(textContent, basicUserInfo) {
  try {
    // Analyze the resume with OpenAI
    const openAIResult = await analyzeResumeWithOpenAI(textContent, basicUserInfo);

    // Merge the basic user info with the OpenAI result
    const enhancedUserInfo = {
      ...basicUserInfo,
      ...openAIResult,
      // Ensure these fields are preserved from basic extraction if not provided by OpenAI
      name: openAIResult.name || basicUserInfo.name,
      firstName: openAIResult.firstName || basicUserInfo.firstName,
      lastName: openAIResult.lastName || basicUserInfo.lastName,
      fullName: openAIResult.fullName || basicUserInfo.fullName,
      filePrefix: openAIResult.filePrefix || basicUserInfo.filePrefix,
      resumeFileName: openAIResult.resumeFileName || basicUserInfo.resumeFileName,
      introductionFileName: openAIResult.introductionFileName || basicUserInfo.introductionFileName,
      // Add enhanced fields
      enhancedExtraction: true,
      extractionDate: new Date().toISOString(),
      extractionMethod: 'openai-enhanced-ats'
    };

    // Validate the enhanced user info
    validateUserInfo(enhancedUserInfo);

    return enhancedUserInfo;
  } catch (error) {
    logger.error(`Error enhancing user information with OpenAI: ${error.message}`);
    // Fall back to basic user info
    return {
      ...basicUserInfo,
      enhancedExtraction: false,
      extractionDate: new Date().toISOString(),
      extractionMethod: 'basic-ats-fallback',
      enhancementError: error.message
    };
  }
}

/**
 * Validate user information
 * 
 * @param {Object} userInfo - The user information to validate
 * @returns {Object} - Validated user information
 */
function validateUserInfo(userInfo) {
  // Ensure required fields exist
  const requiredFields = ['name', 'fullName', 'filePrefix', 'resumeFileName', 'introductionFileName'];
  for (const field of requiredFields) {
    if (!userInfo[field]) {
      logger.warning(`Missing required field: ${field}`);
      // Set default values for missing fields
      if (field === 'name' || field === 'fullName') {
        userInfo[field] = 'User';
      } else if (field === 'filePrefix') {
        userInfo[field] = 'user';
      } else if (field === 'resumeFileName') {
        userInfo[field] = 'resume';
      } else if (field === 'introductionFileName') {
        userInfo[field] = 'introduction';
      }
    }
  }

  // Validate and clean up skills array
  if (!Array.isArray(userInfo.skills)) {
    userInfo.skills = [];
  }
  userInfo.skills = userInfo.skills.filter(skill => typeof skill === 'string' && skill.trim() !== '');

  // Validate and clean up keywords array
  if (!Array.isArray(userInfo.keywords)) {
    userInfo.keywords = [];
  }
  userInfo.keywords = userInfo.keywords.filter(keyword => typeof keyword === 'string' && keyword.trim() !== '');

  return userInfo;
}

module.exports = {
  extractEnhancedUserInfo
};
