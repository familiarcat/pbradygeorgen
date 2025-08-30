'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Button, Text, Flex, Grid, Badge, Icon } from '@/theme/ComponentLibrary';

interface CrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

interface TestScenario {
    id: string;
    name: string;
    description: string;
    task: string;
    expectedOutcome: string;
    complexity: 'Low' | 'Medium' | 'High';
    category: string;
}

interface TestResult {
    id: string;
    crewMemberId: string;
    scenarioId: string;
    status: 'pending' | 'running' | 'success' | 'error';
    startTime?: Date;
    endTime?: Date;
    responseTime?: number;
    response?: any;
    error?: string;
}

interface AutomatedN8NTestingProps {
    crewMembers: CrewMember[];
    onTestResult: (result: any) => void;
}

export function AutomatedN8NTesting({ crewMembers, onTestResult }: AutomatedN8NTestingProps) {
    const theme = useTheme();
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
    const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    // Role-specific test scenarios for each crew member
    const testScenarios: TestScenario[] = [
        // Strategic Leadership & Mission Command (Picard)
        {
            id: 'strategic_analysis',
            name: 'Strategic Business Analysis',
            description: 'High-level strategic assessment of business opportunities',
            task: 'Conduct comprehensive strategic analysis of market positioning and competitive landscape',
            expectedOutcome: 'Strategic recommendations with risk assessment',
            complexity: 'High',
            category: 'strategic_leadership'
        },
        {
            id: 'mission_planning',
            name: 'Mission Planning & Coordination',
            description: 'Complex mission planning with multiple stakeholders',
            task: 'Develop comprehensive mission plan for new product launch with timeline and resource allocation',
            expectedOutcome: 'Detailed mission plan with milestones and contingencies',
            complexity: 'High',
            category: 'strategic_leadership'
        },

        // Tactical Execution & Workflow Management (Riker)
        {
            id: 'workflow_optimization',
            name: 'Workflow Optimization',
            description: 'Process improvement and workflow efficiency analysis',
            task: 'Analyze current workflow processes and identify optimization opportunities',
            expectedOutcome: 'Workflow improvement recommendations with efficiency metrics',
            complexity: 'Medium',
            category: 'tactical_execution'
        },
        {
            id: 'project_execution',
            name: 'Project Execution Planning',
            description: 'Tactical project execution with resource management',
            task: 'Create detailed execution plan for technical implementation project',
            expectedOutcome: 'Execution timeline with resource allocation and risk mitigation',
            complexity: 'Medium',
            category: 'tactical_execution'
        },

        // Analytics & Logic Operations (Data)
        {
            id: 'data_analysis',
            name: 'Advanced Data Analysis',
            description: 'Complex data analysis and pattern recognition',
            task: 'Perform comprehensive data analysis on user behavior patterns and system performance metrics',
            expectedOutcome: 'Detailed analytical report with insights and recommendations',
            complexity: 'High',
            category: 'analytics'
        },
        {
            id: 'logical_assessment',
            name: 'Logical System Assessment',
            description: 'Systematic logical analysis of complex problems',
            task: 'Conduct logical assessment of system architecture and identify optimization opportunities',
            expectedOutcome: 'Logical analysis report with systematic recommendations',
            complexity: 'Medium',
            category: 'analytics'
        },

        // Health & Diagnostics Officer (Crusher)
        {
            id: 'system_health',
            name: 'System Health Assessment',
            description: 'Comprehensive system health and performance analysis',
            task: 'Perform complete system health assessment including performance metrics and potential issues',
            expectedOutcome: 'Health assessment report with diagnostics and recommendations',
            complexity: 'Medium',
            category: 'health_diagnostics'
        },
        {
            id: 'performance_diagnostics',
            name: 'Performance Diagnostics',
            description: 'Deep performance analysis and optimization',
            task: 'Analyze system performance bottlenecks and provide optimization strategies',
            expectedOutcome: 'Performance analysis with optimization recommendations',
            complexity: 'Medium',
            category: 'health_diagnostics'
        },

        // Security & Compliance Operations (Worf)
        {
            id: 'security_assessment',
            name: 'Security Threat Assessment',
            description: 'Comprehensive security analysis and threat assessment',
            task: 'Conduct thorough security assessment including vulnerability analysis and threat modeling',
            expectedOutcome: 'Security assessment report with threat analysis and mitigation strategies',
            complexity: 'High',
            category: 'security_compliance'
        },
        {
            id: 'compliance_audit',
            name: 'Compliance Audit',
            description: 'Regulatory compliance and policy adherence review',
            task: 'Perform compliance audit for data protection and regulatory requirements',
            expectedOutcome: 'Compliance audit report with recommendations and action items',
            complexity: 'Medium',
            category: 'security_compliance'
        },

        // User Experience & Empathy Analysis (Troi)
        {
            id: 'user_experience',
            name: 'User Experience Analysis',
            description: 'Empathetic user experience and needs assessment',
            task: 'Analyze user experience patterns and identify emotional and functional needs',
            expectedOutcome: 'UX analysis report with empathy insights and improvement recommendations',
            complexity: 'Medium',
            category: 'user_experience'
        },
        {
            id: 'empathy_mapping',
            name: 'Empathy Mapping',
            description: 'User empathy mapping and emotional intelligence analysis',
            task: 'Create comprehensive empathy map for target user personas and their emotional journey',
            expectedOutcome: 'Empathy mapping report with user journey insights',
            complexity: 'Low',
            category: 'user_experience'
        },

        // Business Intelligence & Budget Optimization (Quark)
        {
            id: 'business_intelligence',
            name: 'Business Intelligence Analysis',
            description: 'Market analysis and business opportunity assessment',
            task: 'Conduct business intelligence analysis including market trends and competitive positioning',
            expectedOutcome: 'Business intelligence report with market insights and opportunities',
            complexity: 'Medium',
            category: 'business_intelligence'
        },
        {
            id: 'budget_optimization',
            name: 'Budget Optimization',
            description: 'Resource allocation and budget efficiency analysis',
            task: 'Analyze current budget allocation and identify optimization opportunities for cost efficiency',
            expectedOutcome: 'Budget optimization report with cost-saving recommendations',
            complexity: 'Medium',
            category: 'business_intelligence'
        },

        // Infrastructure & System Integration (La Forge)
        {
            id: 'infrastructure_assessment',
            name: 'Infrastructure Assessment',
            description: 'Technical infrastructure analysis and optimization',
            task: 'Perform comprehensive infrastructure assessment including scalability and performance analysis',
            expectedOutcome: 'Infrastructure assessment report with optimization recommendations',
            complexity: 'High',
            category: 'infrastructure'
        },
        {
            id: 'system_integration',
            name: 'System Integration Analysis',
            description: 'Integration architecture and compatibility assessment',
            task: 'Analyze system integration requirements and identify optimal integration strategies',
            expectedOutcome: 'Integration analysis report with architecture recommendations',
            complexity: 'High',
            category: 'infrastructure'
        },

        // Communications & I/O Operations (Uhura)
        {
            id: 'communication_analysis',
            name: 'Communication Protocol Analysis',
            description: 'Communication system analysis and optimization',
            task: 'Analyze communication protocols and identify optimization opportunities for data transmission',
            expectedOutcome: 'Communication analysis report with protocol optimization recommendations',
            complexity: 'Medium',
            category: 'communications'
        },
        {
            id: 'data_flow_optimization',
            name: 'Data Flow Optimization',
            description: 'Data flow analysis and I/O optimization',
            task: 'Analyze data flow patterns and optimize input/output operations for maximum efficiency',
            expectedOutcome: 'Data flow optimization report with I/O improvement recommendations',
            complexity: 'Medium',
            category: 'communications'
        }
    ];

    // Map crew members to their scenario categories
    const crewScenarioMap: { [key: string]: string[] } = {
        'picard': ['strategic_leadership'],
        'data': ['analytics'],
        'crusher': ['health_diagnostics'],
        'worf': ['security_compliance'],
        'troi': ['user_experience'],
        'quark': ['business_intelligence'],
        'geordi': ['infrastructure'],
        'uhura': ['communications']
    };

    const handleScenarioToggle = (scenarioId: string) => {
        setSelectedScenarios(prev =>
            prev.includes(scenarioId)
                ? prev.filter(id => id !== scenarioId)
                : [...prev, scenarioId]
        );
    };

    const handleCrewToggle = (crewId: string) => {
        setSelectedCrew(prev =>
            prev.includes(crewId)
                ? prev.filter(id => id !== crewId)
                : [...prev, crewId]
        );
    };

    const selectAllScenarios = () => {
        setSelectedScenarios(testScenarios.map(s => s.id));
    };

    const selectAllCrew = () => {
        setSelectedCrew(crewMembers.map(c => c.id));
    };

    const clearAll = () => {
        setSelectedScenarios([]);
        setSelectedCrew([]);
        setTestResults([]);
    };

    const runAutomatedTests = async () => {
        if (selectedCrew.length === 0 || selectedScenarios.length === 0) {
            alert('Please select at least one crew member and one test scenario.');
            return;
        }

        setIsRunning(true);
        setTestResults([]);

        // Create test combinations
        const testCombinations: { crewId: string; scenarioId: string }[] = [];

        for (const crewId of selectedCrew) {
            const crewCategories = crewScenarioMap[crewId] || [];
            for (const scenarioId of selectedScenarios) {
                const scenario = testScenarios.find(s => s.id === scenarioId);
                if (scenario && crewCategories.includes(scenario.category)) {
                    testCombinations.push({ crewId, scenarioId });
                }
            }
        }

        setProgress({ current: 0, total: testCombinations.length });

        // Run tests sequentially to avoid overwhelming the n8n server
        for (let i = 0; i < testCombinations.length; i++) {
            const { crewId, scenarioId } = testCombinations[i];
            const crewMember = crewMembers.find(c => c.id === crewId);
            const scenario = testScenarios.find(s => s.id === scenarioId);

            if (!crewMember || !scenario) continue;

            // Create test result entry
            const testResult: TestResult = {
                id: `${crewId}_${scenarioId}_${Date.now()}`,
                crewMemberId: crewId,
                scenarioId: scenarioId,
                status: 'running',
                startTime: new Date()
            };

            setTestResults(prev => [...prev, testResult]);

            try {
                const response = await fetch('/api/test-n8n/crew-member', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        crewMemberId: crewId,
                        webhookPath: crewMember.webhookPath,
                        task: scenario.task,
                        scenario: scenario.name,
                        expectedOutcome: scenario.expectedOutcome,
                        complexity: scenario.complexity
                    }),
                });

                const result = await response.json();
                const endTime = new Date();
                const responseTime = endTime.getTime() - testResult.startTime!.getTime();

                // Update test result
                const updatedResult: TestResult = {
                    ...testResult,
                    status: result.success ? 'success' : 'error',
                    endTime,
                    responseTime,
                    response: result,
                    error: result.error
                };

                setTestResults(prev =>
                    prev.map(r => r.id === testResult.id ? updatedResult : r)
                );

                // Report to parent component
                onTestResult({
                    type: 'automated_test',
                    crewMemberId: crewId,
                    scenarioId: scenarioId,
                    scenarioName: scenario.name,
                    success: result.success,
                    response: result,
                    timestamp: new Date().toISOString(),
                });

                // Add delay between tests to be respectful to n8n server
                if (i < testCombinations.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                const endTime = new Date();
                const responseTime = endTime.getTime() - testResult.startTime!.getTime();

                const updatedResult: TestResult = {
                    ...testResult,
                    status: 'error',
                    endTime,
                    responseTime,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };

                setTestResults(prev =>
                    prev.map(r => r.id === testResult.id ? updatedResult : r)
                );
            }

            setProgress({ current: i + 1, total: testCombinations.length });
        }

        setIsRunning(false);
    };

    const getScenarioCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            strategic_leadership: theme.colors.primary,
            tactical_execution: theme.colors.secondary,
            analytics: theme.colors.accent,
            health_diagnostics: theme.colors.success,
            security_compliance: theme.colors.error,
            user_experience: theme.colors.warning,
            business_intelligence: theme.colors.info,
            infrastructure: theme.colors.primary,
            communications: theme.colors.secondary
        };
        return colors[category] || theme.colors.text.tertiary;
    };

    const getComplexityColor = (complexity: string) => {
        switch (complexity) {
            case 'Low': return theme.colors.success;
            case 'Medium': return theme.colors.warning;
            case 'High': return theme.colors.error;
            default: return theme.colors.text.tertiary;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.error;
            case 'running': return theme.colors.warning;
            case 'pending': return theme.colors.text.tertiary;
            default: return theme.colors.text.tertiary;
        }
    };

    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const runningCount = testResults.filter(r => r.status === 'running').length;

    return (
        <Card variant="primary">
            <Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <Text variant="h2" color="primary">
                        🤖 Automated N8N Testing Suite
                    </Text>
                    <Text variant="body" color="secondary">
                        Comprehensive automated testing for all crew member endpoints
                    </Text>
                </div>

                {/* Test Scenarios Selection */}
                <div>
                    <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing.md }}>
                        <Text variant="h4" color="primary">
                            Test Scenarios ({selectedScenarios.length}/{testScenarios.length})
                        </Text>
                        <Flex gap={theme.spacing.sm}>
                            <Button variant="secondary" size="sm" onClick={selectAllScenarios}>
                                Select All
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedScenarios([])}>
                                Clear All
                            </Button>
                        </Flex>
                    </Flex>

                    <Grid columns={3} gap={theme.spacing.md}>
                        {testScenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedScenarios.includes(scenario.id) ? `2px solid ${getScenarioCategoryColor(scenario.category)}` : undefined,
                                    background: selectedScenarios.includes(scenario.id) ? `${getScenarioCategoryColor(scenario.category)}10` : undefined,
                                    borderRadius: theme.borderRadius.md,
                                    padding: theme.spacing.sm,
                                    transition: theme.transitions.normal,
                                }}
                                onClick={() => handleScenarioToggle(scenario.id)}
                            >
                                <Card variant="primary">
                                    <Flex direction="column" gap={theme.spacing.sm}>
                                        <Text variant="h4" color="primary">
                                            {scenario.name}
                                        </Text>
                                        <Text variant="caption" color="secondary">
                                            {scenario.description}
                                        </Text>
                                        <Flex gap={theme.spacing.xs}>
                                            <Badge variant="primary" size="sm">
                                                {scenario.category.replace('_', ' ')}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                size="sm"
                                                style={{ color: getComplexityColor(scenario.complexity) }}
                                            >
                                                {scenario.complexity}
                                            </Badge>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </div>
                        ))}
                    </Grid>
                </div>

                {/* Crew Member Selection */}
                <div>
                    <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing.md }}>
                        <Text variant="h4" color="primary">
                            Crew Members ({selectedCrew.length}/{crewMembers.length})
                        </Text>
                        <Flex gap={theme.spacing.sm}>
                            <Button variant="secondary" size="sm" onClick={selectAllCrew}>
                                Select All
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setSelectedCrew([])}>
                                Clear All
                            </Button>
                        </Flex>
                    </Flex>

                    <Grid columns={3} gap={theme.spacing.md}>
                        {crewMembers.map((member) => (
                            <div
                                key={member.id}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedCrew.includes(member.id) ? `2px solid ${theme.colors.secondary}` : undefined,
                                    background: selectedCrew.includes(member.id) ? `${theme.colors.secondary}10` : undefined,
                                    borderRadius: theme.borderRadius.md,
                                    padding: theme.spacing.sm,
                                    transition: theme.transitions.normal,
                                }}
                                onClick={() => handleCrewToggle(member.id)}
                            >
                                <Card variant="primary">
                                    <Flex direction="column" gap={theme.spacing.sm}>
                                        <Text variant="h4" color="primary">
                                            {member.name}
                                        </Text>
                                        <Text variant="caption" color="secondary">
                                            {member.role}
                                        </Text>
                                    </Flex>
                                </Card>
                            </div>
                        ))}
                    </Grid>
                </div>

                {/* Test Controls */}
                <div style={{ textAlign: 'center' }}>
                    <Flex gap={theme.spacing.md} justify="center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={runAutomatedTests}
                            disabled={isRunning || selectedCrew.length === 0 || selectedScenarios.length === 0}
                        >
                            {isRunning ? (
                                <Flex align="center" gap={theme.spacing.sm}>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    Running Tests... ({progress.current}/{progress.total})
                                </Flex>
                            ) : (
                                <Flex align="center" gap={theme.spacing.sm}>
                                    <Icon icon="🤖" size="md" />
                                    Run Automated Tests
                                </Flex>
                            )}
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={clearAll}
                            disabled={isRunning}
                        >
                            Clear All
                        </Button>
                    </Flex>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                    <div>
                        <Flex align="center" justify="space-between" style={{ marginBottom: theme.spacing.md }}>
                            <Text variant="h4" color="primary">
                                Test Results ({testResults.length})
                            </Text>
                            <Flex gap={theme.spacing.sm}>
                                <Badge variant="success" size="sm">
                                    ✅ {successCount} Success
                                </Badge>
                                <Badge variant="error" size="sm">
                                    ❌ {errorCount} Errors
                                </Badge>
                                {runningCount > 0 && (
                                    <Badge variant="warning" size="sm">
                                        🔄 {runningCount} Running
                                    </Badge>
                                )}
                            </Flex>
                        </Flex>

                        <Grid columns={2} gap={theme.spacing.md}>
                            {testResults.map((result) => {
                                const crewMember = crewMembers.find(c => c.id === result.crewMemberId);
                                const scenario = testScenarios.find(s => s.id === result.scenarioId);

                                return (
                                    <Card key={result.id} variant="primary">
                                        <Flex direction="column" gap={theme.spacing.sm}>
                                            <Flex align="center" justify="space-between">
                                                <Text variant="h4" color="primary">
                                                    {crewMember?.name} - {scenario?.name}
                                                </Text>
                                                <Badge
                                                    variant={result.status === 'success' ? 'success' : result.status === 'error' ? 'error' : 'warning'}
                                                    size="sm"
                                                >
                                                    {result.status.toUpperCase()}
                                                </Badge>
                                            </Flex>

                                            {result.responseTime && (
                                                <Text variant="caption" color="secondary">
                                                    Response Time: {result.responseTime}ms
                                                </Text>
                                            )}

                                            {result.error && (
                                                <Text variant="caption" style={{ color: theme.colors.error }}>
                                                    Error: {result.error}
                                                </Text>
                                            )}

                                            {result.response?.testMetrics?.n8nStatus && (
                                                <Text variant="caption" color="secondary">
                                                    n8n Status: {result.response.testMetrics.n8nStatus}
                                                </Text>
                                            )}
                                        </Flex>
                                    </Card>
                                );
                            })}
                        </Grid>
                    </div>
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
