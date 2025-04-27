import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import ServerThemeProvider from './ServerThemeProvider';

const execAsync = promisify(exec);

async function loadInitialTheme() {
  try {
    // Check if the extracted files exist
    const publicDir = path.join(process.cwd(), 'public');
    const extractedDir = path.join(publicDir, 'extracted');
    const colorInfoPath = path.join(extractedDir, 'color_theme.json');
    const fontInfoPath = path.join(extractedDir, 'font_info.json');
    const pdfPath = path.join(publicDir, 'default_resume.pdf');
    
    // Create the extracted directory if it doesn't exist
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
    }
    
    // Check if we need to extract the theme
    let needsExtraction = false;
    
    if (!fs.existsSync(colorInfoPath) || !fs.existsSync(fontInfoPath)) {
      needsExtraction = true;
    } else {
      // Check if the PDF is newer than the extracted files
      const pdfStats = fs.statSync(pdfPath);
      const colorStats = fs.statSync(colorInfoPath);
      const fontStats = fs.statSync(fontInfoPath);
      
      if (pdfStats.mtime > colorStats.mtime || pdfStats.mtime > fontStats.mtime) {
        needsExtraction = true;
      }
    }
    
    // Extract the theme if needed
    if (needsExtraction) {
      console.log('Extracting theme on server...');
      
      // Run the extraction scripts
      await execAsync(`node scripts/extract-pdf-fonts.js "${pdfPath}"`);
      await execAsync(`node scripts/extract-pdf-colors.js "${pdfPath}"`);
    }
    
    // Read the extracted theme
    let colorTheme = {};
    let fontInfo = {};
    
    if (fs.existsSync(colorInfoPath)) {
      const colorData = fs.readFileSync(colorInfoPath, 'utf8');
      colorTheme = JSON.parse(colorData);
    }
    
    if (fs.existsSync(fontInfoPath)) {
      const fontData = fs.readFileSync(fontInfoPath, 'utf8');
      fontInfo = JSON.parse(fontData);
    }
    
    // Read the name from the extracted markdown
    let name = 'Professional Resume';
    const markdownPath = path.join(extractedDir, 'resume_content.md');
    
    if (fs.existsSync(markdownPath)) {
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      const nameMatch = markdownContent.match(/^# (.+)$/m);
      
      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1];
      }
    }
    
    return {
      name,
      colorTheme,
      fontInfo,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error loading initial theme:', error);
    return null;
  }
}

export default async function InitialThemeLoader({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const initialTheme = await loadInitialTheme();
  
  return (
    <ServerThemeProvider initialTheme={initialTheme}>
      {children}
    </ServerThemeProvider>
  );
}
