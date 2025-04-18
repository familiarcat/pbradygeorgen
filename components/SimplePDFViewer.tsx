'use client';

export default function SimplePDFViewer() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-4xl border rounded-lg shadow-lg overflow-hidden">
        {/* Use the object tag to display the PDF directly */}
        <object
          data="/pbradygeorgen_resume.pdf"
          type="application/pdf"
          width="100%"
          height="800px"
          className="w-full"
        >
          <div className="p-8 text-center">
            <p>It appears your browser does not support embedded PDFs.</p>
            <p className="mt-4">
              <a
                href="/pbradygeorgen_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Click here to download the PDF
              </a>
            </p>
          </div>
        </object>
      </div>
    </div>
  );
}
