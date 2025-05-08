'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useServerTheme } from '@/components/ServerThemeProvider';
import SalingerHeader from '@/components/SalingerHeader';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import styles from '@/styles/PDFViewer.module.css';

/**
 * PDF Viewer Page
 * 
 * This page displays the PDF viewer with the source PDF and provides
 * links to the Download Functionality Test page and other features.
 * 
 * Philosophical Framework:
 * - Salinger: Simplifying the interface to focus on content
 * - Hesse: Balancing structure with flexibility
 * - Derrida: Deconstructing the PDF content
 * - Dante: Guiding the user through the PDF content
 */
export default function PDFViewerPage() {
  const { theme } = useServerTheme();
  const [pdfUrl, setPdfUrl] = useState<string>('/default_resume.pdf');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contentManifest, setContentManifest] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 [Dante:Debug] Fetching PDF viewer data...');

        // Fetch the content manifest
        console.log('🔍 [Dante:Debug] Fetching content manifest from /content_manifest.json');
        const manifestResponse = await fetch('/content_manifest.json');
        if (manifestResponse.ok) {
          const manifestData = await manifestResponse.json();
          console.log('✅ [Dante:Success] Content manifest fetched successfully');
          setContentManifest(manifestData);
          
          // Set the PDF URL from the manifest
          if (manifestData.source?.pdf?.path) {
            setPdfUrl(manifestData.source.pdf.path);
          }
        } else {
          console.warn(`⚠️ [Dante:Warning] Failed to fetch content manifest: ${manifestResponse.status}`);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ [Dante:Error] Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <SalingerHeader title="PDF Viewer" />
      
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading PDF viewer...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className={styles.button}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div className={styles.card}>
                <h2>PDF Information</h2>
                {contentManifest && (
                  <div className={styles.info}>
                    <p><strong>Source:</strong> {contentManifest.source.pdf.path}</p>
                    <p><strong>Size:</strong> {contentManifest.source.pdf.size} bytes</p>
                    <p><strong>Generated:</strong> {new Date(contentManifest.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className={styles.card}>
                <h2>Actions</h2>
                <div className={styles.actions}>
                  <Link href="/download-test" className={styles.button}>
                    Download Functionality Test
                  </Link>
                  <Link href="/json-view" className={styles.button}>
                    JSON View
                  </Link>
                  <Link href="/" className={styles.button}>
                    Home
                  </Link>
                </div>
              </div>
              
              <div className={styles.card}>
                <h2>Available Downloads</h2>
                {contentManifest && contentManifest.downloads && (
                  <ul className={styles.downloadList}>
                    {Object.entries(contentManifest.downloads).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        <Link href={value.path} target="_blank" className={styles.downloadLink}>
                          {key}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className={styles.pdfContainer}>
              <PDFViewerWrapper pdfUrl={pdfUrl} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
