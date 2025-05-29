import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const store = new MemoryVectorStore(new OpenAIEmbeddings());

export async function addMemory(id: string, content: string) {
  await store.addDocuments([{ pageContent: content, metadata: { id } }]);
}

export async function searchMemory(query: string) {
  return store.similaritySearch(query, 3);
}
