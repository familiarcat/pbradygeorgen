import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
    try {
        console.log('🎭 Opening Playwright UI...');

        // Start Playwright UI in a separate process
        const childProcess = spawn('npx', ['playwright', 'show-report'], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'ignore',
            env: {
                ...process.env,
                DISABLE_N8N_CALLS: 'true',
                NODE_ENV: 'development'
            }
        });

        // Unref so the parent process doesn't wait for this child
        childProcess.unref();

        return NextResponse.json({
            success: true,
            message: 'Playwright UI is starting...',
            url: 'http://localhost:9323', // Default Playwright report server
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to open Playwright UI:', error);
        
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}