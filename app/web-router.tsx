import React, { useEffect } from 'react';
import { ResumeScreen } from './screens/ResumeScreen';

/**
 * A simple router component for web that redirects to ResumeScreen
 * This ensures that the root URL (pbradygeorgen.com) shows the ResumeScreen
 */
export const WebRouter = () => {
  useEffect(() => {
    console.log('WebRouter mounted - redirecting to ResumeScreen');
  }, []);

  // Simply render the ResumeScreen directly
  return <ResumeScreen navigation={undefined as any} />;
};
