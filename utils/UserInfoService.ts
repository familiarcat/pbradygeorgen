/**
 * User Information Service
 *
 * This service provides access to user information extracted from the PDF.
 * It loads the user_info.json file and provides methods to access the data.
 */

import fs from 'fs';
import path from 'path';
import { DanteLogger } from './DanteLogger';

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
 * Load user information from the JSON file
 *
 * @returns {UserInfo} User information
 */
export function loadUserInfo(): UserInfo {
  try {
    // Path to the user information file
    const userInfoPath = path.join(process.cwd(), 'public', 'extracted', 'user_info.json');

    // Check if the file exists
    if (!fs.existsSync(userInfoPath)) {
      console.warn('User information file not found, using default values');
      return defaultUserInfo;
    }

    // Read and parse the file
    const userInfoData = fs.readFileSync(userInfoPath, 'utf8');
    const userInfo = JSON.parse(userInfoData) as UserInfo;

    console.log('User information loaded successfully');
    return userInfo;
  } catch (error) {
    console.error('Error loading user information', error);
    return defaultUserInfo;
  }
}

/**
 * Get the user's full name
 *
 * @returns {string} User's full name
 */
export function getUserName(): string {
  return loadUserInfo().fullName;
}

/**
 * Get the user's first name
 *
 * @returns {string} User's first name
 */
export function getFirstName(): string {
  return loadUserInfo().firstName;
}

/**
 * Get the user's last name
 *
 * @returns {string} User's last name
 */
export function getLastName(): string {
  return loadUserInfo().lastName;
}

/**
 * Get the file prefix for the user
 *
 * @returns {string} File prefix
 */
export function getFilePrefix(): string {
  return loadUserInfo().filePrefix;
}

/**
 * Get the resume file name
 *
 * @returns {string} Resume file name
 */
export function getResumeFileName(): string {
  return loadUserInfo().resumeFileName;
}

/**
 * Get the introduction file name
 *
 * @returns {string} Introduction file name
 */
export function getIntroductionFileName(): string {
  return loadUserInfo().introductionFileName;
}

/**
 * Get the user's email
 *
 * @returns {string} User's email
 */
export function getUserEmail(): string {
  return loadUserInfo().email;
}

/**
 * Get the user's phone number
 *
 * @returns {string} User's phone number
 */
export function getUserPhone(): string {
  return loadUserInfo().phone;
}

/**
 * Get the user's location
 *
 * @returns {string} User's location
 */
export function getUserLocation(): string {
  return loadUserInfo().location;
}

/**
 * Get the user's professional title
 *
 * @returns {string} User's title
 */
export function getUserTitle(): string {
  return loadUserInfo().title;
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
