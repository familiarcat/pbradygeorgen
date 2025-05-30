
const fs = require('fs');
const path = require('path');

// Define paths
const baseDir = path.join(__dirname, 'alexai');
const scenariosPath = path.join(baseDir, 'scenarios', 'observation_lounge_scenarios.json');
const logsDir = path.join(baseDir, 'logs', 'observation_lounge');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Load scenarios
const scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf-8')).scenarios;

// Mock function to simulate Observation Lounge response
function runScenario(scenario) {
  const result = {
    title: scenario.title,
    summary: scenario.summary,
    situation: scenario.situation,
    expected_behavior: scenario.expected_behavior,
    crew_response: `Mocked crew conversation for scenario: ${scenario.title}`,
    timestamp: new Date().toISOString()
  };
  return result;
}

// Run all scenarios
const results = scenarios.map(runScenario);

// Save results as JSON and Markdown
results.forEach(result => {
  const baseFilename = result.title.toLowerCase().replace(/\s+/g, '_');
  const jsonPath = path.join(logsDir, `${baseFilename}.json`);
  const mdPath = path.join(logsDir, `${baseFilename}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));

  const mdContent = `# ${result.title}\n\n**Summary:** ${result.summary}\n\n**Situation:** ${result.situation}\n\n**Expected Behavior:** ${result.expected_behavior}\n\n**Crew Response:**\n${result.crew_response}`;
  fs.writeFileSync(mdPath, mdContent);
});

console.log(`[OBSERVATION LOUNGE] Successfully ran ${results.length} scenario(s). Logs saved to: ${logsDir}`);
