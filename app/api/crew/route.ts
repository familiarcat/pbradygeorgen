// app/api/crew/route.ts
import { NextResponse } from 'next/server'
import { Database } from 'arangojs'

const ARANGODB_HOST = process.env.ARANGODB_HOST || 'http://localhost:8529'
const ARANGODB_USERNAME = process.env.ARANGODB_USERNAME || 'root'
const ARANGODB_PASSWORD = process.env.ARANGODB_PASSWORD || 'alexai2025'
function normalizeHost(host: string): string {
  return host.startsWith('http://') || host.startsWith('https://') ? host : `http://${host}`;
}
const db = new Database({ url: normalizeHost(ARANGODB_HOST), databaseName: "_system" })
db.useBasicAuth(ARANGODB_USERNAME, ARANGODB_PASSWORD)
// useDatabase removed: now configured in constructor

export async function GET() {
  try {
    const cursor = await db.query(`
      FOR doc IN katras
        RETURN {
          name: doc.name,
          role: doc.role,
          rank: doc.rank,
          id: doc._key
        }
    `)
    const crew = await cursor.all()
    return NextResponse.json({ crew })
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    )
  }
}
