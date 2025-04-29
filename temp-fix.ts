// Test function with proper try-catch structure
async function testFunction(): Promise<any> {
  try {
    // First try block
    const result1 = await someAsyncFunction();
    return result1;
  } catch (error) {
    console.error('Error in first try block:', error);
  }

  // Second try block outside the first one
  try {
    const result2 = await anotherAsyncFunction();
    return result2;
  } catch (error) {
    console.error('Error in second try block:', error);
    return { error: 'Failed' };
  }
}

// Mock functions
async function someAsyncFunction() {
  return { success: true };
}

async function anotherAsyncFunction() {
  return { success: true };
}
