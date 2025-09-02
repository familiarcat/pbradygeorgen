"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMissionScenario = TestMissionScenario;
const react_1 = require("react");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
function TestMissionScenario({ crewMembers, onTestResult }) {
    const theme = (0, ThemeProvider_1.useTheme)();
    const [selectedCrew, setSelectedCrew] = (0, react_1.useState)([]);
    const [missionDescription, setMissionDescription] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [lastResponse, setLastResponse] = (0, react_1.useState)(null);
    const handleTest = async () => {
        if (selectedCrew.length === 0)
            return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/test-n8n/mission-scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scenarioId: 'custom_mission',
                    missionDescription: missionDescription || 'Custom mission scenario test',
                    selectedCrew: selectedCrew,
                    complexity: selectedCrew.length > 6 ? 'High' : selectedCrew.length > 3 ? 'Medium' : 'Low',
                }),
            });
            const result = await response.json();
            setLastResponse(result);
            onTestResult({
                type: 'mission_scenario',
                scenario: 'custom_mission',
                success: response.ok,
                response: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Test failed:', error);
            onTestResult({
                type: 'mission_scenario',
                scenario: 'custom_mission',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const toggleCrewMember = (crewId) => {
        setSelectedCrew(prev => prev.includes(crewId)
            ? prev.filter(id => id !== crewId)
            : [...prev, crewId]);
    };
    return (<ComponentLibrary_1.Card variant="accent">
            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <ComponentLibrary_1.Text variant="h2" color="primary">
                        🎯 Mission Scenario Testing
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Text variant="body" color="secondary">
                        Test coordinated mission workflows with selected crew members
                    </ComponentLibrary_1.Text>
                </div>

                {/* Crew Selection */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Select Crew Members ({selectedCrew.length}/{crewMembers.length}):
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Grid columns={3} gap={theme.spacing.sm}>
                        {crewMembers.map((crew) => (<ComponentLibrary_1.Button key={crew.id} variant={selectedCrew.includes(crew.id) ? 'primary' : 'secondary'} size="sm" onClick={() => toggleCrewMember(crew.id)} style={{ width: '100%' }}>
                                {crew.name.split(' ')[0]}
                            </ComponentLibrary_1.Button>))}
                    </ComponentLibrary_1.Grid>
                </div>

                {/* Mission Description */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Mission Description:
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Input value={missionDescription} onChange={setMissionDescription} placeholder="Describe the mission scenario..." type="textarea" rows={3}/>
                </div>

                {/* Test Button */}
                <ComponentLibrary_1.Button variant="accent" size="lg" onClick={handleTest} disabled={isLoading || selectedCrew.length === 0} style={{ width: '100%' }}>
                    {isLoading ? (<ComponentLibrary_1.Flex align="center" gap={theme.spacing.sm}>
                            <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}/>
                            Testing...
                        </ComponentLibrary_1.Flex>) : (<ComponentLibrary_1.Flex align="center" gap={theme.spacing.sm}>
                            <span>🎯</span>
                            Test Mission
                        </ComponentLibrary_1.Flex>)}
                </ComponentLibrary_1.Button>

                {/* Last Response Display */}
                {lastResponse && (<ComponentLibrary_1.Card variant="secondary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                            <ComponentLibrary_1.Text variant="h4" color="primary">
                                Last Response:
                            </ComponentLibrary_1.Text>
                            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: theme.spacing.sm,
                fontSize: theme.typography.fontSize.sm,
            }}>
                                <div>
                                    <strong>Status:</strong>
                                    <ComponentLibrary_1.Badge variant={lastResponse.success ? 'success' : 'error'} size="sm" style={{ marginLeft: theme.spacing.xs }}>
                                        {lastResponse.success ? 'Success' : 'Failed'}
                                    </ComponentLibrary_1.Badge>
                                </div>
                                {lastResponse.response?.testMetrics?.responseTime && (<div>
                                        <strong>Response Time:</strong>
                                        <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                            {lastResponse.response.testMetrics.responseTime}ms
                                        </span>
                                    </div>)}
                                {lastResponse.response?.response?.coordination_summary && (<div>
                                        <strong>Efficiency:</strong>
                                        <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.accent }}>
                                            {lastResponse.response.response.coordination_summary.coordination_efficiency}
                                        </span>
                                    </div>)}
                            </div>
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Card>)}
            </ComponentLibrary_1.Flex>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </ComponentLibrary_1.Card>);
}
//# sourceMappingURL=TestMissionScenario.js.map