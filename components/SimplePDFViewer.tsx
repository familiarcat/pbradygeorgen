'use client';

import { useState } from 'react';
import CenteredPDFViewer from './CenteredPDFViewer';

export default function SimplePDFViewer() {
  // Generate a timestamp for cache-busting
  const timestamp = Date.now();

  // PDF URL state with cache-busting query parameter
  const [pdfUrl, setPdfUrl] = useState(`/pbradygeorgen_resume.pdf?v=${timestamp}`);
  const [pdfName, setPdfName] = useState('pbradygeorgen_resume');

  return (
    <CenteredPDFViewer pdfUrl={pdfUrl} pdfName={pdfName} />
  );
}
