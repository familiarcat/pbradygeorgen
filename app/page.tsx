import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary, #f5f5f5)]">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-[var(--text-primary, #333)]">
          PDF Content Analyzer
        </h1>

        <p className="mb-8 text-lg text-[var(--text-secondary, #666)]">
          Upload your own PDF or view a sample resume to see how our analyzer works.
        </p>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <Link
            href="/upload"
            className="px-6 py-3 bg-[var(--cta-primary, #0070f3)] text-white rounded-lg hover:bg-[var(--cta-primary-dark, #0051a8)] transition-colors text-lg font-medium"
          >
            Upload Your PDF
          </Link>

          <Link
            href="/sample"
            className="px-6 py-3 border-2 border-[var(--cta-secondary, #666)] text-[var(--text-primary, #333)] rounded-lg hover:bg-[var(--bg-secondary, #f0f0f0)] transition-colors text-lg font-medium"
          >
            View Sample Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
