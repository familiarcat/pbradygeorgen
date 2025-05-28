import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import { arbitrateAgentResponses } from '@/lib/metaAgent-full';

const decision = await arbitrateAgentResponses({
  bito: "Bito's technical recommendation here",
  gemini: "Gemini's philosophical analysis here",
  continue: "Continue.dev’s context-based output here",
});

console.log(decision);
export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <PDFViewerWrapper />
    </div>
  );
}
