import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { storage } from './storage/resource';

/**
 * Define your backend
 */
export const backend = defineBackend({
  data,
  auth,
  storage,
});
