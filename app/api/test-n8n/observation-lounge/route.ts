import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { missionDirective, selectedCrew, testMode, complexity } = await request.json();

        if (!missionDirective || !selectedCrew || selectedCrew.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields: missionDirective, selectedCrew' },
                { status: 400 }
            );
        }

        console.log(`🏛️ Testing Observation Lounge: ${testMode} mode with ${selectedCrew.length} crew members`);

        // Get n8n base URL from environment
        const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';

        const startTime = Date.now();
        const crewResponses: any[] = [];
        const failedCrew: any[] = [];

        // Coordinate individual crew members since there's no comprehensive workflow
        for (const crewMember of selectedCrew) {
            try {
                // Map crew member IDs to their actual webhook paths on the n8n server
                const webhookPathMap: Record<string, string> = {
                    'picard': 'crew-captain-jean-luc-picard',
                    'data': 'crew-commander-data',
                    'riker': 'crew-commander-william-riker',
                    'geordi': 'crew-lieutenant-commander-geordi-la-forge',
                    'crusher': 'crew-dr-beverly-crusher',
                    'worf': 'crew-lieutenant-worf',
                    'troi': 'crew-counselor-deanna-troi',
                    'uhura': 'crew-lieutenant-uhura',
                    'quark': 'crew-quark'
                };

                const webhookPath = webhookPathMap[crewMember] || `crew-${crewMember}`;
                const webhookUrl = `${n8nBaseUrl}/webhook/${webhookPath}`;

                console.log(`🧑‍🚀 Coordinating ${crewMember} via ${webhookPath}`);

                // Call individual crew member webhook
                const crewResponse = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        crewMemberId: crewMember,
                        task: `Observation Lounge Mission: ${missionDirective}`,
                        missionDirective,
                        testMode,
                        complexity: complexity || 'High',
                        timestamp: new Date().toISOString(),
                        source: 'observation-lounge-coordinator',
                        missionType: 'observation_lounge_test',
                        coordinationLevel: testMode === 'full_crew' ? 'maximum' : testMode === 'core_crew' ? 'high' : 'medium'
                    }),
                });

                if (crewResponse.ok) {
                    let crewData;
                    try {
                        crewData = await crewResponse.json();
                    } catch {
                        crewData = { message: 'Response received', status: 'success' };
                    }

                    crewResponses.push({
                        crew_member: crewMember,
                        response: crewData.message || 'Mission participation confirmed',
                        status: 'Engaged',
                        contribution: crewData.contribution || 'Mission objectives aligned',
                        webhook_status: crewResponse.status,
                        response_time: Date.now() - startTime
                    });
                } else {
                    failedCrew.push({
                        crew_member: crewMember,
                        error: `HTTP ${crewResponse.status}`,
                        status: 'Failed'
                    });
                }
            } catch (error) {
                console.error(`❌ Failed to coordinate ${crewMember}:`, error);
                failedCrew.push({
                    crew_member: crewMember,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    status: 'Failed'
                });
            }
        }

        const responseTime = Date.now() - startTime;
        const successCount = crewResponses.length;
        const failureCount = failedCrew.length;

        console.log(`✅ Observation Lounge coordination completed: ${successCount} successful, ${failureCount} failed`);

        // Calculate coordination metrics
        const coordinationEfficiency = successCount > 0 ? `${Math.round((successCount / selectedCrew.length) * 100)}%` : '0%';
        const crewSynergy = successCount === selectedCrew.length ? 'Exceptional' :
            successCount > selectedCrew.length / 2 ? 'Good' : 'Needs Improvement';

        // Return structured response compatible with existing test interface
        return NextResponse.json({
            success: true,
            missionDirective,
            selectedCrew,
            testMode,
            complexity,
            response: {
                coordination_summary: {
                    coordination_efficiency: coordinationEfficiency,
                    response_time: `${responseTime}ms`,
                    crew_synergy: crewSynergy,
                    mission_status: failureCount === 0 ? 'Active' : 'Partial Success'
                },
                individual_crew_responses: crewResponses,
                failed_crew_members: failedCrew,
                mission_outcomes: [
                    'Crew coordination attempted via individual webhooks',
                    `Mission directive: ${missionDirective}`,
                    `Success rate: ${coordinationEfficiency}`,
                    `Response time: ${responseTime}ms`,
                    failureCount > 0 ? `${failureCount} crew member(s) failed to respond` : 'All crew members responded successfully'
                ],
                coordination_metrics: {
                    decision_making_speed: responseTime < 1000 ? 'Optimal' : responseTime < 3000 ? 'Good' : 'Slow',
                    communication_efficiency: coordinationEfficiency,
                    resource_utilization: `${Math.round((successCount / selectedCrew.length) * 100)}%`,
                    team_cohesion: crewSynergy
                }
            },
            testMetrics: {
                responseTime,
                successCount,
                failureCount,
                totalCrew: selectedCrew.length,
                coordinationEfficiency
            }
        });

    } catch (error) {
        console.error('❌ Observation Lounge test failed:', error);
        return NextResponse.json(
            {
                error: 'Observation Lounge test failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
