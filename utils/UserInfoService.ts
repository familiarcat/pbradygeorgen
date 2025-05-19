/**
 * User Information Service
 *
 * This service provides access to user information extracted from the PDF.
 * It loads the user_info.json file and provides methods to access the data.
 */

import fs from 'fs';
import path from 'path';
import { DanteLogger } from './DanteLogger';
import { getS3Object } from './s3-utils';
import { Result } from './result';

// Define the user information interface
export interface UserInfo {
  name: string;
  firstName: string;
  lastName: string;
  fullName: string;
  filePrefix: string;
  resumeFileName: string;
  introductionFileName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  extractionDate: string;
}

// Default user information
const defaultUserInfo: UserInfo = {
  name: 'User',
  firstName: 'User',
  lastName: '',
  fullName: 'User',
  filePrefix: 'user',
  resumeFileName: 'resume',
  introductionFileName: 'introduction',
  email: '',
  phone: '',
  location: '',
  title: '',
  extractionDate: new Date().toISOString()
};

/**
 * Load user information from the JSON file or S3
 *
 * @returns {UserInfo} User information
 */
export async function loadUserInfo(): Promise<UserInfo> {
  try {
    // First try to get the user info from S3
    try {
      const s3Result = await getS3Object('user_info.json');

      if (s3Result.success) {
        DanteLogger.success.basic('User information loaded successfully from S3');
        const userInfo = JSON.parse(s3Result.data) as UserInfo;
        return userInfo;
      }
    } catch (s3Error) {
      DanteLogger.error.runtime(`Error loading user information from S3: ${s3Error}`);
    }

    // If S3 fails, try to load from the local file system
    try {
      // Path to the user information file
      const userInfoPath = path.join(process.cwd(), 'public', 'extracted', 'user_info.json');

      // Check if the file exists
      if (!fs.existsSync(userInfoPath)) {
        DanteLogger.error.runtime('User information file not found, using default values');
        return defaultUserInfo;
      }

      // Read and parse the file
      const userInfoData = fs.readFileSync(userInfoPath, 'utf8');
      const userInfo = JSON.parse(userInfoData) as UserInfo;

      DanteLogger.success.basic('User information loaded successfully from file system');
      return userInfo;
    } catch (fsError) {
      DanteLogger.error.runtime(`Error loading user information from file system: ${fsError}`);
      return defaultUserInfo;
    }
  } catch (error) {
    DanteLogger.error.runtime(`Error loading user information: ${error}`);
    return defaultUserInfo;
  }
}

/**
 * Get the user's full name
 *
 * @returns {Promise<string>} User's full name
 */
export async function getUserName(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.fullName;
}

/**
 * Get the user's first name
 *
 * @returns {Promise<string>} User's first name
 */
export async function getFirstName(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.firstName;
}

/**
 * Get the user's last name
 *
 * @returns {Promise<string>} User's last name
 */
export async function getLastName(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.lastName;
}

/**
 * Get the file prefix for the user
 *
 * @returns {Promise<string>} File prefix
 */
export async function getFilePrefix(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.filePrefix;
}

/**
 * Get the resume file name
 *
 * @returns {Promise<string>} Resume file name
 */
export async function getResumeFileName(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.resumeFileName;
}

/**
 * Get the introduction file name
 *
 * @returns {Promise<string>} Introduction file name
 */
export async function getIntroductionFileName(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.introductionFileName;
}

/**
 * Get the user's email
 *
 * @returns {Promise<string>} User's email
 */
export async function getUserEmail(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.email;
}

/**
 * Get the user's phone number
 *
 * @returns {Promise<string>} User's phone number
 */
export async function getUserPhone(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.phone;
}

/**
 * Get the user's location
 *
 * @returns {Promise<string>} User's location
 */
export async function getUserLocation(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.location;
}

/**
 * Get the user's professional title
 *
 * @returns {Promise<string>} User's title
 */
export async function getUserTitle(): Promise<string> {
  const userInfo = await loadUserInfo();
  return userInfo.title;
}

// Export the UserInfoService
const UserInfoService = {
  loadUserInfo,
  getUserName,
  getFirstName,
  getLastName,
  getFilePrefix,
  getResumeFileName,
  getIntroductionFileName,
  getUserEmail,
  getUserPhone,
  getUserLocation,
  getUserTitle
};

export default UserInfoService;
