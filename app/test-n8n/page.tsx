'use client';

import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Text, Flex, Grid } from '@/theme/ComponentLibrary';
import { TestCrewMember } from '@/components/TestCrewMember';
import { TestMissionScenario } from '@/components/TestMissionScenario';
import { TestObservationLounge } from '@/components/TestObservationLounge';
import { TestResults } from '@/components/TestResults';
import { AutomatedN8NTesting } from '@/components/AutomatedN8NTesting';

interface TestResult {
    type: string;
    crewMember?: string;
    status: string;
    response?: any;
    error?: string;
    timestamp: string;
    note?: string;
    testMetrics?: any;
}

export default function TestN8NPage() {
    const theme = useTheme();
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [activeCrewMembers, setActiveCrewMembers] = useState<string[]>([]);

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

    const handleTestResult = (result: TestResult) => {
        setTestResults(prev => [result, ...prev]);
    };

    const handleCrewToggle = (crewId: string) => {
        setActiveCrewMembers(prev =>
            prev.includes(crewId)
                ? prev.filter(id => id !== crewId)
                : [...prev, crewId]
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 50%, ${theme.colors.background.tertiary} 100%)`,
            padding: theme.spacing.xl,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Hero Header */}
                <Card variant="primary" style={{ marginBottom: theme.spacing.xxl, textAlign: 'center' }}>
                    <Flex direction="column" align="center" gap={theme.spacing.md}>
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

                        <Text variant="h1" color="primary">
                            N8N Workflow Testing Console
                        </Text>

                        <Text variant="body" color="secondary" style={{ textAlign: 'center', maxWidth: '600px' }}>
                            Comprehensive testing interface for the AlexAI Crew n8n workflow system
                        </Text>

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
                            <Text variant="caption" color="primary">
                                Connected to: n8n.pbradygeorgen.com
                            </Text>
                        </div>
                    </Flex>
                </Card>

                {/* Bento Grid Layout */}
                <Grid columns={12} gap={theme.spacing.xl} style={{ marginBottom: theme.spacing.xl }}>
                    {/* Individual Crew Member Testing - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <Card variant="primary">
                            <Flex direction="column" gap={theme.spacing.lg}>
                                <div style={{ textAlign: 'center' }}>
                                    <Text variant="h2" color="primary">
                                        🧑‍🚀 Individual Crew Member Testing
                                    </Text>
                                    <Text variant="body" color="secondary">
                                        Test individual crew members with custom tasks and quick tests
                                    </Text>
                                </div>

                                <Grid columns={3} gap={theme.spacing.lg}>
                                    {crewMembers.map((member) => (
                                        <TestCrewMember
                                            key={member.id}
                                            member={member}
                                            onTestResult={handleTestResult}
                                            isActive={activeCrewMembers.includes(member.id)}
                                            onToggleActive={handleCrewToggle}
                                        />
                                    ))}
                                </Grid>
                            </Flex>
                        </Card>
                    </div>

                    {/* Mission Scenario Testing - Medium Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <TestMissionScenario
                            crewMembers={crewMembers.filter(m => activeCrewMembers.includes(m.id))}
                            onTestResult={handleTestResult}
                        />
                    </div>

                    {/* Observation Lounge Integration Testing - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <TestObservationLounge
                            crewMembers={crewMembers}
                            onTestResult={handleTestResult}
                        />
                    </div>

                    {/* Automated N8N Testing Suite - Large Card */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <AutomatedN8NTesting
                            crewMembers={crewMembers}
                            onTestResult={handleTestResult}
                        />
                    </div>
                </Grid>

                {/* Test Results */}
                <TestResults results={testResults} />
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
