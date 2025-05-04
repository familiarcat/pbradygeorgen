import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Define the data schema for the AlexAI application
 * This schema includes models for PDF files and their processed content
 */
const schema = a.schema({
  // PDF file model to store information about uploaded PDF files
  PDFFile: a
    .model({
      // Basic file information
      name: a.string().required(),
      path: a.string().required(),
      size: a.integer().required(),
      contentType: a.string().required(),
      contentFingerprint: a.string().required(),

      // Extracted and analyzed content
      extractedContent: a.string(),
      analyzedContent: a.string(),

      // Processed formats
      textFormat: a.string(),
      markdownFormat: a.string(),
      jsonFormat: a.string(),
      htmlFormat: a.string(),

      // Cover letter formats
      coverLetterMarkdown: a.string(),
      coverLetterHtml: a.string(),

      // Metadata
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      processingStatus: a.string(),
      processingErrors: a.string(),
    })
    .authorization((allow) => [
      // Allow guests to read PDF files
      allow.guest().to(['read']),
      // Allow authenticated users to create, read, update, and delete PDF files
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
    ]),

  // Download report model to store information about download tests
  DownloadReport: a
    .model({
      timestamp: a.datetime().required(),
      formatCount: a.integer().required(),
      totalSize: a.integer().required(),
      allFormatsAvailable: a.boolean().required(),
      formats: a.string().required(), // JSON string of available formats
    })
    .authorization((allow) => [
      // Allow guests to read download reports
      allow.guest().to(['read']),
      // Allow authenticated users to create, read, update, and delete download reports
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
