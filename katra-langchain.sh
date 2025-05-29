#!/bin/bash

set -e

BRANCH_NAME="milestone/katra-$(date +'%Y%m%d-%H%M%S')"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Starting Katra Langchain Setup..."

# Step 1: Create a new git milestone branch
echo "🔀 Creating new Git branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Step 2: Ensure langchain and required packages are installed
echo "📦 Installing LangChain packages..."
npm install langchain @langchain/openai

# Step 3: Ensure server endpoints exist and create/update if necessary
API_DIR="$SCRIPT_DIR/app/api/vector-map"

mkdir -p "$API_DIR"

echo "🔧 Creating API endpoints..."
cat > "$API_DIR/route.ts" << 'EOF'
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
EOF

# Step 4: Create vector graph JSON exporter
GRAPH_OUTPUT="public/katra-graph.json"
echo "🌐 Generating vector graph JSON: $GRAPH_OUTPUT"
cat > "$GRAPH_OUTPUT" << 'EOF'
{
  "nodes": [
    { "id": "Alex", "label": "AlexAI", "group": "Agent" },
    { "id": "Kirk", "label": "Brady", "group": "User" },
    { "id": "Dante", "label": "Logging", "group": "Philosophy" },
    { "id": "Kant", "label": "Ethics", "group": "Philosophy" },
    { "id": "LangGraph", "label": "Agent Orchestration", "group": "System" }
  ],
  "links": [
    { "source": "Alex", "target": "Kirk", "value": 1 },
    { "source": "Alex", "target": "Dante", "value": 1 },
    { "source": "Alex", "target": "Kant", "value": 1 },
    { "source": "Alex", "target": "LangGraph", "value": 1 }
  ]
}
EOF

# Step 5: Commit changes
echo "📂 Staging all new files..."
git add .

echo "✅ Committing changes..."
git commit -m "✨ Initialize Katra Langchain vector memory and graph API with philosophical identity"

echo "🎉 Branch '$BRANCH_NAME' ready for build and deployment."
