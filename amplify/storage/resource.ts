import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'alexai-storage',
  access: (allow) => {
    allow.guest().to(['read']);
    allow.authenticated().to(['create', 'read', 'update', 'delete']);
  },
});
