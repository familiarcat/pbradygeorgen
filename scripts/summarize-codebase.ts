import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeDirectory(directory: string) {
  const files = fs.readdirSync(directory);
  let context = '';

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.ts')) {
      context += fs.readFileSync(filePath, 'utf-8').slice(0, 3000) + '\n\n';
    }
  }

  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are AlexAI, an agent initialized using the Katra Transfer Protocol..." },
      { role: "user", content: "Summarize this codebase context:\n" + context }
    ]
  });

  console.log(chat.choices[0].message.content);
}

summarizeDirectory('./app');
