'use client';

import { useState } from 'react';

interface MissionScenario {
    id: string;
    name: string;
    description: string;
    complexity: string;
    crewRequired: string;
}

interface CrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

interface TestMissionScenarioProps {
    scenario: MissionScenario;
    onTestResult: (result: any) => void;
    crewMembers: CrewMember[];
}

export function TestMissionScenario({ scenario, onTestResult, crewMembers }: TestMissionScenarioProps) {
    const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
    const [missionDescription, setMissionDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState<any>(null);

    const getComplexityColor = (complexity: string) => {
        switch (complexity.toLowerCase()) {
            case 'high': return 'from-red-500 to-pink-500';
            case 'medium': return 'from-amber-500 to-orange-500';
            case 'low': return 'from-green-500 to-emerald-500';
            default: return 'from-gray-500 to-slate-500';
        }
    };

    const getComplexityIcon = (complexity: string) => {
        switch (complexity.toLowerCase()) {
            case 'high': return '🚨';
            case 'medium': return '⚡';
            case 'low': return '✅';
            default: return '📋';
        }
    };

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
                    scenarioId: scenario.id,
                    missionDescription: missionDescription || `Test ${scenario.name} scenario`,
                    selectedCrew: selectedCrew,
                    complexity: scenario.complexity,
                }),
            });

            const result = await response.json();
            setLastResponse(result);
            onTestResult({
                type: 'mission_scenario',
                scenario: scenario.id,
                success: response.ok,
                response: result,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Test failed:', error);
            onTestResult({
                type: 'mission_scenario',
                scenario: scenario.id,
                success: false,
                error: error.message,
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
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/60 to-white/20 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-50" />

            <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getComplexityColor(scenario.complexity)} rounded-lg flex items-center justify-center mr-3 shadow-md`}>
                                <span className="text-white text-sm">{getComplexityIcon(scenario.complexity)}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base leading-tight">
                                    {scenario.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getComplexityColor(scenario.complexity)} text-white`}>
                                        {scenario.complexity}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {scenario.crewRequired}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {scenario.description}
                        </p>
                    </div>
                </div>

                {/* Crew Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Select Crew Members:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {crewMembers.map((crew) => (
                            <button
                                key={crew.id}
                                onClick={() => toggleCrewMember(crew.id)}
                                className={`p-2 text-xs rounded-lg transition-all duration-200 ${selectedCrew.includes(crew.id)
                                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                                        : 'bg-white/40 text-slate-600 hover:bg-white/60 hover:text-slate-800'
                                    }`}
                            >
                                {crew.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mission Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Mission Description:
                    </label>
                    <textarea
                        value={missionDescription}
                        onChange={(e) => setMissionDescription(e.target.value)}
                        placeholder={`Describe the ${scenario.name.toLowerCase()} mission...`}
                        className="w-full p-3 bg-white/60 border border-white/30 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm resize-none"
                        rows={2}
                    />
                </div>

                {/* Test Button */}
                <button
                    onClick={handleTest}
                    disabled={isLoading || selectedCrew.length === 0}
                    className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Testing...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <span className="mr-2">🎯</span>
                            Test Mission
                        </div>
                    )}
                </button>

                {/* Last Response Display */}
                {lastResponse && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-xs">
                            Last Response:
                        </h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-medium ${lastResponse.success ? 'text-green-600' : 'text-red-600'}`}>
                                    {lastResponse.success ? '✅ Success' : '❌ Failed'}
                                </span>
                            </div>
                            {lastResponse.response?.testMetrics?.responseTime && (
                                <div className="flex justify-between">
                                    <span>Response Time:</span>
                                    <span className="font-medium text-blue-600">
                                        {lastResponse.response.testMetrics.responseTime}ms
                                    </span>
                                </div>
                            )}
                            {lastResponse.response?.response?.coordination_summary && (
                                <div className="flex justify-between">
                                    <span>Efficiency:</span>
                                    <span className="font-medium text-amber-600">
                                        {lastResponse.response.response.coordination_summary.coordination_efficiency}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
