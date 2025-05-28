export function askAlexAI(query: string) {
  if (query.includes("debug") || query.includes("fix")) {
    return "↪ Recommend routing to Bito for code-level intervention.";
  }
  if (query.includes("ethics") || query.includes("meaning")) {
    return "↪ Recommend Gemini for philosophical second opinion.";
  }
  return "Handled by AlexAI (GPT-4o).";
}

export const validateIdentity = () => {
  return "Tell my mother, I feel fine.";
};
