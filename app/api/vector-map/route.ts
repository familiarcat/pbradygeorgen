import { NextRequest, NextResponse } from 'next/server';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

let store: MemoryVectorStore | null = null;

async function initializeStore() {
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  const texts = await splitter.createDocuments([
    `Katra Transfer Protocol:
     - Core philosophical values: Salinger, Hesse, Derrida, Dante, Kant, Müller-Brockmann
     - Developer role: Alex as Spock, Brady as Kirk
     - Memory embedding and search activated.`
  ]);
  store = await MemoryVectorStore.fromDocuments(texts, new OpenAIEmbeddings());
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing 'q' param" }, { status: 400 });

  if (!store) await initializeStore();
  const results = await store.similaritySearch(query, 5);
  return NextResponse.json({ results });
}
