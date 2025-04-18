/**
 * PDF Viewer Page
 *
 * This page ONLY displays the PDF file, nothing else.
 * No navigation, no UI elements, just the PDF.
 */
export default function Home() {
  // The PDF URL is hardcoded to ensure it always shows the correct PDF
  const pdfUrl = 'https://pbradygeorgen.com/resume.pdf';

  return (
    <iframe
      src={pdfUrl}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 999999,
      }}
      title="Resume PDF"
    />
  );
}
