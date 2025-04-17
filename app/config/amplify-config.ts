// Mock Amplify configuration for web deployment

// Create mock objects to prevent errors
const createMockAmplify = () => {
  return {
    Auth: {
      currentAuthenticatedUser: () => Promise.resolve(null),
      signIn: () => Promise.resolve(null),
      signOut: () => Promise.resolve(),
    },
    Hub: {
      listen: () => {
        return () => {}; // Return a no-op cleanup function
      }
    },
    API: {
      graphql: () => Promise.resolve({}),
      get: () => Promise.resolve({}),
      post: () => Promise.resolve({}),
    },
    Storage: {
      get: () => Promise.resolve(null),
      put: () => Promise.resolve(null),
    }
  };
};

// Export a mock Amplify object
export const Amplify = createMockAmplify();

// Initialize Amplify (mock version for web)
export const configureAmplify = () => {
  try {
    console.log('Using mock Amplify configuration for web deployment');
    // Do nothing - we're using the mock objects instead
  } catch (error) {
    console.error('Error in mock Amplify configuration:', error);
  }
};
