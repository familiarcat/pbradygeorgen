// utils/environment.ts
export const isLocalEnvironment = (): boolean => {
  // Adjust this check based on your environment detection logic.
  // This is a simple example assuming you have a variable set in your environment
  return process.env.NODE_ENV === "development"
}
