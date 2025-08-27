'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PDFUploader from '@/components/PDFUploader';
import { DanteLogger } from '@/utils/DanteLogger';

// Define test PDF categories and files
const TEST_PDFS = {
  color: [
    { id: 'monochromatic', name: 'Monochromatic Design', description: 'Single color family with various shades' },
    { id: 'high-contrast', name: 'High Contrast Design', description: 'Bold contrasting colors with clear separation' },
    { id: 'gradient', name: 'Gradient-Heavy Design', description: 'Multiple gradients throughout the document' },
  ],
  typography: [
    { id: 'serif', name: 'Serif-Based Design', description: 'Traditional serif fonts with formal layout' },
    { id: 'sans-serif', name: 'Sans-Serif Minimalist', description: 'Clean sans-serif fonts with varied weights' },
    { id: 'mixed-typography', name: 'Mixed Typography', description: 'Combination of serif, sans-serif, and decorative fonts' },
  ],
  layout: [
    { id: 'single-column', name: 'Single-Column Traditional', description: 'Classic single-column resume layout' },
    { id: 'multi-column', name: 'Multi-Column Complex', description: 'Two or three column layout with sidebar elements' },
    { id: 'infographic', name: 'Infographic Style', description: 'Visual elements integrated with text' },
  ],
  special: [
    { id: 'image-heavy', name: 'Image-Heavy Design', description: 'Profile photo and other images' },
    { id: 'table-based', name: 'Table-Based Content', description: 'Skills or experience presented in tables' },
    { id: 'special-chars', name: 'Special Characters', description: 'International characters and symbols' },
  ],
};

export default function TestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    DanteLogger.success.ux(`Selected category: ${category}`);
  };

  const handleTestPdfSelect = (category: string, id: string) => {
    const pdfUrl = `/test-pdfs/${category}/${id}.pdf`;
    
    // Store the PDF URL in localStorage for use in the viewer
    localStorage.setItem('currentPdfUrl', pdfUrl);
    localStorage.setItem('currentPdfName', `${id}.pdf`);
    
    DanteLogger.success.core(`Selected test PDF: ${id} from ${category} category`);
    
    // Navigate to the viewer
    router.push('/view');
  };

  const handlePdfUploaded = (url: string, fileName: string) => {
    setUploadSuccess(true);
    
    // Store the PDF URL in localStorage for use in the viewer
    localStorage.setItem('currentPdfUrl', url);
    localStorage.setItem('currentPdfName', fileName);
    
    // Redirect to the viewer after a short delay
    setTimeout(() => {
      router.push('/view');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary, #f5f5f5)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary, #333)]">
            PDF Interpretation Test Suite
          </h1>
          <p className="text-xl text-[var(--text-secondary, #666)] max-w-3xl mx-auto">
            Test how well our system adapts to different PDF designs and content structures.
            Select a test category or upload your own PDF.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
              Choose a Test PDF
            </h2>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(TEST_PDFS).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                        : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              
              {selectedCategory && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary, #333)]">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tests
                  </h3>
                  
                  <div className="grid gap-3">
                    {TEST_PDFS[selectedCategory as keyof typeof TEST_PDFS].map((pdf) => (
                      <button
                        key={pdf.id}
                        onClick={() => handleTestPdfSelect(selectedCategory, pdf.id)}
                        className="flex flex-col text-left p-4 border border-[var(--border-primary, #eaeaea)] rounded-lg hover:bg-[var(--bg-secondary, #f0f0f0)] transition-colors"
                      >
                        <span className="font-medium text-[var(--text-primary, #333)]">{pdf.name}</span>
                        <span className="text-sm text-[var(--text-tertiary, #888)]">{pdf.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
              Upload Your Own PDF
            </h2>
            
            {!uploadSuccess ? (
              <PDFUploader 
                onPdfUploaded={handlePdfUploaded}
                className="mb-4"
              />
            ) : (
              <div className="text-center p-6 bg-[var(--state-success-light, #e6f7e6)] rounded-lg mb-4">
                <svg 
                  className="w-16 h-16 mx-auto mb-4 text-[var(--state-success, #28a745)]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p className="text-lg font-medium text-[var(--text-primary, #333)]">
                  PDF uploaded successfully!
                </p>
                <p className="text-[var(--text-secondary, #666)] mt-2">
                  Redirecting to viewer...
                </p>
              </div>
            )}
            
            <div className="mt-4 text-sm text-[var(--text-tertiary, #888)]">
              <p>Upload any PDF resume to test how well our system adapts to different designs and content structures.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
