'use client';

import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Button, Input, Text, Badge, Flex, Grid } from '@/theme/ComponentLibrary';

interface CrewMember {
    id: string;
    name: string;
    abbreviation: string;
    role: string;
    description: string;
    webhookPath: string;
}

interface TestCrewMemberProps {
    member: CrewMember;
    onTestResult: (result: any) => void;
    isActive?: boolean;
    onToggleActive?: (id: string) => void;
}

export function TestCrewMember({ member, onTestResult, isActive = false, onToggleActive }: TestCrewMemberProps) {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [customTask, setCustomTask] = useState('');

    const getRoleColor = (role: string) => {
        if (role.includes('Strategic')) return theme.colors.primary;
        if (role.includes('Tactical')) return theme.colors.secondary;
        if (role.includes('Analytics')) return theme.colors.info;
        if (role.includes('Infrastructure')) return theme.colors.accent;
        if (role.includes('Health')) return theme.colors.success;
        if (role.includes('Security')) return theme.colors.warning;
        if (role.includes('User Experience')) return theme.colors.secondary;
        if (role.includes('Communications')) return theme.colors.info;
        if (role.includes('Business')) return theme.colors.accent;
        return theme.colors.text.tertiary;
    };

    const handleQuickTest = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/test-n8n/crew-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crewMemberId: member.id,
                    webhookPath: member.webhookPath,
                    task: 'Quick strategic analysis test'
                }),
            });

            const result = await response.json();

            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: result.success ? 'success' : 'error',
                response: result,
                timestamp: new Date().toISOString(),
                note: result.note || 'Quick test completed',
                testMetrics: result.testMetrics || {}
            });
        } catch (error) {
            console.error('Quick test failed:', error);
            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomTest = async () => {
        if (isLoading || !customTask.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/test-n8n/crew-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crewMemberId: member.id,
                    webhookPath: member.webhookPath,
                    task: customTask.trim()
                }),
            });

            const result = await response.json();

            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: result.success ? 'success' : 'error',
                response: result,
                timestamp: new Date().toISOString(),
                note: result.note || 'Custom test completed',
                testMetrics: result.testMetrics || {}
            });
        } catch (error) {
            console.error('Custom test failed:', error);
            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const roleColor = getRoleColor(member.role);

    return (
        <Card
            variant="primary"
            style={{
                border: isActive ? `2px solid ${theme.colors.primary}` : undefined,
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transition: theme.transitions.normal,
            }}
        >
            <Flex direction="column" gap={theme.spacing.md}>
                {/* Header */}
                <Flex align="center" justify="space-between">
                    <Badge
                        variant="primary"
                        size="md"
                        style={{ background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%)` }}
                    >
                        {member.abbreviation}
                    </Badge>

                    {onToggleActive && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onToggleActive(member.id)}
                            style={{
                                background: isActive ? theme.colors.primary : theme.colors.background.secondary,
                                color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
                            }}
                        >
                            {isActive ? '✓' : '○'}
                        </Button>
                    )}
                </Flex>

                {/* Member Info */}
                <div>
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.xs }}>
                        {member.name}
                    </Text>
                    <Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.sm }}>
                        {member.role}
                    </Text>
                    <Text variant="caption" color="tertiary">
                        {member.description}
                    </Text>
                </div>

                {/* Task Input */}
                <Input
                    value={customTask}
                    onChange={setCustomTask}
                    placeholder={`Enter task for ${member.name.split(' ')[0]}...`}
                    type="text"
                    style={{ marginBottom: theme.spacing.sm }}
                />

                {/* Action Buttons */}
                <Grid columns={2} gap={theme.spacing.sm}>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleQuickTest}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? (
                            <Flex align="center" gap={theme.spacing.xs}>
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
                            <Flex align="center" gap={theme.spacing.xs}>
                                <span>⚡</span>
                                Quick Test
                            </Flex>
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleCustomTest}
                        disabled={isLoading || !customTask.trim()}
                        style={{ width: '100%' }}
                    >
                        <Flex align="center" gap={theme.spacing.xs}>
                            <span>🎯</span>
                            Custom Test
                        </Flex>
                    </Button>
                </Grid>
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
