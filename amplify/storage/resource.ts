import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'alexai-storage',
  access: (allow) => ({
    // Allow guest access for public PDF viewing
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Allow authenticated users to access their private files
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});
