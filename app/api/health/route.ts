// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

const ARANGODB_HOST = process.env.ARANGODB_HOST || 'http://3.128.25.123:8529'
const KATRA_DIR = path.resolve(process.cwd(), 'alexai/katras')

export async function GET() {
  const health: Record<string, any> = {
    openai: 'unknown',
    arangodb: 'unknown',
    katras: 'unknown',
  }

  // === Check OpenAI API Key ===
  if (process.env.OPENAI_API_KEY) {
    health.openai = 'available'
  } else {
    health.openai = 'missing'
  }

  // === Ping ArangoDB ===
  try {
    const res = await fetch(`${ARANGODB_HOST}/_api/version`)
    const data = await res.json()
    health.arangodb = data.version || 'responding'
  } catch (err) {
    health.arangodb = 'unreachable'
  }

  // === Count Katras ===
  try {
    const files = await readdir(KATRA_DIR)
    const katraCount = files.filter(f => f.endsWith('.json')).length
    health.katras = `${katraCount} found`
  } catch (err) {
    health.katras = 'inaccessible'
  }

  return NextResponse.json(health)
}
