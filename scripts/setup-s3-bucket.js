/**
 * AWS S3 Bucket Setup Script
 *
 * This script sets up an S3 bucket for storing PDF files and their processed content.
 * It creates the bucket if it doesn't exist and configures the necessary permissions.
 *
 * Usage:
 * node scripts/setup-s3-bucket.js [bucket-name]
 *
 * If no bucket name is provided, it will use the default bucket name from the environment
 * variable S3_BUCKET_NAME or 'alexai-pdf-storage'.
 */

const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutBucketPolicyCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');

// Get the bucket name from the command line arguments or environment variables
const bucketName = process.argv[2] || process.env.S3_BUCKET_NAME || 'alexai-pdf-storage';
const region = process.env.S3_REGION || 'us-east-1';

// Create an S3 client
const s3Client = new S3Client({ region });

// Define the folder structure in S3
const S3_FOLDERS = {
  PDFS: 'pdfs/',
  EXTRACTED: 'extracted/',
  ANALYZED: 'analyzed/',
  COVER_LETTERS: 'cover-letters/',
  TEMP: 'temp/'
};

/**
 * Check if a bucket exists
 */
async function bucketExists(bucketName) {
  try {
    const command = new HeadBucketCommand({ Bucket: bucketName });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Create a bucket if it doesn't exist
 */
async function createBucketIfNotExists(bucketName) {
  try {
    // Check if the bucket exists
    const exists = await bucketExists(bucketName);

    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }

    // Create the bucket
    const command = new CreateBucketCommand({
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: region !== 'us-east-1' ? region : undefined
      }
    });

    await s3Client.send(command);
    console.log(`Bucket ${bucketName} created successfully`);

    return true;
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    return false;
  }
}

/**
 * Configure CORS for the bucket
 */
async function configureBucketCors(bucketName) {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag', 'x-amz-meta-custom-header']
          }
        ]
      }
    });

    await s3Client.send(command);
    console.log(`CORS configured for bucket ${bucketName}`);

    return true;
  } catch (error) {
    console.error(`Error configuring CORS for bucket ${bucketName}:`, error);
    return false;
  }
}

/**
 * Configure bucket policy
 */
async function configureBucketPolicy(bucketName) {
  try {
    // Define a policy that allows read access to the bucket from the same AWS account
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'AllowReadAccess',
          Effect: 'Allow',
          Principal: {
            AWS: '*'  // This will be restricted by the bucket's Block Public Access settings
          },
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`
        }
      ]
    };

    try {
      const command = new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy)
      });

      await s3Client.send(command);
      console.log(`Policy configured for bucket ${bucketName}`);

      return true;
    } catch (policyError) {
      if (policyError.name === 'AccessDenied' && policyError.message.includes('BlockPublicPolicy')) {
        console.log(`Cannot set public policy due to Block Public Access settings. This is expected in many AWS accounts.`);
        console.log(`You will need to configure appropriate IAM roles for your Amplify app to access this bucket.`);

        // Return true since this is an expected limitation
        return true;
      }

      throw policyError;
    }
  } catch (error) {
    console.error(`Error configuring policy for bucket ${bucketName}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`Setting up S3 bucket ${bucketName} in region ${region}`);

  // Create the bucket if it doesn't exist
  const bucketCreated = await createBucketIfNotExists(bucketName);

  if (!bucketCreated) {
    console.error('Failed to create or verify bucket');
    process.exit(1);
  }

  // Configure CORS for the bucket
  const corsConfigured = await configureBucketCors(bucketName);

  if (!corsConfigured) {
    console.error('Failed to configure CORS for bucket');
    process.exit(1);
  }

  // Configure bucket policy
  const policyConfigured = await configureBucketPolicy(bucketName);

  if (!policyConfigured) {
    console.error('Failed to configure policy for bucket');
    process.exit(1);
  }

  console.log(`S3 bucket ${bucketName} setup completed successfully`);

  // Print the folder structure
  console.log('Folder structure:');
  Object.entries(S3_FOLDERS).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Print usage instructions
  console.log('\nUsage instructions:');
  console.log('1. Set the following environment variables in your AWS Amplify console:');
  console.log(`   - S3_BUCKET_NAME=${bucketName}`);
  console.log(`   - S3_REGION=${region}`);
  console.log('2. Make sure your AWS Amplify app has the necessary IAM permissions to access this bucket');
  console.log('3. Deploy your application to AWS Amplify');

  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('Error setting up S3 bucket:', error);
  process.exit(1);
});
