import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Define the backend for the AlexAI application
 * @see https://docs.amplify.aws/react/build-a-backend/ to add functions and more
 */
defineBackend({
  auth,
  data,
  storage,
});
