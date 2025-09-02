"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResults = TestResults;
const react_1 = require("react");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
function TestResults({ results }) {
    const theme = (0, ThemeProvider_1.useTheme)();
    const [filter, setFilter] = (0, react_1.useState)('all');
    const [sortBy, setSortBy] = (0, react_1.useState)('timestamp');
    if (results.length === 0) {
        return (<ComponentLibrary_1.Card variant="primary" style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
                <ComponentLibrary_1.Text variant="h3" color="secondary">
                    📊 No Test Results Yet
                </ComponentLibrary_1.Text>
                <ComponentLibrary_1.Text variant="body" color="tertiary">
                    Run some tests to see results here
                </ComponentLibrary_1.Text>
            </ComponentLibrary_1.Card>);
    }
    const filteredResults = filter === 'all'
        ? results
        : results.filter(result => result.status === filter);
    const sortedResults = [...filteredResults].sort((a, b) => {
        if (sortBy === 'timestamp') {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        else if (sortBy === 'status') {
            return a.status.localeCompare(b.status);
        }
        else {
            return a.type.localeCompare(b.type);
        }
    });
    const getStatusColor = (status) => {
        if (!status)
            return theme.colors.text.tertiary;
        switch (status.toLowerCase()) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.error;
            case 'pending': return theme.colors.warning;
            default: return theme.colors.text.tertiary;
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'crew_member_test': return '🧑‍🚀';
            case 'mission_scenario': return '🎯';
            case 'observation_lounge_test': return '🏛️';
            default: return '📋';
        }
    };
    const getTypeLabel = (type) => {
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
    }, {});
    return (<ComponentLibrary_1.Card variant="primary">
            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.lg}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <ComponentLibrary_1.Text variant="h2" color="primary">
                        📊 Test Results & Analytics
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Text variant="body" color="secondary">
                        Monitor and analyze test performance across all workflows
                    </ComponentLibrary_1.Text>
                </div>

                {/* Statistics Dashboard */}
                <ComponentLibrary_1.Card variant="secondary">
                    <ComponentLibrary_1.Grid columns={4} gap={theme.spacing.md}>
                        <div style={{ textAlign: 'center' }}>
                            <ComponentLibrary_1.Text variant="h3" color="primary">
                                {stats.total}
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Text variant="caption" color="secondary">
                                Total Tests
                            </ComponentLibrary_1.Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <ComponentLibrary_1.Text variant="h3" style={{ color: theme.colors.success }}>
                                {stats.success}
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Text variant="caption" color="secondary">
                                Successful
                            </ComponentLibrary_1.Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <ComponentLibrary_1.Text variant="h3" style={{ color: theme.colors.error }}>
                                {stats.error}
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Text variant="caption" color="secondary">
                                Failed
                            </ComponentLibrary_1.Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <ComponentLibrary_1.Text variant="h3" style={{ color: theme.colors.warning }}>
                                {stats.pending}
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Text variant="caption" color="secondary">
                                Pending
                            </ComponentLibrary_1.Text>
                        </div>
                    </ComponentLibrary_1.Grid>
                </ComponentLibrary_1.Card>

                {/* Filters and Controls */}
                <ComponentLibrary_1.Card variant="accent">
                    <ComponentLibrary_1.Flex direction="row" gap={theme.spacing.md} align="center" justify="space-between">
                        <div>
                            <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                                Filters:
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Flex direction="row" gap={theme.spacing.sm}>
                                {['all', 'success', 'error', 'pending'].map((status) => (<ComponentLibrary_1.Button key={status} variant={filter === status ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter(status)}>
                                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </ComponentLibrary_1.Button>))}
                            </ComponentLibrary_1.Flex>
                        </div>
                        <div>
                            <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                                Sort By:
                            </ComponentLibrary_1.Text>
                            <ComponentLibrary_1.Flex direction="row" gap={theme.spacing.sm}>
                                {['timestamp', 'status', 'type'].map((sort) => (<ComponentLibrary_1.Button key={sort} variant={sortBy === sort ? 'primary' : 'secondary'} size="sm" onClick={() => setSortBy(sort)}>
                                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                    </ComponentLibrary_1.Button>))}
                            </ComponentLibrary_1.Flex>
                        </div>
                    </ComponentLibrary_1.Flex>
                </ComponentLibrary_1.Card>

                {/* Results List */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Test Results ({filteredResults.length} of {results.length}):
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                        {sortedResults.map((result, index) => (<ComponentLibrary_1.Card key={index} variant="primary" style={{
                border: `1px solid ${getStatusColor(result.status)}20`,
                background: `${getStatusColor(result.status)}05`,
            }}>
                                <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.sm}>
                                    {/* Result Header */}
                                    <ComponentLibrary_1.Flex align="center" justify="space-between">
                                        <ComponentLibrary_1.Flex align="center" gap={theme.spacing.sm}>
                                            <span style={{ fontSize: '24px' }}>
                                                {getTypeIcon(result.type)}
                                            </span>
                                            <div>
                                                <ComponentLibrary_1.Text variant="h4" color="primary">
                                                    {getTypeLabel(result.type)}
                                                </ComponentLibrary_1.Text>
                                                {result.crewMember && (<ComponentLibrary_1.Text variant="caption" color="secondary">
                                                        Crew Member: {result.crewMember}
                                                    </ComponentLibrary_1.Text>)}
                                            </div>
                                        </ComponentLibrary_1.Flex>
                                        <div style={{ textAlign: 'right' }}>
                                            <ComponentLibrary_1.Badge variant={result.status === 'success' ? 'success' : 'error'} size="md">
                                                {(result.status || 'UNKNOWN').toUpperCase()}
                                            </ComponentLibrary_1.Badge>
                                            <ComponentLibrary_1.Text variant="caption" color="tertiary" style={{ display: 'block', marginTop: theme.spacing.xs }}>
                                                {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'No timestamp'}
                                            </ComponentLibrary_1.Text>
                                        </div>
                                    </ComponentLibrary_1.Flex>

                                    {/* Error Details */}
                                    {result.error && (<ComponentLibrary_1.Card variant="primary" style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.error}` }}>
                                            <ComponentLibrary_1.Text variant="body" style={{ color: theme.colors.error }}>
                                                <strong>Error:</strong> {result.error}
                                            </ComponentLibrary_1.Text>
                                        </ComponentLibrary_1.Card>)}

                                    {/* Note */}
                                    {result.note && (<ComponentLibrary_1.Card variant="primary" style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.warning}` }}>
                                            <ComponentLibrary_1.Text variant="body" style={{ color: theme.colors.warning }}>
                                                <strong>Note:</strong> {result.note}
                                            </ComponentLibrary_1.Text>
                                        </ComponentLibrary_1.Card>)}

                                    {/* Test Metrics */}
                                    {result.testMetrics && (<div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: theme.spacing.sm,
                    fontSize: theme.typography.fontSize.sm,
                }}>
                                            {result.testMetrics.mode && (<div>
                                                    <strong>Mode:</strong>
                                                    <ComponentLibrary_1.Badge variant="primary" size="sm" style={{ marginLeft: theme.spacing.xs }}>
                                                        {result.testMetrics.mode}
                                                    </ComponentLibrary_1.Badge>
                                                </div>)}
                                            {result.testMetrics.responseTime && (<div>
                                                    <strong>Response Time:</strong>
                                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.info }}>
                                                        {result.testMetrics.responseTime}ms
                                                    </span>
                                                </div>)}
                                            {result.testMetrics.n8nStatus && (<div>
                                                    <strong>n8n Status:</strong>
                                                    <span style={{ marginLeft: theme.spacing.xs, color: theme.colors.accent }}>
                                                        {result.testMetrics.n8nStatus}
                                                    </span>
                                                </div>)}
                                        </div>)}

                                    {/* Response Details */}
                                    {result.response && (<details style={{ cursor: 'pointer' }}>
                                            <summary style={{ color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium }}>
                                                View Response Details
                                            </summary>
                                            <ComponentLibrary_1.Card variant="secondary" style={{ marginTop: theme.spacing.sm }}>
                                                <pre style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.secondary,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                }}>
                                                    {JSON.stringify(result.response, null, 2)}
                                                </pre>
                                            </ComponentLibrary_1.Card>
                                        </details>)}
                                </ComponentLibrary_1.Flex>
                            </ComponentLibrary_1.Card>))}
                    </ComponentLibrary_1.Flex>
                </div>

                {/* Type Breakdown */}
                <ComponentLibrary_1.Card variant="secondary">
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Test Type Breakdown:
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Grid columns={Object.keys(typeBreakdown).length} gap={theme.spacing.md}>
                        {Object.entries(typeBreakdown).map(([type, count]) => (<div key={type} style={{ textAlign: 'center' }}>
                                <ComponentLibrary_1.Text variant="h3" color="primary">
                                    {count}
                                </ComponentLibrary_1.Text>
                                <ComponentLibrary_1.Text variant="caption" color="secondary">
                                    {getTypeLabel(type)}
                                </ComponentLibrary_1.Text>
                            </div>))}
                    </ComponentLibrary_1.Grid>
                </ComponentLibrary_1.Card>

                {/* Crew Performance */}
                <ComponentLibrary_1.Card variant="accent">
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        Crew Performance Summary:
                    </ComponentLibrary_1.Text>
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
            return (<div key={crewMember} style={{ textAlign: 'center' }}>
                                    <ComponentLibrary_1.Text variant="h4" color="primary">
                                        {crewMember}
                                    </ComponentLibrary_1.Text>
                                    <ComponentLibrary_1.Text variant="body" color="secondary">
                                        {crewResults.length} tests
                                    </ComponentLibrary_1.Text>
                                    <ComponentLibrary_1.Text variant="caption" style={{ color: theme.colors.success }}>
                                        {successRate}% success rate
                                    </ComponentLibrary_1.Text>
                                </div>);
        })}
                    </div>
                </ComponentLibrary_1.Card>
            </ComponentLibrary_1.Flex>
        </ComponentLibrary_1.Card>);
}
//# sourceMappingURL=TestResults.js.map