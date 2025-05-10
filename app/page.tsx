import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import EnvironmentTesterWrapper from '@/components/EnvironmentTesterWrapper';

export default function Home() {
  return (
    <div className="w-full h-screen overflow-auto">
      {/* Main PDF Viewer */}
      <div className="w-full h-screen overflow-hidden">
        <PDFViewerWrapper />
      </div>

      {/* Environment Tester */}
      <EnvironmentTesterWrapper />
    </div>
  );
}
