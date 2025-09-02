"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestObservationLounge = TestObservationLounge;
const react_1 = require("react");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
function TestObservationLounge({ crewMembers, onTestResult }) {
    const theme = (0, ThemeProvider_1.useTheme)();
    const [selectedCrew, setSelectedCrew] = (0, react_1.useState)([]);
    const [testMode, setTestMode] = (0, react_1.useState)('full_crew');
    const [missionDirective, setMissionDirective] = (0, react_1.useState)('');
    const [quickDirectives, setQuickDirectives] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [lastResponse, setLastResponse] = (0, react_1.useState)(null);
    const testModes = [
        {
            mode: 'full_crew',
            title: 'Full Crew Coordination',
            description: 'All 9 crew members working together on complex missions',
            crew: 9,
            complexity: 'High'
        },
        {
            mode: 'core_crew',
            title: 'Core Crew Operations',
            description: 'Picard + Riker + 2 specialists for standard missions',
            crew: 4,
            complexity: 'Medium'
        },
        {
            mode: 'specialist_team',
            title: 'Specialist Team Focus',
            description: '2-3 specialists for focused technical or business tasks',
            crew: 3,
            complexity: 'Low'
        }
    ];
    const quickDirectiveOptions = [
        'Strategic business analysis and market positioning',
        'Technical infrastructure audit and optimization',
        'User experience research and empathy mapping',
        'Security protocol review and threat assessment',
        'Communication system optimization and data flow analysis'
    ];
    const handleCrewSelection = (crewId) => {
        setSelectedCrew(prev => prev.includes(crewId)
            ? prev.filter(id => id !== crewId)
            : [...prev, crewId]);
    };
    const handleTestModeChange = (mode) => {
        setTestMode(mode);
        // Auto-select crew based on mode
        if (mode === 'full_crew') {
            setSelectedCrew(crewMembers.map(m => m.id));
        }
        else if (mode === 'core_crew') {
            setSelectedCrew(['picard', 'riker', 'data', 'crusher']);
        }
        else {
            setSelectedCrew(['data', 'riker', 'geordi', 'uhura']);
        }
    };
    const addQuickDirective = (directive) => {
        if (!quickDirectives.includes(directive)) {
            setQuickDirectives(prev => [...prev, directive]);
        }
    };
    const removeQuickDirective = (directive) => {
        setQuickDirectives(prev => prev.filter(d => d !== directive));
    };
    const handleTest = async () => {
        if (selectedCrew.length === 0)
            return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/test-n8n/observation-lounge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testMode,
                    selectedCrew,
                    missionDirective: missionDirective || 'Comprehensive crew coordination test',
                    quickDirectives,
                    complexity: testMode === 'full_crew' ? 'High' : testMode === 'core_crew' ? 'Medium' : 'Low'
                }),
            });
            const result = await response.json();
            setLastResponse(result);
            onTestResult({
                type: 'observation_lounge_test',
                testMode,
                crewCount: selectedCrew.length,
                success: response.ok,
                response: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Test failed:', error);
            onTestResult({
                type: 'observation_lounge_test',
                testMode,
                crewCount: selectedCrew.length,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const getTestModeColor = (mode) => {
        switch (mode) {
            case 'full_crew': return theme.colors.error;
            case 'core_crew': return theme.colors.warning;
            case 'specialist_team': return theme.colors.success;
            default: return theme.colors.text.tertiary;
        }
    };
    return (<ComponentLibrary_1.Card variant="secondary">
            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <ComponentLibrary_1.Text variant="h2" color="primary">
                        🏛️ Observation Lounge Integration Testing
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Text variant="body" color="secondary">
                        Test full crew coordination and workflow integration
                    </ComponentLibrary_1.Text>
                </div>

                {/* Test Mode Selection */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Test Mode:
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Grid columns={3} gap={theme.spacing.md}>
                        {testModes.map((mode) => (<div key={mode.mode} style={{
                cursor: 'pointer',
                border: testMode === mode.mode ? `2px solid ${getTestModeColor(mode.mode)}` : undefined,
                background: testMode === mode.mode ? `${getTestModeColor(mode.mode)}10` : undefined,
            }} onClick={() => handleTestModeChange(mode.mode)}>
                                <ComponentLibrary_1.Card variant="primary">
                                    <ComponentLibrary_1.Flex direction="column" align="center" gap={theme.spacing.sm}>
                                        <ComponentLibrary_1.Text variant="h4" color="primary">
                                            {mode.title}
                                        </ComponentLibrary_1.Text>
                                        <ComponentLibrary_1.Text variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                                            {mode.description}
                                        </ComponentLibrary_1.Text>
                                        <div style={{
                display: 'flex',
                gap: theme.spacing.sm,
                alignItems: 'center'
            }}>
                                            <ComponentLibrary_1.Badge variant="primary" size="sm">
                                                Crew: {mode.crew}
                                            </ComponentLibrary_1.Badge>
                                            <ComponentLibrary_1.Badge variant="accent" size="sm">
                                                {mode.complexity} Complexity
                                            </ComponentLibrary_1.Badge>
                                        </div>
                                    </ComponentLibrary_1.Flex>
                                </ComponentLibrary_1.Card>
                            </div>))}
                    </ComponentLibrary_1.Grid>
                </div>

                {/* Mission Directive */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Mission Directive:
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Input value={missionDirective} onChange={setMissionDirective} placeholder="Enter the mission directive for the Observation Lounge..." type="textarea" rows={3}/>
                </div>

                {/* Quick Directives */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Quick Directives:
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Grid columns={2} gap={theme.spacing.sm}>
                        {quickDirectiveOptions.map((directive) => (<ComponentLibrary_1.Button key={directive} variant={quickDirectives.includes(directive) ? 'primary' : 'secondary'} size="sm" onClick={() => quickDirectives.includes(directive)
                ? removeQuickDirective(directive)
                : addQuickDirective(directive)} style={{ width: '100%', textAlign: 'left' }}>
                                <ComponentLibrary_1.Flex align="center" justify="space-between">
                                    <span style={{ fontSize: theme.typography.fontSize.sm }}>
                                        {directive}
                                    </span>
                                    {quickDirectives.includes(directive) && (<ComponentLibrary_1.Icon icon="✓" size="sm"/>)}
                                </ComponentLibrary_1.Flex>
                            </ComponentLibrary_1.Button>))}
                    </ComponentLibrary_1.Grid>
                </div>

                {/* Crew Member Selection */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
                        Selected Crew Members ({selectedCrew.length}/{crewMembers.length}):
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Grid columns={3} gap={theme.spacing.md}>
                        {crewMembers.map((member) => (<div key={member.id} style={{
                cursor: 'pointer',
                border: selectedCrew.includes(member.id) ? `2px solid ${theme.colors.secondary}` : undefined,
                background: selectedCrew.includes(member.id) ? `${theme.colors.secondary}10` : undefined,
                transform: selectedCrew.includes(member.id) ? 'scale(1.02)' : 'scale(1)',
                transition: theme.transitions.normal,
            }} onClick={() => handleCrewSelection(member.id)}>
                                <ComponentLibrary_1.Card variant="primary">
                                    <ComponentLibrary_1.Flex align="center" gap={theme.spacing.sm}>
                                        <input type="checkbox" checked={selectedCrew.includes(member.id)} onChange={() => handleCrewSelection(member.id)} style={{
                width: '20px',
                height: '20px',
                borderRadius: theme.borderRadius.sm,
                border: `2px solid ${theme.colors.secondary}`,
                background: selectedCrew.includes(member.id) ? theme.colors.secondary : 'white',
                accentColor: theme.colors.secondary,
                cursor: 'pointer'
            }}/>
                                        <div style={{ flex: 1 }}>
                                            <ComponentLibrary_1.Text variant="body" color="primary" style={{ marginBottom: theme.spacing.xs }}>
                                                {member.name}
                                            </ComponentLibrary_1.Text>
                                            <ComponentLibrary_1.Text variant="caption" color="secondary">
                                                {member.role}
                                            </ComponentLibrary_1.Text>
                                        </div>
                                        <div style={{
                width: '32px',
                height: '32px',
                borderRadius: theme.borderRadius.md,
                background: selectedCrew.includes(member.id)
                    ? `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.secondary}dd 100%)`
                    : `linear-gradient(135deg, ${theme.colors.background.tertiary} 0%, ${theme.colors.background.tertiary}dd 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.bold,
            }}>
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </ComponentLibrary_1.Flex>
                                </ComponentLibrary_1.Card>
                            </div>))}
                    </ComponentLibrary_1.Grid>
                </div>

                {/* Test Controls */}
                <div style={{ textAlign: 'center' }}>
                    <ComponentLibrary_1.Button variant="secondary" size="lg" onClick={handleTest} disabled={isLoading || selectedCrew.length === 0} style={{ minWidth: '200px' }}>
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
                                <ComponentLibrary_1.Icon icon="🚀" size="md"/>
                                Execute Observation Lounge Test
                            </ComponentLibrary_1.Flex>)}
                    </ComponentLibrary_1.Button>
                </div>

                {/* Test Results */}
                {lastResponse && (<ComponentLibrary_1.Card variant="primary">
                        <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                            <ComponentLibrary_1.Text variant="h4" color="primary">
                                Test Results:
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
                                <div>
                                    <strong>Test Mode:</strong>
                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                        {testMode.replace('_', ' ')}
                                    </span>
                                </div>
                                <div>
                                    <strong>Crew Count:</strong>
                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.accent }}>
                                        {selectedCrew.length}
                                    </span>
                                </div>
                                {lastResponse.response?.testMetrics?.responseTime && (<div>
                                        <strong>Response Time:</strong>
                                        <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                            {lastResponse.response.testMetrics.responseTime}ms
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
//# sourceMappingURL=TestObservationLounge.js.map