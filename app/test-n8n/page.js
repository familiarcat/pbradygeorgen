"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestN8NPage;
const react_1 = require("react");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
const TestCrewMember_1 = require("@/components/TestCrewMember");
const TestMissionScenario_1 = require("@/components/TestMissionScenario");
const TestObservationLounge_1 = require("@/components/TestObservationLounge");
const TestResults_1 = require("@/components/TestResults");
const AutomatedN8NTesting_1 = require("@/components/AutomatedN8NTesting");
function TestN8NPage() {
    const theme = (0, ThemeProvider_1.useTheme)();
    const [testResults, setTestResults] = (0, react_1.useState)([]);
    const [activeCrewMembers, setActiveCrewMembers] = (0, react_1.useState)([]);
    const crewMembers = [
        {
            id: 'picard',
            name: 'Captain Jean-Luc Picard',
            abbreviation: 'CJP',
            role: 'Strategic Leadership & Mission Command',
            description: 'Commander of the Enterprise, expert in diplomacy and strategic planning',
            webhookPath: 'crew-captain-jean-luc-picard'
        },
        {
            id: 'riker',
            name: 'Commander William Riker',
            abbreviation: 'CWR',
            role: 'Tactical Execution & Workflow Management',
            description: 'First Officer, tactical specialist and mission execution expert',
            webhookPath: 'crew-commander-william-riker'
        },
        {
            id: 'data',
            name: 'Commander Data',
            abbreviation: 'CD',
            role: 'Analytics & Logic Operations',
            description: 'Android officer with exceptional analytical and computational abilities',
            webhookPath: 'crew-commander-data'
        },
        {
            id: 'crusher',
            name: 'Dr. Beverly Crusher',
            abbreviation: 'DBC',
            role: 'Health & Diagnostics Officer',
            description: 'Chief Medical Officer, expert in medical analysis and health systems',
            webhookPath: 'crew-dr-beverly-crusher'
        },
        {
            id: 'worf',
            name: 'Lieutenant Worf',
            abbreviation: 'LW',
            role: 'Security & Compliance Operations',
            description: 'Security Chief, expert in threat assessment and security protocols',
            webhookPath: 'crew-lieutenant-worf'
        },
        {
            id: 'troi',
            name: 'Counselor Deanna Troi',
            abbreviation: 'CDT',
            role: 'User Experience & Empathy Analysis',
            description: 'Ship\'s Counselor, expert in emotional intelligence and user needs',
            webhookPath: 'crew-counselor-deanna-troi'
        },
        {
            id: 'quark',
            name: 'Quark',
            abbreviation: 'Q',
            role: 'Business Intelligence & Budget Optimization',
            description: 'Business strategist, expert in market analysis and resource optimization',
            webhookPath: 'crew-quark'
        },
        {
            id: 'laforge',
            name: 'Lieutenant Commander Geordi La Forge',
            abbreviation: 'CGL',
            role: 'Infrastructure & System Integration',
            description: 'Chief Engineer, expert in technical systems and infrastructure',
            webhookPath: 'crew-lieutenant-commander-geordi-la-forge'
        },
        {
            id: 'uhura',
            name: 'Lieutenant Uhura',
            abbreviation: 'LU',
            role: 'Communications & I/O Operations',
            description: 'Communications Officer, expert in data transmission and protocols',
            webhookPath: 'crew-lieutenant-uhura'
        }
    ];
    const handleTestResult = (result) => {
        setTestResults(prev => [result, ...prev]);
    };
    const handleCrewToggle = (crewId) => {
        setActiveCrewMembers(prev => prev.includes(crewId)
            ? prev.filter(id => id !== crewId)
            : [...prev, crewId]);
    };
    return (<div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 50%, ${theme.colors.background.tertiary} 100%)`,
            padding: theme.spacing.xl,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Hero Header */}
                <ComponentLibrary_1.Card variant="primary" style={{ marginBottom: theme.spacing.xxl, textAlign: 'center' }}>
                    <ComponentLibrary_1.Flex direction="column" align="center" gap={theme.spacing.md}>
                        <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
            boxShadow: theme.shadows.glow,
        }}>
                            <span style={{ fontSize: '48px' }}>🚀</span>
                        </div>

                        <ComponentLibrary_1.Text variant="h1" color="primary">
                            N8N Workflow Testing Console
                        </ComponentLibrary_1.Text>

                        <ComponentLibrary_1.Text variant="body" color="secondary" style={{ textAlign: 'center', maxWidth: '600px' }}>
                            Comprehensive testing interface for the AlexAI Crew n8n workflow system
                        </ComponentLibrary_1.Text>

                        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.primary}`,
        }}>
                            <div style={{
            width: '8px',
            height: '8px',
            background: '#10B981',
            borderRadius: theme.borderRadius.full,
            animation: 'pulse 2s infinite'
        }}></div>
                            <ComponentLibrary_1.Text variant="caption" color="primary">
                                Connected to: n8n.pbradygeorgen.com
                            </ComponentLibrary_1.Text>
                        </div>
                    </ComponentLibrary_1.Flex>
                </ComponentLibrary_1.Card>

                {/* Bento Grid Layout */}
                <ComponentLibrary_1.Grid columns={12} gap={theme.spacing.xl} style={{ marginBottom: theme.spacing.xl }}>
                    {/* Individual Crew Member Testing - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <ComponentLibrary_1.Card variant="primary">
                            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.lg}>
                                <div style={{ textAlign: 'center' }}>
                                    <ComponentLibrary_1.Text variant="h2" color="primary">
                                        🧑‍🚀 Individual Crew Member Testing
                                    </ComponentLibrary_1.Text>
                                    <ComponentLibrary_1.Text variant="body" color="secondary">
                                        Test individual crew members with custom tasks and quick tests
                                    </ComponentLibrary_1.Text>
                                </div>

                                <ComponentLibrary_1.Grid columns={3} gap={theme.spacing.lg}>
                                    {crewMembers.map((member) => (<TestCrewMember_1.TestCrewMember key={member.id} member={member} onTestResult={handleTestResult} isActive={activeCrewMembers.includes(member.id)} onToggleActive={handleCrewToggle}/>))}
                                </ComponentLibrary_1.Grid>
                            </ComponentLibrary_1.Flex>
                        </ComponentLibrary_1.Card>
                    </div>

                    {/* Mission Scenario Testing - Medium Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <TestMissionScenario_1.TestMissionScenario crewMembers={crewMembers.filter(m => activeCrewMembers.includes(m.id))} onTestResult={handleTestResult}/>
                    </div>

                    {/* Observation Lounge Integration Testing - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <TestObservationLounge_1.TestObservationLounge crewMembers={crewMembers} onTestResult={handleTestResult}/>
                    </div>

                    {/* Automated N8N Testing Suite - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <AutomatedN8NTesting_1.AutomatedN8NTesting crewMembers={crewMembers} onTestResult={handleTestResult}/>
                    </div>
                </ComponentLibrary_1.Grid>

                {/* Test Results */}
                <TestResults_1.TestResults results={testResults}/>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>);
}
//# sourceMappingURL=page.js.map