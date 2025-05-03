/**
 * Amplify client configuration
 * This file configures the Amplify client for use in the browser and server environments
 */

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, downloadData, remove } from 'aws-amplify/storage';
import config from '../amplifyconfiguration.json';

/**
 * Server-side Amplify configuration
 */
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

/**
 * Client for API operations
 */
export const client = generateClient();

/**
 * Storage operations
 */
export const storage = {
  /**
   * Upload a file to S3
   * @param key The S3 key
   * @param data The file data
   * @param options Upload options
   * @returns The upload result
   */
  upload: async (key: string, data: File | Blob | Buffer, options?: any) => {
    return uploadData({
      key,
      data,
      options,
    });
  },

  /**
   * Get a URL for a file in S3
   * @param key The S3 key
   * @param options URL options
   * @returns The URL result
   */
  getUrl: async (key: string, options?: any) => {
    return getUrl({
      key,
      options,
    });
  },

  /**
   * Download a file from S3
   * @param key The S3 key
   * @param options Download options
   * @returns The download result
   */
  download: async (key: string, options?: any) => {
    return downloadData({
      key,
      options,
    });
  },

  /**
   * Remove a file from S3
   * @param key The S3 key
   * @param options Remove options
   * @returns The remove result
   */
  remove: async (key: string, options?: any) => {
    return remove({
      key,
      options,
    });
  },
};
