import { lcarsTokens } from "@/tokens/lcars-token-map";
export default function SprintMetricsPanel() {
  return (
    <aside className='metrics-panel'>
      <h2>Metrics</h2>
      <ul>
        <li>Velocity: 34</li>
        <li>Points Remaining: 21</li>
        <li>Completion %: 65%</li>
      </ul>
    </aside>
  );
}