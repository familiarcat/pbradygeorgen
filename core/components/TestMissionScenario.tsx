'use client';

import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Button, Input, Text, Flex, Grid, Badge } from '@/theme/ComponentLibrary';

interface CrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

interface TestMissionScenarioProps {
    crewMembers: CrewMember[];
    onTestResult: (result: any) => void;
}

export function TestMissionScenario({ crewMembers, onTestResult }: TestMissionScenarioProps) {
    const theme = useTheme();
    const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
    const [missionDescription, setMissionDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState<any>(null);

    const handleTest = async () => {
        if (selectedCrew.length === 0) return;

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
        } catch (error) {
            console.error('Test failed:', error);
            onTestResult({
                type: 'mission_scenario',
                scenario: 'custom_mission',
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCrewMember = (crewId: string) => {
        setSelectedCrew(prev =>
            prev.includes(crewId)
                ? prev.filter(id => id !== crewId)
                : [...prev, crewId]
        );
    };

    return (
        <Card variant="accent">
            <Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <Text variant="h2" color="primary">
                        🎯 Mission Scenario Testing
                    </Text>
                    <Text variant="body" color="secondary">
                        Test coordinated mission workflows with selected crew members
                    </Text>
                </div>

                {/* Crew Selection */}
                <div>
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Select Crew Members ({selectedCrew.length}/{crewMembers.length}):
                    </Text>
                    <Grid columns={3} gap={theme.spacing.sm}>
                        {crewMembers.map((crew) => (
                            <Button
                                key={crew.id}
                                variant={selectedCrew.includes(crew.id) ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => toggleCrewMember(crew.id)}
                                style={{ width: '100%' }}
                            >
                                {crew.name.split(' ')[0]}
                            </Button>
                        ))}
                    </Grid>
                </div>

                {/* Mission Description */}
                <div>
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                        Mission Description:
                    </Text>
                    <Input
                        value={missionDescription}
                        onChange={setMissionDescription}
                        placeholder="Describe the mission scenario..."
                        type="textarea"
                        rows={3}
                    />
                </div>

                {/* Test Button */}
                <Button
                    variant="accent"
                    size="lg"
                    onClick={handleTest}
                    disabled={isLoading || selectedCrew.length === 0}
                    style={{ width: '100%' }}
                >
                    {isLoading ? (
                        <Flex align="center" gap={theme.spacing.sm}>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Testing...
                        </Flex>
                    ) : (
                        <Flex align="center" gap={theme.spacing.sm}>
                            <span>🎯</span>
                            Test Mission
                        </Flex>
                    )}
                </Button>

                {/* Last Response Display */}
                {lastResponse && (
                    <Card variant="secondary">
                        <Flex direction="column" gap={theme.spacing.sm}>
                            <Text variant="h4" color="primary">
                                Last Response:
                            </Text>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: theme.spacing.sm,
                                fontSize: theme.typography.fontSize.sm,
                            }}>
                                <div>
                                    <strong>Status:</strong>
                                    <Badge
                                        variant={lastResponse.success ? 'success' : 'error'}
                                        size="sm"
                                        style={{ marginLeft: theme.spacing.xs }}
                                    >
                                        {lastResponse.success ? 'Success' : 'Failed'}
                                    </Badge>
                                </div>
                                {lastResponse.response?.testMetrics?.responseTime && (
                                    <div>
                                        <strong>Response Time:</strong>
                                        <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                            {lastResponse.response.testMetrics.responseTime}ms
                                        </span>
                                    </div>
                                )}
                                {lastResponse.response?.response?.coordination_summary && (
                                    <div>
                                        <strong>Efficiency:</strong>
                                        <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.accent }}>
                                            {lastResponse.response.response.coordination_summary.coordination_efficiency}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Flex>
                    </Card>
                )}
            </Flex>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Card>
    );
}
