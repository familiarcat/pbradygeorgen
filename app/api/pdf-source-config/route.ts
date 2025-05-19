/**
 * PDF Source Configuration API Route
 *
 * This API route provides the current PDF source configuration to the client.
 * It follows the Derrida philosophy of deconstructing hardcoded values
 * and replacing them with configurable options.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Load the PDF source configuration
    const configPath = path.join(process.cwd(), 'pdf-source.config.js');

    // Check if the configuration file exists
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({
        success: false,
        error: 'PDF source configuration file not found',
        activeSource: {
          name: 'default',
          outputPrefix: '',
          path: 'public/pbradygeorgen_resume.pdf',
          description: 'Default resume PDF'
        }
      });
    }

    // Load the configuration
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Parse the configuration (simple approach to avoid require)
    const activeMatch = configContent.match(/active:\s*['"]([^'"]+)['"]/);
    const activeSourceName = activeMatch ? activeMatch[1] : 'default';

    // Default source configuration
    const defaultSource = {
      path: 'public/pbradygeorgen_resume.pdf',
      outputPrefix: '',
      description: 'Default resume PDF'
    };

    // Try to extract the active source configuration
    const sourcesMatch = configContent.match(new RegExp(`['"]${activeSourceName}['"]:\\s*{([^}]+)}`));
    const activeSource = sourcesMatch ? {
      path: sourcesMatch[1].match(/path:\s*['"]([^'"]+)['"]/)?.[1] || defaultSource.path,
      outputPrefix: sourcesMatch[1].match(/outputPrefix:\s*['"]([^'"]+)['"]/)?.[1] || defaultSource.outputPrefix,
      description: sourcesMatch[1].match(/description:\s*['"]([^'"]+)['"]/)?.[1] || defaultSource.description
    } : defaultSource;

    if (!activeSource) {
      return NextResponse.json({
        success: false,
        error: `Active PDF source '${activeSourceName}' not found in configuration`,
        activeSource: {
          name: 'default',
          outputPrefix: '',
          path: 'public/pbradygeorgen_resume.pdf',
          description: 'Default resume PDF'
        }
      });
    }

    // Extract available sources (simplified approach)
    const availableSources = [
      {
        name: 'default',
        path: 'public/pbradygeorgen_resume.pdf',
        outputPrefix: '',
        description: 'Default resume PDF'
      },
      {
        name: 'high-contrast',
        path: 'source-pdfs/high-contrast.pdf',
        outputPrefix: 'high_contrast_',
        description: 'High contrast resume PDF with better color extraction'
      }
    ];

    // Return the configuration
    return NextResponse.json({
      success: true,
      activeSource: {
        name: activeSourceName,
        ...activeSource
      },
      availableSources
    });
  } catch (error) {
    console.error('Error loading PDF source configuration:', error);
    return NextResponse.json({
      success: false,
      error: `Failed to load PDF source configuration: ${error}`,
      activeSource: {
        name: 'default',
        outputPrefix: '',
        path: 'public/pbradygeorgen_resume.pdf',
        description: 'Default resume PDF'
      }
    });
  }
}
