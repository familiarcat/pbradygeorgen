import fs from 'fs';
import path from 'path';
const basePath = path.resolve(process.cwd(), 'alexai');
const crewPath = path.join(basePath, 'crew', 'crew.json');
const scenariosPath = path.join(basePath, 'scenarios', 'observation_lounge_scenarios.json');
const logDir = path.join(basePath, 'logs', 'observation_lounge');
const loadJSON = (filepath) => JSON.parse(fs.readFileSync(filepath, 'utf-8'));
const loadText = (filepath) => fs.readFileSync(filepath, 'utf-8').trim();
const runSimulation = async () => {
    console.log('[INFO] Starting Observation Lounge Simulation...');
    const crew = loadJSON(crewPath);
    const scenarios = loadJSON(scenariosPath).scenarios;
    fs.mkdirSync(logDir, { recursive: true });
    for (const scenario of scenarios) {
        console.log(`\n[SCENARIO] ${scenario.title}: ${scenario.summary}`);
        let markdownLog = `# Observation Lounge: ${scenario.title}\n\n`;
        markdownLog += `**Summary:** ${scenario.summary}\n\n`;
        markdownLog += `**Situation:** ${scenario.situation || '_[missing]_'}\n\n`;
        markdownLog += `---\n\n`;
        const crewResponses = {};
        for (const member of crew) {
            const katraPath = path.join(basePath, 'katras', member.katraFile);
            const promptPath = path.join(basePath, 'prompts', member.promptFile);
            const memory = loadJSON(katraPath);
            const prompt = loadText(promptPath);
            const response = `🧠 ${member.name} (${member.role}): ${prompt.split('\n')[0]} — *Reflects on ${memory.base_experience || 'a recent insight'}.*`;
            crewResponses[member.name] = response;
            markdownLog += `${response}\n\n`;
        }
        // Simulated conclusions
        const summaryByPicard = `👨‍✈️ **Picard:** Each officer has brought a unique perspective. I recommend we align strategy and move forward with caution.`;
        const analysisBySpock = `🖖 **Spock:** Logical consistency across responses is within Starfleet thresholds. Minimal risk of divergence. Recommend mission proceed with phase monitoring.`;
        markdownLog += `---\n\n${summaryByPicard}\n\n${analysisBySpock}\n`;
        const baseFile = scenario.title.toLowerCase().replace(/\s+/g, '_');
        const markdownFile = path.join(logDir, `${baseFile}.md`);
        const jsonFile = path.join(logDir, `${baseFile}.json`);
        fs.writeFileSync(markdownFile, markdownLog, 'utf-8');
        fs.writeFileSync(jsonFile, JSON.stringify({
            scenario,
            crewResponses,
            summaryByPicard,
            analysisBySpock,
            timestamp: new Date().toISOString()
        }, null, 2), 'utf-8');
        console.log(`[LOGGED] ${baseFile}.md and ${baseFile}.json written.`);
    }
    console.log('\n✅ Simulation complete. Reports available in: `alexai/logs/observation_lounge/`');
};
runSimulation();
// End of simulation script
