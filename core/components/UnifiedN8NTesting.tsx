'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Button, Text, Flex, Grid, Badge, Icon } from '@/theme/ComponentLibrary';
import {
    n8nClient,
    n8nTestRunner,
    TestScenario,
    TestResult,
    TestSuiteResult
} from '@/lib/n8n-api-client';

interface CrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

const crewMembers: CrewMember[] = [
    {
        id: 'picard',
        name: 'Captain Jean-Luc Picard',
        role: 'Strategic Leadership',
        webhookPath: 'crew-captain-jean-luc-picard',
        description: 'Strategic business analysis and mission planning'
    },
    {
        id: 'data',
        name: 'Commander Data',
        role: 'Data Analysis',
        webhookPath: 'crew-commander-data',
        description: 'Data analysis and logical reasoning'
    },
    {
        id: 'riker',
        name: 'Commander William Riker',
        role: 'Tactical Execution',
        webhookPath: 'crew-commander-william-riker',
        description: 'Tactical execution and workflow management'
    },
    {
        id: 'geordi',
        name: 'Lieutenant Commander Geordi La Forge',
        role: 'Technical Engineering',
        webhookPath: 'crew-lieutenant-commander-geordi-la-forge',
        description: 'Technical implementation and system architecture'
    },
    {
        id: 'crusher',
        name: 'Dr. Beverly Crusher',
        role: 'Medical & Research',
        webhookPath: 'crew-dr-beverly-crusher',
        description: 'Research analysis and medical insights'
    },
    {
        id: 'troi',
        name: 'Counselor Deanna Troi',
        role: 'Psychological Analysis',
        webhookPath: 'crew-counselor-deanna-troi',
        description: 'Psychological insights and human behavior analysis'
    },
    {
        id: 'worf',
        name: 'Lieutenant Worf',
        role: 'Security & Tactics',
        webhookPath: 'crew-lieutenant-worf',
        description: 'Security analysis and tactical planning'
    },
    {
        id: 'quark',
        name: 'Quark',
        role: 'Business & Commerce',
        webhookPath: 'crew-quark',
        description: 'Business strategy and commercial analysis'
    },
    {
        id: 'obrien',
        name: 'Chief Miles O\'Brien',
        role: 'Operations & Maintenance',
        webhookPath: 'crew-chief-miles-obrien',
        description: 'Operational efficiency and system maintenance'
    }
];

const testScenarios: TestScenario[] = [
    {
        id: 'strategic_analysis',
        name: 'Strategic Business Analysis',
        description: 'Comprehensive strategic analysis of market positioning and competitive landscape',
        task: 'Conduct comprehensive strategic analysis of market positioning',
        expectedOutcome: 'Detailed strategic insights with actionable recommendations',
        complexity: 'High',
        category: 'Strategic Leadership',
        crewMembers: ['picard', 'quark']
    },
    {
        id: 'tactical_execution',
        name: 'Tactical Execution Planning',
        description: 'Development of tactical execution plans for technical implementation',
        task: 'Develop tactical execution plan for technical implementation',
        expectedOutcome: 'Structured execution plan with timelines and milestones',
        complexity: 'Medium',
        category: 'Tactical Execution',
        crewMembers: ['riker', 'geordi']
    },
    {
        id: 'data_analysis',
        name: 'Data Analysis & Logic',
        description: 'Comprehensive data analysis and pattern recognition',
        task: 'Perform comprehensive data analysis and pattern recognition',
        expectedOutcome: 'Data-driven insights with statistical validation',
        complexity: 'High',
        category: 'Data Analysis',
        crewMembers: ['data', 'crusher']
    },
    {
        id: 'psychological_insights',
        name: 'Psychological Insights',
        description: 'Analysis of human behavior and psychological factors',
        task: 'Analyze psychological factors affecting decision making',
        expectedOutcome: 'Behavioral insights and psychological recommendations',
        complexity: 'Medium',
        category: 'Psychological Analysis',
        crewMembers: ['troi', 'crusher']
    },
    {
        id: 'security_analysis',
        name: 'Security & Tactical Analysis',
        description: 'Security assessment and tactical planning',
        task: 'Conduct security assessment and tactical planning',
        expectedOutcome: 'Security recommendations and tactical strategies',
        complexity: 'Medium',
        category: 'Security & Tactics',
        crewMembers: ['worf', 'obrien']
    },
    {
        id: 'technical_implementation',
        name: 'Technical Implementation',
        description: 'Technical system design and implementation planning',
        task: 'Design technical system architecture and implementation plan',
        expectedOutcome: 'Technical specifications and implementation roadmap',
        complexity: 'High',
        category: 'Technical Engineering',
        crewMembers: ['laforge', 'obrien']
    }
];

