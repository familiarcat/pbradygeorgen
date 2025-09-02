"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const child_process_1 = require("child_process");
async function POST(request) {
    try {
        console.log('🎭 Opening Playwright UI...');
        // Start Playwright UI in a separate process
        const childProcess = (0, child_process_1.spawn)('npx', ['playwright', 'show-report'], {
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
        return server_1.NextResponse.json({
            success: true,
            message: 'Playwright UI is starting...',
            url: 'http://localhost:9323', // Default Playwright report server
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Failed to open Playwright UI:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map