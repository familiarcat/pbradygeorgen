'use client';

import { useState } from 'react';

interface CrewMember {
    id: string;
    name: string;
    role: string;
    webhookPath: string;
    description: string;
}

interface TestObservationLoungeProps {
    crewMembers: CrewMember[];
    onTestResult: (result: any) => void;
}

export function TestObservationLounge({ crewMembers, onTestResult }: TestObservationLoungeProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [missionDirective, setMissionDirective] = useState('');
    const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
    const [lastResponse, setLastResponse] = useState<any>(null);
    const [testMode, setTestMode] = useState<'full_crew' | 'core_crew' | 'specialist_team'>('full_crew');

    const defaultDirectives = [
        "The Enterprise has detected a spatial anomaly that requires immediate investigation. Coordinate all crew members to assess the situation, develop a comprehensive response strategy, and execute coordinated actions to resolve the threat.",
        "A diplomatic crisis has emerged with a new alien species. We need strategic analysis, security assessment, and communication protocols to establish peaceful relations while protecting Federation interests.",
        "Critical system failures have been detected across multiple ship systems. Implement emergency protocols, coordinate repair efforts, and ensure mission continuity while maintaining crew safety.",
        "We've received intelligence about a potential security threat in the sector. Conduct comprehensive threat assessment, implement security measures, and develop contingency plans for various scenarios.",
        "The ship's performance metrics indicate suboptimal efficiency. Conduct a full system audit, identify optimization opportunities, and implement improvements to restore peak operational status."
    ];

    const testModes = {
        full_crew: {
            name: 'Full Crew Coordination',
            description: 'All 9 crew members working together on complex missions',
            crewCount: 9,
            complexity: 'High'
        },
        core_crew: {
            name: 'Core Crew Operations',
            description: 'Picard + Riker + 2 specialists for standard missions',
            crewCount: 4,
            complexity: 'Medium'
        },
        specialist_team: {
            name: 'Specialist Team Focus',
            description: '2-3 specialists for focused technical or business tasks',
            crewCount: 3,
            complexity: 'Low'
        }
    };

    const handleCrewSelection = (crewId: string) => {
        setSelectedCrew(prev =>
            prev.includes(crewId)
                ? prev.filter(id => id !== crewId)
                : [...prev, crewId]
        );
    };

    const handleQuickDirective = (directive: string) => {
        setMissionDirective(directive);
        setTimeout(() => handleTest(), 100);
    };

    const handleTestModeChange = (mode: 'full_crew' | 'core_crew' | 'specialist_team') => {
        setTestMode(mode);
        // Auto-select crew based on mode
        if (mode === 'full_crew') {
            setSelectedCrew(crewMembers.map(m => m.id));
        } else if (mode === 'core_crew') {
            setSelectedCrew(['picard', 'riker', 'data', 'geordi']);
        } else if (mode === 'specialist_team') {
            setSelectedCrew(['data', 'geordi', 'troi']);
        }
    };

    const handleTest = async () => {
        if (!missionDirective.trim() || selectedCrew.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/test-n8n/observation-lounge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    missionDirective,
                    selectedCrew,
                    testMode,
                    complexity: testModes[testMode].complexity,
                    testType: 'observation_lounge'
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setLastResponse(result);
                onTestResult({
                    type: 'observation_lounge_test',
                    testMode: testModes[testMode].name,
                    status: 'success',
                    crewInvolved: selectedCrew.length,
                    response: result,
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error(result.error || 'Observation Lounge test failed');
            }
        } catch (error) {
            const errorResult = {
                type: 'observation_lounge_test',
                testMode: testModes[testMode].name,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            };
            setLastResponse(errorResult);
            onTestResult(errorResult);
        } finally {
            setIsLoading(false);
        }
    };

    const getTestModeColor = (mode: string) => {
        switch (mode) {
            case 'full_crew': return 'text-red-400';
            case 'core_crew': return 'text-yellow-400';
            case 'specialist_team': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Test Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(testModes).map(([mode, config]) => (
                    <div
                        key={mode}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${testMode === mode
                                ? 'border-purple-500 bg-purple-900/20'
                                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                            }`}
                        onClick={() => handleTestModeChange(mode as any)}
                    >
                        <h4 className={`font-semibold ${getTestModeColor(mode)}`}>
                            {config.name}
                        </h4>
                        <p className="text-sm text-gray-300">{config.description}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-blue-400">Crew: {config.crewCount}</span>
                            <span className={`${getTestModeColor(mode)}`}>
                                {config.complexity} Complexity
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mission Directive */}
            <div>
                <label className="block text-sm text-gray-300 mb-2">Mission Directive:</label>
                <textarea
                    value={missionDirective}
                    onChange={(e) => setMissionDirective(e.target.value)}
                    placeholder="Enter the mission directive for the Observation Lounge..."
                    className="w-full p-3 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    rows={4}
                />
            </div>

            {/* Crew Selection */}
            <div>
                <label className="block text-sm text-gray-300 mb-2">
                    Selected Crew Members ({selectedCrew.length}/{crewMembers.length}):
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {crewMembers.map((member) => (
                        <label key={member.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-600">
                            <input
                                type="checkbox"
                                checked={selectedCrew.includes(member.id)}
                                onChange={() => handleCrewSelection(member.id)}
                                className="rounded border-gray-500 bg-gray-600 text-purple-500 focus:ring-purple-500"
                            />
                            <div>
                                <span className="text-sm text-white font-medium">{member.name}</span>
                                <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Quick Directives */}
            <div className="text-xs text-gray-400">
                <p className="mb-2">Quick Mission Directives:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {defaultDirectives.map((directive, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickDirective(directive)}
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded text-xs transition-colors text-left"
                        >
                            <span className="font-medium">Directive {index + 1}:</span> {directive.substring(0, 80)}...
                        </button>
                    ))}
                </div>
            </div>

            {/* Test Controls */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleTest}
                    disabled={isLoading || !missionDirective.trim() || selectedCrew.length === 0}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
                >
                    {isLoading ? 'Coordinating Crew...' : 'Execute Observation Lounge Test'}
                </button>

                <button
                    onClick={() => {
                        setMissionDirective('');
                        setSelectedCrew([]);
                    }}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Test Results */}
            {lastResponse && (
                <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Observation Lounge Results:</h4>
                    <div className="text-sm text-gray-300">
                        <pre className="whitespace-pre-wrap overflow-x-auto bg-gray-700 p-3 rounded">
                            {JSON.stringify(lastResponse, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
