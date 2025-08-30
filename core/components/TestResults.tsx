'use client';

import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, Button, Text, Flex, Grid, Badge } from '@/theme/ComponentLibrary';

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

interface TestResultsProps {
    results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
    const theme = useTheme();
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'timestamp' | 'status' | 'type'>('timestamp');

    if (results.length === 0) {
        return (
            <Card variant="primary" style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
                <Text variant="h3" color="secondary">
                    📊 No Test Results Yet
                </Text>
                <Text variant="body" color="tertiary">
                    Run some tests to see results here
                </Text>
            </Card>
        );
    }

    const filteredResults = filter === 'all'
        ? results
        : results.filter(result => result.status === filter);

    const sortedResults = [...filteredResults].sort((a, b) => {
        if (sortBy === 'timestamp') {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        } else if (sortBy === 'status') {
            return a.status.localeCompare(b.status);
        } else {
            return a.type.localeCompare(b.type);
        }
    });

    const getStatusColor = (status: string | undefined) => {
        if (!status) return theme.colors.text.tertiary;
        switch (status.toLowerCase()) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.error;
            case 'pending': return theme.colors.warning;
            default: return theme.colors.text.tertiary;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'crew_member_test': return '🧑‍🚀';
            case 'mission_scenario': return '🎯';
            case 'observation_lounge_test': return '🏛️';
            default: return '📋';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'crew_member_test': return 'Crew Member Test';
            case 'mission_scenario': return 'Mission Scenario';
            case 'observation_lounge_test': return 'Observation Lounge';
            default: return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    const stats = {
        total: results.length,
        success: results.filter(r => r.status === 'success').length,
        error: results.filter(r => r.status === 'error').length,
        pending: results.filter(r => r.status === 'pending').length,
    };

    const typeBreakdown = results.reduce((acc, result) => {
        acc[result.type] = (acc[result.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Card variant="primary">
            <Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <Text variant="h2" color="primary">
                        📊 Test Results & Analytics
                    </Text>
                    <Text variant="body" color="secondary">
                        Monitor and analyze test performance across all workflows
                    </Text>
                </div>

                {/* Statistics Dashboard */}
                <Card variant="secondary">
                    <Grid columns={4} gap={theme.spacing.md}>
                        <div style={{ textAlign: 'center' }}>
                            <Text variant="h3" color="primary">
                                {stats.total}
                            </Text>
                            <Text variant="caption" color="secondary">
                                Total Tests
                            </Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Text variant="h3" style={{ color: theme.colors.success }}>
                                {stats.success}
                            </Text>
                            <Text variant="caption" color="secondary">
                                Successful
                            </Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Text variant="h3" style={{ color: theme.colors.error }}>
                                {stats.error}
                            </Text>
                            <Text variant="caption" color="secondary">
                                Failed
                            </Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Text variant="h3" style={{ color: theme.colors.warning }}>
                                {stats.pending}
                            </Text>
                            <Text variant="caption" color="secondary">
                                Pending
                            </Text>
                        </div>
                    </Grid>
                </Card>

                {/* Filters and Controls */}
                <Card variant="accent">
                    <Flex direction="row" gap={theme.spacing.md} align="center" justify="space-between">
                        <div>
                            <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                                Filters:
                            </Text>
                            <Flex direction="row" gap={theme.spacing.sm}>
                                {['all', 'success', 'error', 'pending'].map((status) => (
                                    <Button
                                        key={status}
                                        variant={filter === status ? 'primary' : 'secondary'}
                                        size="sm"
                                        onClick={() => setFilter(status)}
                                    >
                                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                ))}
                            </Flex>
                        </div>
                        <div>
                            <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                                Sort By:
                            </Text>
                            <Flex direction="row" gap={theme.spacing.sm}>
                                {['timestamp', 'status', 'type'].map((sort) => (
                                    <Button
                                        key={sort}
                                        variant={sortBy === sort ? 'primary' : 'secondary'}
                                        size="sm"
                                        onClick={() => setSortBy(sort as any)}
                                    >
                                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                    </Button>
                                ))}
                            </Flex>
                        </div>
                    </Flex>
                </Card>

                {/* Results List */}
                <div>
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Test Results ({filteredResults.length} of {results.length}):
                    </Text>
                    <Flex direction="column" gap={theme.spacing.md}>
                        {sortedResults.map((result, index) => (
                            <Card
                                key={index}
                                variant="primary"
                                style={{
                                    border: `1px solid ${getStatusColor(result.status)}20`,
                                    background: `${getStatusColor(result.status)}05`,
                                }}
                            >
                                <Flex direction="column" gap={theme.spacing.sm}>
                                    {/* Result Header */}
                                    <Flex align="center" justify="space-between">
                                        <Flex align="center" gap={theme.spacing.sm}>
                                            <span style={{ fontSize: '24px' }}>
                                                {getTypeIcon(result.type)}
                                            </span>
                                            <div>
                                                <Text variant="h4" color="primary">
                                                    {getTypeLabel(result.type)}
                                                </Text>
                                                {result.crewMember && (
                                                    <Text variant="caption" color="secondary">
                                                        Crew Member: {result.crewMember}
                                                    </Text>
                                                )}
                                            </div>
                                        </Flex>
                                        <div style={{ textAlign: 'right' }}>
                                            <Badge
                                                variant={result.status === 'success' ? 'success' : 'error'}
                                                size="md"
                                            >
                                                {(result.status || 'UNKNOWN').toUpperCase()}
                                            </Badge>
                                            <Text variant="caption" color="tertiary" style={{ display: 'block', marginTop: theme.spacing.xs }}>
                                                {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'No timestamp'}
                                            </Text>
                                        </div>
                                    </Flex>

                                    {/* Error Details */}
                                    {result.error && (
                                        <Card variant="primary" style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.error}` }}>
                                            <Text variant="body" style={{ color: theme.colors.error }}>
                                                <strong>Error:</strong> {result.error}
                                            </Text>
                                        </Card>
                                    )}

                                    {/* Note */}
                                    {result.note && (
                                        <Card variant="primary" style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.warning}` }}>
                                            <Text variant="body" style={{ color: theme.colors.warning }}>
                                                <strong>Note:</strong> {result.note}
                                            </Text>
                                        </Card>
                                    )}

                                    {/* Test Metrics */}
                                    {result.testMetrics && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: theme.spacing.sm,
                                            fontSize: theme.typography.fontSize.sm,
                                        }}>
                                            {result.testMetrics.mode && (
                                                <div>
                                                    <strong>Mode:</strong>
                                                    <Badge variant="primary" size="sm" style={{ marginLeft: theme.spacing.xs }}>
                                                        {result.testMetrics.mode}
                                                    </Badge>
                                                </div>
                                            )}
                                            {result.testMetrics.responseTime && (
                                                <div>
                                                    <strong>Response Time:</strong>
                                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                                        {result.testMetrics.responseTime}ms
                                                    </span>
                                                </div>
                                            )}
                                            {result.testMetrics.n8nStatus && (
                                                <div>
                                                    <strong>n8n Status:</strong>
                                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.accent }}>
                                                        {result.testMetrics.n8nStatus}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Response Details */}
                                    {result.response && (
                                        <details style={{ cursor: 'pointer' }}>
                                            <summary style={{ color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium }}>
                                                View Response Details
                                            </summary>
                                            <Card variant="secondary" style={{ marginTop: theme.spacing.sm }}>
                                                <pre style={{
                                                    fontSize: theme.typography.fontSize.xs,
                                                    color: theme.colors.text.secondary,
                                                    overflow: 'auto',
                                                    whiteSpace: 'pre-wrap',
                                                }}>
                                                    {JSON.stringify(result.response, null, 2)}
                                                </pre>
                                            </Card>
                                        </details>
                                    )}
                                </Flex>
                            </Card>
                        ))}
                    </Flex>
                </div>

