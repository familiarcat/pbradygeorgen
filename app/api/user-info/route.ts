/**
 * User Information API Route
 *
 * This API route provides access to the user information extracted from the PDF.
 * It loads the user_info.json file and returns the data.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DanteLogger } from '@/utils/DanteLogger';
import UserInfoService, { UserInfo } from '@/utils/UserInfoService';

/**
 * GET handler for the user-info API route
 *
 * @param request The Next.js request object
 * @returns JSON response with user information
 */
export async function GET(request: NextRequest) {
  try {
    // Load user information
    const userInfo = UserInfoService.loadUserInfo();

    // Return the user information
    return NextResponse.json({
      success: true,
      userInfo
    });
  } catch (error) {
    // Log the error
    console.error('Error loading user information', error);

    // Return default user information
    return NextResponse.json({
      success: false,
      error: 'Failed to load user information',
      userInfo: {
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
      }
    });
  }
}
