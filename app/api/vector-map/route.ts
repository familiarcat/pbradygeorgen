import { NextRequest, NextResponse } from 'next/server';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

let store: MemoryVectorStore | null = null;

async function initializeStore() {
  if (store) return; // Don't reinitialize if store already exists
  
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const texts = await splitter.createDocuments([
    `Katra Transfer Protocol:
     - Core philosophical values: Salinger, Hesse, Derrida, Dante, Kant, Müller-Brockmann
     - Developer role: Alex as Spock, Brady as Kirk
     - Memory embedding and search activated.`
  ]);
  store = await MemoryVectorStore.fromDocuments(texts, new OpenAIEmbeddings());
}

// Function to get the store instance
function getStore(): MemoryVectorStore | null {
  return store;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing 'q' param" }, { status: 400 });

  await initializeStore();
const liveStore = getStore();

  if (!liveStore) {
    throw new Error("Vector store is not available after initialization");
  }

  const results = await liveStore.similaritySearch(query, 5);
  return NextResponse.json({ results });
}