                {/* Type Breakdown */}
                <Card variant="secondary">
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Test Type Breakdown:
                    </Text>
                    <Grid columns={Object.keys(typeBreakdown).length} gap={theme.spacing.md}>
                        {Object.entries(typeBreakdown).map(([type, count]) => (
                            <div key={type} style={{ textAlign: 'center' }}>
                                <Text variant="h3" color="primary">
                                    {count}
                                </Text>
                                <Text variant="caption" color="secondary">
                                    {getTypeLabel(type)}
                                </Text>
                            </div>
                        ))}
                    </Grid>
                </Card>

                {/* Crew Performance */}
                <Card variant="accent">
                    <Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Crew Performance Summary:
                    </Text>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: theme.spacing.md,
                    }}>
                        {Array.from(new Set(results.map(r => r.crewMember).filter(Boolean))).map(crewMember => {
                            const crewResults = results.filter(r => r.crewMember === crewMember);
                            const successRate = crewResults.length > 0
                                ? (crewResults.filter(r => r.status === 'success').length / crewResults.length * 100).toFixed(1)
                                : 0;

                            return (
                                <div key={crewMember} style={{ textAlign: 'center' }}>
                                    <Text variant="h4" color="primary">
                                        {crewMember}
                                    </Text>
                                    <Text variant="body" color="secondary">
                                        {crewResults.length} tests
                                    </Text>
                                    <Text variant="caption" style={{ color: theme.colors.success }}>
                                        {successRate}% success rate
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Flex>
        </Card>
    );
}