export function UnifiedN8NTesting() {
    const theme = useTheme();
    const [currentEnvironment, setCurrentEnvironment] = useState<string>('production');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunningTests, setIsRunningTests] = useState(false);
    const [testProgress, setTestProgress] = useState(0);
    const [environmentStatus, setEnvironmentStatus] = useState<any>(null);

    useEffect(() => {
        // Initialize with current environment
        const env = n8nClient.getCurrentEnvironment();
        setCurrentEnvironment(env.name);
        testConnection();
    }, []);

    const testConnection = async () => {
        setConnectionStatus('testing');
        try {
            const result = await n8nClient.testConnection();
            if (result.status === 'success') {
                setConnectionStatus('connected');
                setEnvironmentStatus(result);
            } else {
                setConnectionStatus('error');
                setEnvironmentStatus(result);
            }
        } catch (error) {
            setConnectionStatus('error');
            setEnvironmentStatus({ message: 'Connection test failed' });
        }
    };

    const switchEnvironment = (envName: string) => {
        const success = n8nClient.switchEnvironment(envName);
        if (success) {
            setCurrentEnvironment(envName);
            testConnection();
        }
    };

    const runSingleTest = async (crewMember: CrewMember, task: string) => {
        const result = await n8nClient.testWebhook(crewMember.webhookPath, {
            crewMemberId: crewMember.id,
            webhookPath: crewMember.webhookPath,
            task,
            timestamp: new Date().toISOString(),
            testMode: true,
            source: 'unified-testing-ui'
        });

        setTestResults(prev => [result, ...prev]);
        return result;
    };

    const runAutomatedTestSuite = async () => {
        setIsRunningTests(true);
        setTestProgress(0);
        setTestResults([]);

        try {
            const suiteResult = await n8nTestRunner.runAutomatedTestSuite(testScenarios);
            setTestResults(suiteResult.results);

            // Display summary
            console.log(suiteResult.summary);

        } catch (error) {
            console.error('Test suite failed:', error);
        } finally {
            setIsRunningTests(false);
            setTestProgress(100);
        }
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return theme.colors.secondary;
        switch (status) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.error;
            case 'timeout': return theme.colors.warning;
            default: return theme.colors.secondary;
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        if (!status) return '❓';
        switch (status) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'timeout': return '⏰';
            default: return '❓';
        }
    };

    return (
        <Card style={{ padding: theme.spacing.lg }}>
            <Text variant="h2" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                🤖 Unified N8N Testing Console
            </Text>

            {/* Environment Management */}
            <Card style={{
                padding: theme.spacing.md,
                marginBottom: theme.spacing.lg
            }}>
                <Text variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                    🌍 Environment Management
                </Text>

                <Flex gap={theme.spacing.md} style={{ marginBottom: theme.spacing.md }}>
                    {n8nClient.getAvailableEnvironments().map(env => (
                        <Button
                            key={env}
                            onClick={() => switchEnvironment(env)}
                            style={{
                                backgroundColor: currentEnvironment === env ? theme.colors.primary : theme.colors.secondary,
                                color: theme.colors.text.inverse,
                                border: 'none',
                                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                borderRadius: theme.borderRadius.sm,
                                cursor: 'pointer'
                            }}
                        >
                            {env === currentEnvironment ? '📍 ' : ''}{env}
                        </Button>
                    ))}
                </Flex>

                <Flex gap={theme.spacing.md} align="center">
                    <Text variant="body" color="secondary">
                        Current: {currentEnvironment}
                    </Text>
                    <Text variant="body" color="secondary">
                        Base URL: {n8nClient.getCurrentEnvironment().n8nBaseUrl}
                    </Text>
                    <Button
                        onClick={testConnection}
                        disabled={connectionStatus === 'testing'}
                        style={{
                            backgroundColor: theme.colors.accent,
                            color: theme.colors.text.inverse,
                            border: 'none',
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            borderRadius: theme.borderRadius.sm,
                            cursor: 'pointer'
                        }}
                    >
                        🔍 Test Connection
                    </Button>
                </Flex>

                {/* Connection Status */}
                {connectionStatus !== 'idle' && (
                    <Flex gap={theme.spacing.sm} align="center" style={{ marginTop: theme.spacing.sm }}>
                        <Text variant="body" color="secondary">Status:</Text>
                        <Badge
                            variant={connectionStatus === 'connected' ? 'success' :
                                connectionStatus === 'error' ? 'error' : 'primary'}
                        >
                            {connectionStatus === 'connected' ? '✅ Connected' :
                                connectionStatus === 'error' ? '❌ Error' :
                                    connectionStatus === 'testing' ? '🔄 Testing' : '⏳ Idle'}
                        </Badge>
                        {environmentStatus && (
                            <Text variant="caption" color="secondary">
                                {environmentStatus.message}
                                {environmentStatus.responseTime && ` (${environmentStatus.responseTime}ms)`}
                            </Text>
                        )}
                    </Flex>
                )}
            </Card>

            {/* Quick Testing */}
            <Card style={{
                padding: theme.spacing.md,
                marginBottom: theme.spacing.lg
            }}>
                <Text variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                    🧪 Quick Testing
                </Text>

                <Grid columns={3} gap={theme.spacing.md}>
                    {crewMembers.slice(0, 6).map(crewMember => (
                        <Card key={crewMember.id} style={{ padding: theme.spacing.sm }}>
                            <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.xs }}>
                                {crewMember.name}
                            </Text>
                            <Text variant="caption" color="secondary" style={{ marginBottom: theme.spacing.sm }}>
                                {crewMember.role}
                            </Text>
                            <Button
                                onClick={() => runSingleTest(crewMember, 'Quick test')}
                                style={{
                                    backgroundColor: theme.colors.accent,
                                    color: theme.colors.text.inverse,
                                    border: 'none',
                                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                    borderRadius: theme.borderRadius.sm,
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                🚀 Test
                            </Button>
                        </Card>
                    ))}
                </Grid>
            </Card>

            {/* Automated Test Suite */}
            <Card style={{
                padding: theme.spacing.md,
                marginBottom: theme.spacing.lg
            }}>
                <Text variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                    🤖 Automated Test Suite
                </Text>

                <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.md }}>
                    Run comprehensive tests across all crew members and scenarios
                </Text>

                <Flex gap={theme.spacing.md} align="center" style={{ marginBottom: theme.spacing.md }}>
                    <Button
                        onClick={runAutomatedTestSuite}
                        disabled={isRunningTests}
                        style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.text.inverse,
                            border: 'none',
                            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                            borderRadius: theme.borderRadius.sm,
                            cursor: isRunningTests ? 'not-allowed' : 'pointer',
                            opacity: isRunningTests ? 0.6 : 1
                        }}
                    >
                        {isRunningTests ? '🔄 Running...' : '🚀 Run Full Test Suite'}
                    </Button>

                    {isRunningTests && (
                        <Text variant="body" color="secondary">
                            Progress: {testProgress}%
                        </Text>
                    )}
                </Flex>

                {/* Test Scenarios */}
                <Grid columns={2} gap={theme.spacing.md}>
                    {testScenarios.map(scenario => (
                        <Card key={scenario.id} style={{ padding: theme.spacing.sm }}>
                            <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.xs }}>
                                {scenario.name}
                            </Text>
                            <Text variant="caption" color="secondary" style={{ marginBottom: theme.spacing.sm }}>
                                {scenario.description}
                            </Text>
                            <Flex gap={theme.spacing.xs} style={{ marginBottom: theme.spacing.sm }}>
                                <Badge variant="secondary">{scenario.complexity}</Badge>
                                <Badge variant="primary">{scenario.category}</Badge>
                            </Flex>
                            <Text variant="caption" color="secondary">
                                Crew: {scenario.crewMembers.join(', ')}
                            </Text>
                        </Card>
                    ))}
                </Grid>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
                <Card style={{
                    padding: theme.spacing.md
                }}>
                    <Text variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        📊 Test Results ({testResults.length})
                    </Text>

                    <Grid columns={1} gap={theme.spacing.sm}>
                        {testResults.map((result, index) => (
                            <Card key={result.id} style={{
                                padding: theme.spacing.sm,
                                borderLeft: `4px solid ${getStatusColor(result.status)}`
                            }}>
                                <Flex justify="space-between" align="center">
                                    <Flex gap={theme.spacing.sm} align="center">
                                        <Text variant="h4" color="primary">
                                            {getStatusIcon(result.status)} {result.crewMemberId}
                                        </Text>
                                        <Badge variant={result.status === 'success' ? 'success' : 'error'}>
                                            {result.status}
                                        </Badge>
                                        <Text variant="caption" color="secondary">
                                            {result.webhookPath}
                                        </Text>
                                    </Flex>
                                    <Flex gap={theme.spacing.sm} align="center">
                                        {result.responseTime && (
                                            <Text variant="caption" color="secondary">
                                                {result.responseTime}ms
                                            </Text>
                                        )}
                                        {result.attempts > 1 && (
                                            <Text variant="caption" color="secondary">
                                                {result.attempts} attempts
                                            </Text>
                                        )}
                                        <Text variant="caption" color="secondary">
                                            {new Date(result.timestamp).toLocaleTimeString()}
                                        </Text>
                                    </Flex>
                                </Flex>

                                <Text variant="body" color="secondary" style={{ marginTop: theme.spacing.xs }}>
                                    Task: {result.task}
                                </Text>

                                {result.error && (
                                    <Text variant="caption" color="secondary" style={{ marginTop: theme.spacing.xs }}>
                                        Error: {result.error}
                                    </Text>
                                )}
                            </Card>
                        ))}
                    </Grid>

                    <Flex justify="space-between" align="center" style={{ marginTop: theme.spacing.md }}>
                        <Text variant="body" color="secondary">
                            Environment: {testResults[0]?.environment || 'unknown'}
                        </Text>
                        <Button
                            onClick={() => setTestResults([])}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                color: theme.colors.text.inverse,
                                border: 'none',
                                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                borderRadius: theme.borderRadius.sm,
                                cursor: 'pointer'
                            }}
                        >
                            🗑️ Clear Results
                        </Button>
                    </Flex>
                </Card>
            )}
        </Card>
    );
}
