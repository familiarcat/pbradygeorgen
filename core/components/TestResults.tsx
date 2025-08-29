'use client';

import { useState, useMemo } from 'react';

interface TestResult {
    type: string;
    status: string;
    timestamp: string;
    crewMember?: string;
    scenario?: string;
    testMode?: string;
    crewInvolved?: number;
    response?: any;
    error?: string;
    note?: string;
    testMetrics?: {
        mode?: string;
        responseTime?: number;
        n8nStatus?: string;
        webhookUrl?: string;
        n8nError?: string;
    };
}

interface TestResultsProps {
    results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'timestamp' | 'type' | 'status'>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredResults = useMemo(() => {
        let filtered = results.filter(result => {
            if (filterType !== 'all' && result.type !== filterType) return false;
            if (filterStatus !== 'all' && result.status !== filterStatus) return false;
            return true;
        });

        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'timestamp':
                    aValue = new Date(a.timestamp).getTime();
                    bValue = new Date(b.timestamp).getTime();
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [results, filterType, filterStatus, sortBy, sortOrder]);

    const statistics = useMemo(() => {
        const total = results.length;
        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'error').length;
        const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0';

        const typeBreakdown = results.reduce((acc, result) => {
            acc[result.type] = (acc[result.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const crewBreakdown = results.reduce((acc, result) => {
            if (result.crewMember) {
                acc[result.crewMember] = (acc[result.crewMember] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            successful,
            failed,
            successRate,
            typeBreakdown,
            crewBreakdown
        };
    }, [results]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'crew_member_test': return '🧪';
            case 'mission_scenario_test': return '🎯';
            case 'observation_lounge_test': return '🏛️';
            default: return '📊';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'crew_member_test': return 'Crew Member Test';
            case 'mission_scenario_test': return 'Mission Scenario Test';
            case 'observation_lounge_test': return 'Observation Lounge Test';
            default: return type;
        }
    };

    if (results.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p className="text-lg">No test results yet</p>
                <p className="text-sm">Run some tests to see results here</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{statistics.total}</div>
                    <div className="text-sm text-gray-300">Total Tests</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{statistics.successful}</div>
                    <div className="text-sm text-gray-300">Successful</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{statistics.failed}</div>
                    <div className="text-sm text-gray-300">Failed</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{statistics.successRate}%</div>
                    <div className="text-sm text-gray-300">Success Rate</div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-wrap gap-4 items-center">
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Filter by Type:</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="crew_member_test">Crew Member Tests</option>
                        <option value="mission_scenario_test">Mission Scenarios</option>
                        <option value="observation_lounge_test">Observation Lounge</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Filter by Status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="success">Successful</option>
                        <option value="error">Failed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-1">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-gray-600 border border-gray-500 rounded px-3 py-1 text-white text-sm"
                    >
                        <option value="timestamp">Timestamp</option>
                        <option value="type">Type</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
            </div>

            {/* Results List */}
            <div className="space-y-3">
                {filteredResults.map((result, index) => (
                    <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-700/50">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getTypeIcon(result.type)}</span>
                                <div>
                                    <h4 className="font-semibold text-white">
                                        {getTypeLabel(result.type)}
                                    </h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        {result.crewMember && (
                                            <span>Crew: {result.crewMember}</span>
                                        )}
                                        {result.scenario && (
                                            <span>Scenario: {result.scenario}</span>
                                        )}
                                        {result.testMode && (
                                            <span>Mode: {result.testMode}</span>
                                        )}
                                        {result.crewInvolved && (
                                            <span>Crew Involved: {result.crewInvolved}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-semibold ${getStatusColor(result.status || 'unknown')}`}>
                                    {(result.status || 'UNKNOWN').toUpperCase()}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'No timestamp'}
                                </div>
                            </div>
                        </div>

                        {result.error && (
                            <div className="bg-red-900/20 border border-red-500 rounded p-3 mb-3">
                                <div className="text-red-400 font-semibold mb-1">Error:</div>
                                <div className="text-red-300 text-sm">{result.error}</div>
                            </div>
                        )}

                        {result.note && (
                            <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3 mb-3">
                                <div className="text-yellow-400 font-semibold mb-1">Note:</div>
                                <div className="text-yellow-300 text-sm">{result.note}</div>
                            </div>
                        )}

                        {result.testMetrics && (
                            <div className="bg-blue-900/20 border border-blue-500 rounded p-3 mb-3">
                                <div className="text-blue-400 font-semibold mb-1">Test Metrics:</div>
                                <div className="text-blue-300 text-sm">
                                    <div>Mode: {result.testMetrics.mode || 'unknown'}</div>
                                    <div>Response Time: {result.testMetrics.responseTime || 0}ms</div>
                                    <div>n8n Status: {result.testMetrics.n8nStatus || 'unknown'}</div>
                                </div>
                            </div>
                        )}

                        {result.response && (
                            <details className="cursor-pointer">
                                <summary className="text-blue-400 hover:text-blue-300 font-medium">
                                    View Response Details
                                </summary>
                                <div className="mt-2 p-3 bg-gray-600 rounded">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                        {JSON.stringify(result.response, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </div>
                ))}
            </div>

            {/* Type Breakdown Chart */}
            {Object.keys(statistics.typeBreakdown).length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Test Type Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(statistics.typeBreakdown).map(([type, count]) => (
                            <div key={type} className="text-center">
                                <div className="text-2xl font-bold text-blue-400">{count}</div>
                                <div className="text-sm text-gray-300">{getTypeLabel(type)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Crew Performance */}
            {Object.keys(statistics.crewBreakdown).length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Crew Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(statistics.crewBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .map(([crew, count]) => (
                                <div key={crew} className="text-center">
                                    <div className="text-xl font-bold text-green-400">{count}</div>
                                    <div className="text-sm text-gray-300">{crew}</div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
