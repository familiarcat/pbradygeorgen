#!/bin/bash

# apply_crew_consensus_patch.sh
# 🛠️ Applies consensus patch from Observation Lounge crew
# 🔐 Hardens API access and removes frontend secrets
# 🧠 Reinforces Katra sync logic
# 👨‍🔧 Authored by Chief O'Brien

LOG_DIR="logs"
LOG_FILE="$LOG_DIR/crew_patch.log"
BACKUP_DIR="backups"

mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

log() {
  echo "[$(date +'%F %T')] $1" | tee -a "$LOG_FILE"
}

backup_file() {
  local file="$1"
  if [ -f "$file" ]; then
    cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
    log "🧾 Backed up $file"
  fi
}

patch_layout_tsx() {
  local file="app/layout.tsx"
  backup_file "$file"

  if grep -q "OPENAI_API_KEY" "$file"; then
    sed -i '' '/OPENAI_API_KEY/d' "$file"
    log "🧼 Removed OPENAI_API_KEY reference from $file @Crusher"
  fi
}

patch_openai_usage() {
  local file="app/page.tsx"
  backup_file "$file"

  if grep -q "new OpenAI" "$file"; then
    sed -i '' 's/new OpenAI.*/fetch("\/api\/generate-summary", { method: "POST" })/' "$file"
    log "🧠 Replaced OpenAI instantiation with internal fetch @Spock"
  fi
}

ensure_summary_api() {
  local dir="app/api/generate-summary"
  local route_file="$dir/route.ts"
  mkdir -p "$dir"

  if [ ! -f "$route_file" ]; then
    cat > "$route_file" <<EOF
// @Spock @Crusher
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content } = body
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content }]
  })
  return NextResponse.json({ result: response.choices[0].message.content })
}
EOF
    log "🔧 Created generate-summary/route.ts @Spock"
  fi
}

patch_all() {
  patch_layout_tsx
  patch_openai_usage
  ensure_summary_api
  log "✅ All consensus patches applied."
}

patch_all
