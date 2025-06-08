import fs from 'fs';
import path from 'path';

const DIAGRAM_SVG_PATH = path.resolve('docs', 'alexai-lifecycle.svg');
const README_PATH = path.resolve('README.md');

// Define lifecycle events and colors
const stages = [
  { label: 'dev:predev', commands: ['pull_katras_runtime.sh'] },
  { label: 'dev:dev', commands: ['next dev'] },
  { label: 'dev:prestart', commands: ['pull_katras_runtime.sh', 'sync_katras_runtime.sh'] },
  { label: 'build:prebuild', commands: ['migrate_katras.sh', 'pull_katras_runtime.sh', 'sync_katras_runtime.sh', 'amplify-prebuild.sh'] },
  { label: 'build:build', commands: ['pull_katras_runtime.sh', 'sync_katras_runtime.sh', 'next build'] },
  { label: 'build:postbuild', commands: ['migrate_katras.sh', 'sync_katras_runtime.sh'] },
];

const colors: Record<string, string> = {
  'pull_katras_runtime.sh': '#4db6ac',
  'sync_katras_runtime.sh': '#81c784',
  'migrate_katras.sh': '#ffb74d',
  'amplify-prebuild.sh': '#64b5f6',
  'next dev': '#9575cd',
  'next build': '#f06292',
};

// SVG dimensions
const barHeight = 24;
const barSpacing = 14;
const rowSpacing = 48;
const stageLabelWidth = 160;
const svgWidth = 920;
const svgHeight = stages.length * rowSpacing + 180;
const legendHeight = 160;

// Begin SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
  <style>
    .label { font: 14px sans-serif; fill: #333; }
    .bar { rx: 4; ry: 4; }
    .legend-label { font: 13px sans-serif; fill: #333; }
    .title { font: bold 18px sans-serif; fill: #333; }
  </style>

  <text x="20" y="30" class="title">🧠 AlexAI Katra Lifecycle Sync Sequence</text>
`;

let y = 60;

// Render each stage row
for (const stage of stages) {
  svg += `  <text x="20" y="${y + 16}" class="label">${stage.label}</text>\n`;
  stage.commands.forEach((cmd, i) => {
    const x = stageLabelWidth + i * 180;
    const color = colors[cmd] || '#ccc';
    svg += `  <rect class="bar" x="${x}" y="${y}" width="170" height="${barHeight}" fill="${color}" />\n`;
    svg += `  <text x="${x + 8}" y="${y + 17}" class="label">${cmd}</text>\n`;
  });
  y += rowSpacing;
}

// Draw legend
const legendX = 20;
let legendY = y + 20;
svg += `  <text x="${legendX}" y="${legendY}" class="label">Legend</text>\n`;
legendY += 20;

Object.entries(colors).forEach(([cmd, color], i) => {
  svg += `  <rect x="${legendX}" y="${legendY}" width="18" height="18" fill="${color}" rx="4" ry="4" />\n`;
  svg += `  <text x="${legendX + 24}" y="${legendY + 14}" class="legend-label">${cmd}</text>\n`;
  legendY += 28;
});

svg += '</svg>';

// Write SVG file
fs.mkdirSync(path.dirname(DIAGRAM_SVG_PATH), { recursive: true });
fs.writeFileSync(DIAGRAM_SVG_PATH, svg);

// Update README.md
const tagStart = '<!-- alexai-diagram-start -->';
const tagEnd = '<!-- alexai-diagram-end -->';
const imageTag = `![AlexAI Lifecycle](docs/alexai-lifecycle.svg)`;

let readme = fs.readFileSync(README_PATH, 'utf-8');
if (readme.includes(tagStart) && readme.includes(tagEnd)) {
  const updated = readme.replace(
    new RegExp(`${tagStart}[\\s\\S]*?${tagEnd}`, 'gm'),
    `${tagStart}\n${imageTag}\n${tagEnd}`
  );
  fs.writeFileSync(README_PATH, updated);
} else {
  readme += `\n\n${tagStart}\n${imageTag}\n${tagEnd}\n`;
  fs.writeFileSync(README_PATH, readme);
}

console.log('✅ Lifecycle diagram SVG generated and README updated.');
