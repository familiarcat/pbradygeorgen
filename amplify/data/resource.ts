import { defineData } from '@aws-amplify/backend';
import { type ClientSchema } from '@aws-amplify/backend/data';

/**
 * Define your data model
 */
const schema: ClientSchema = {
  // Define the 'Storage' resource for PDF files and processed content
  Storage: {
    // Define the S3 bucket for PDF storage
    pdfStorage: {
      type: 's3',
      access: ['create', 'read', 'update', 'delete'],
      ownedBy: 'creator',
    },
  },
};

/**
 * Configure your data resource
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
