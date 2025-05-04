import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Define the backend for the AlexAI application
 * @see https://docs.amplify.aws/react/build-a-backend/ to add functions and more
 */
const backend = defineBackend({
  auth,
  data,
  storage
});

// Enable guest access for public PDF viewing
// Access the identity pool through cfnResources
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.allowUnauthenticatedIdentities = true;

// Export the backend
export { backend };
