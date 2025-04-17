import { Amplify } from 'aws-amplify';

// Initialize Amplify
export const configureAmplify = () => {
  try {
    console.log('Configuring Amplify...');

    // Manual configuration for Amplify
    const amplifyConfig = {
      Auth: {
        // Disable Auth for web deployment
        // region: 'us-east-2',
        // userPoolId: 'us-east-2_xxxxxxxx',
        // userPoolWebClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      API: {
        GraphQL: {
          endpoint: 'https://fcfpzqv5v5e3fjcpvftgfq2i3i.appsync-api.us-east-2.amazonaws.com/graphql',
          region: 'us-east-2',
          apiKey: 'da2-7n7st4as4vbf7i3cx6amixuxiu',
          defaultAuthMode: 'apiKey',
        }
      },
      Storage: {
        // Configure S3 if needed
      }
    };

    Amplify.configure(amplifyConfig);
    console.log('Amplify configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
};
