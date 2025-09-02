"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const DanteLogger_1 = require("@/utils/DanteLogger");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function POST(request) {
    try {
        // Parse the multipart form data
        const formData = await request.formData();
        const pdfFile = formData.get('pdf');
        const useDefault = formData.get('useDefault') === 'true';
        if (!pdfFile && !useDefault) {
            DanteLogger_1.DanteLogger.error.validation('No PDF file provided in upload request');
            return server_1.NextResponse.json({ success: false, error: 'No PDF file provided' }, { status: 400 });
        }
        // If useDefault is true, process the default PDF file
        if (useDefault) {
            try {
                const defaultPdfPath = path_1.default.join(process.cwd(), 'public', 'pbradygeorgen_resume.pdf');
                // Run the extraction script on the default PDF
                await execAsync(`node scripts/extract-pdf-text-improved.js "${defaultPdfPath}"`);
                DanteLogger_1.DanteLogger.success.core('Default PDF content extracted successfully');
                // Return success response for default PDF
                return server_1.NextResponse.json({
                    success: true,
                    pdfUrl: '/pbradygeorgen_resume.pdf',
                    fileName: 'pbradygeorgen_resume.pdf',
                    originalName: 'pbradygeorgen_resume.pdf',
                    isDefault: true
                });
            }
            catch (error) {
                DanteLogger_1.DanteLogger.error.dataFlow('Error processing default PDF content', { error });
                console.error('Error processing default PDF content:', error);
                return server_1.NextResponse.json({ success: false, error: 'Failed to process default PDF' }, { status: 500 });
            }
        }
        // Validate file type
        if (!pdfFile.type.includes('pdf')) {
            DanteLogger_1.DanteLogger.error.validation('Invalid file type uploaded', { type: pdfFile.type });
            return server_1.NextResponse.json({ success: false, error: 'File must be a PDF' }, { status: 400 });
        }
        // Create a safe filename
        const originalName = pdfFile.name;
        const safeFileName = originalName
            .replace(/[^a-zA-Z0-9_.-]/g, '_')
            .toLowerCase();
        // Create the uploads directory if it doesn't exist
        const uploadsDir = path_1.default.join(process.cwd(), 'public', 'uploads');
        if (!(0, fs_1.existsSync)(uploadsDir)) {
            await (0, promises_1.mkdir)(uploadsDir, { recursive: true });
        }
        // Create a unique filename with timestamp
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${safeFileName}`;
        const filePath = path_1.default.join(uploadsDir, uniqueFileName);
        // Convert the file to a Buffer and write it to disk
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        await (0, promises_1.writeFile)(filePath, buffer);
        DanteLogger_1.DanteLogger.success.basic('PDF file saved successfully', { path: filePath });
        // Create a URL for the uploaded file
        const pdfUrl = `/uploads/${uniqueFileName}`;
        // Process the PDF to extract content
        try {
            // Create the extracted directory if it doesn't exist
            const extractedDir = path_1.default.join(process.cwd(), 'public', 'extracted');
            if (!(0, fs_1.existsSync)(extractedDir)) {
                await (0, promises_1.mkdir)(extractedDir, { recursive: true });
            }
            // Run the extraction script
            await execAsync(`node scripts/extract-pdf-text-improved.js "${filePath}"`);
            DanteLogger_1.DanteLogger.success.core('PDF content extracted successfully');
            // Generate improved markdown
            const extractedTextPath = path_1.default.join(process.cwd(), 'public', 'extracted', 'resume_content.txt');
            await execAsync(`node scripts/generate-improved-markdown.js "${extractedTextPath}"`);
            DanteLogger_1.DanteLogger.success.core('Improved markdown generated successfully');
        }
        catch (error) {
            // Log the error but don't fail the upload
            DanteLogger_1.DanteLogger.error.dataFlow('Error processing PDF content', { error });
            console.error('Error processing PDF content:', error);
        }
        return server_1.NextResponse.json({
            success: true,
            pdfUrl,
            fileName: uniqueFileName,
            originalName
        });
    }
    catch (error) {
        console.error('Error handling PDF upload:', error);
        DanteLogger_1.DanteLogger.error.system('Error handling PDF upload', { error });
        return server_1.NextResponse.json({ success: false, error: 'Failed to process PDF upload' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map