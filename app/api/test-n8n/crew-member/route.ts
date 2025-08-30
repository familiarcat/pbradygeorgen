import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { crewMemberId, webhookPath, task, scenario, expectedOutcome, complexity } = await request.json();

        if (!crewMemberId || !webhookPath || !task) {
            return NextResponse.json(
                { error: 'Missing required fields: crewMemberId, webhookPath, task' },
                { status: 400 }
            );
        }

        console.log(`🧪 Testing crew member: ${crewMemberId} with task: ${task}`);

        // Get n8n base URL from environment
        const n8nBaseUrl = process.env.N8N_BASE_URL || 'https://n8n.pbradygeorgen.com';
        console.log(`🔗 Connecting to n8n instance: ${n8nBaseUrl}`);

        // Construct the webhook URL for the specific crew member
        const webhookUrl = `${n8nBaseUrl}/webhook/${webhookPath}`;
        console.log(`📡 Calling webhook: ${webhookUrl}`);

        const startTime = Date.now();

        try {
            // Attempt to call the real n8n webhook
            const n8nResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crewMemberId,
                    task,
                    timestamp: new Date().toISOString(),
                    testMode: true,
                    source: 'n8n-testing-console'
                }),
            });

            const responseTime = Date.now() - startTime;
            console.log(`📊 n8n response status: ${n8nResponse.status} ${n8nResponse.statusText}`);

            if (n8nResponse.ok) {
                // Success! Get the actual response from n8n
                let n8nData;
                const responseText = await n8nResponse.text();

                console.log(`📊 Raw n8n response: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);

                try {
                    n8nData = JSON.parse(responseText);
                    console.log(`✅ Successfully parsed n8n response:`, JSON.stringify(n8nData, null, 2));
                } catch (parseError) {
                    // If n8n returns non-JSON, try to extract useful information
                    console.log(`⚠️ n8n returned non-JSON response: ${responseText}`);

                    // Try to extract structured data from the response
                    let extractedData = {};
                    try {
                        // Look for common patterns in the response
                        if (responseText.includes('crew_member') || responseText.includes('role') || responseText.includes('response')) {
                            // Try to extract key-value pairs
                            const lines = responseText.split('\n');
                            lines.forEach(line => {
                                const match = line.match(/^([^:]+):\s*(.+)$/);
                                if (match) {
                                    const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
                                    const value = match[2].trim();
                                    extractedData[key] = value;
                                }
                            });
                        }
                    } catch (extractError) {
                        console.log(`⚠️ Could not extract structured data: ${extractError}`);
                    }

                    n8nData = {
                        message: responseText,
                        status: 'success',
                        timestamp: new Date().toISOString(),
                        extracted_data: extractedData,
                        raw_response: responseText
                    };
                }

                console.log(`✅ Crew member test completed for ${crewMemberId} in ${responseTime}ms (LIVE n8n)`);

                // Return structured response compatible with existing test interface
                return NextResponse.json({
                    success: true,
                    crewMemberId,
                    webhookPath,
                    task,
                    scenario,
                    expectedOutcome,
                    complexity,
                    response: {
                        analysis: {
                            priority: n8nData.priority || 'Medium',
                            complexity: n8nData.complexity || complexity || 'Standard',
                            estimatedDuration: n8nData.estimatedDuration || '2-4 hours'
                        },
                        recommendations: n8nData.recommendations || [
                            'Proceed with standard protocols',
                            'Monitor system performance',
                            'Document any anomalies'
                        ],
                        nextSteps: n8nData.nextSteps || [
                            'Review analysis results',
                            'Coordinate with relevant departments',
                            'Schedule follow-up assessment'
                        ]
                    },
                    testMetrics: {
                        responseTime,
                        n8nStatus: n8nResponse.status,
                        webhookUrl,
                        timestamp: new Date().toISOString(),
                        mode: 'live_n8n'
                    },
                    rawN8nResponse: n8nData // Include raw response for debugging
                });
            } else {
                // n8n webhook failed, fall back to mock data
                let errorText = '';
                let errorDetails = {};

                try {
                    errorText = await n8nResponse.text();

                    // Try to parse error response as JSON for more details
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorDetails = errorJson;
                    } catch (parseError) {
                        // If not JSON, keep as text
                        errorDetails = { message: errorText };
                    }
                } catch (e) {
                    errorText = 'Unable to read error response';
                    errorDetails = { message: errorText };
                }

                console.log(`⚠️ n8n webhook failed (${n8nResponse.status}): ${errorText}`);
                console.log(`🔍 Error details:`, JSON.stringify(errorDetails, null, 2));
                console.log(`🔄 Falling back to mock data for ${crewMemberId}`);

                // Fall back to mock data
                const mockResponse = await generateMockCrewResponse(crewMemberId, task);
                const mockResponseTime = Date.now() - startTime;

                console.log(`✅ Crew member test completed for ${crewMemberId} in ${mockResponseTime}ms (MOCK fallback)`);

                return NextResponse.json({
                    success: true,
                    crewMemberId,
                    webhookPath,
                    task,
                    response: mockResponse,
                    testMetrics: {
                        responseTime: mockResponseTime,
                        n8nStatus: n8nResponse.status,
                        webhookUrl,
                        timestamp: new Date().toISOString(),
                        mode: 'mock_fallback',
                        n8nError: errorText,
                        errorDetails: errorDetails
                    },
                    note: 'Using mock data - n8n webhook failed. Check workflow execution and webhook configuration.'
                });
            }

        } catch (fetchError) {
            // Network or fetch error, fall back to mock data
            console.log(`⚠️ Network error calling n8n: ${fetchError}`);
            console.log(`🔄 Falling back to mock data for ${crewMemberId}`);

            const mockResponse = await generateMockCrewResponse(crewMemberId, task);
            const mockResponseTime = Date.now() - startTime;

            console.log(`✅ Crew member test completed for ${crewMemberId} in ${mockResponseTime}ms (MOCK fallback)`);

            return NextResponse.json({
                success: true,
                crewMemberId,
                webhookPath,
                task,
                scenario,
                expectedOutcome,
                complexity,
                response: mockResponse,
                testMetrics: {
                    responseTime: mockResponseTime,
                    n8nStatus: 'network_error',
                    webhookUrl,
                    timestamp: new Date().toISOString(),
                    mode: 'mock_fallback',
                    n8nError: fetchError instanceof Error ? fetchError.message : 'Network error'
                },
                note: 'Using mock data - network error connecting to n8n.'
            });
        }

    } catch (error) {
        console.error('❌ Crew member test failed:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString(),
            testMetrics: {
                responseTime: 0,
                n8nStatus: 'error',
                webhookUrl: 'N/A'
            }
        }, { status: 500 });
    }
}

// Mock response generator for fallback
async function generateMockCrewResponse(crewMemberId: string, task: string): Promise<any> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const crewResponses: Record<string, any> = {
        picard: {
            role: 'Strategic Leadership & Mission Command',
            analysis: `Strategic analysis of: "${task}"`,
            recommendations: [
                'Implement comprehensive mission planning protocols',
                'Establish clear communication channels with all stakeholders',
                'Develop contingency plans for multiple scenarios',
                'Coordinate with Starfleet Command for resource allocation'
            ],
            priority: 'High',
            timeline: 'Immediate action required',
            crewCoordination: 'All hands on deck for strategic implementation'
        },
        riker: {
            role: 'Tactical Execution & Workflow Management',
            tacticalPlan: `Tactical execution plan for: "${task}"`,
            operationalSteps: [
                'Deploy tactical teams to key positions',
                'Establish command and control protocols',
                'Implement real-time monitoring systems',
                'Coordinate cross-functional team operations'
            ],
            resourceAllocation: 'Optimal distribution of available resources',
            executionTimeline: 'Phase 1: Immediate, Phase 2: 24h, Phase 3: 72h'
        },
        data: {
            role: 'Analytics & Logic Operations',
            dataAnalysis: `Logical analysis of: "${task}"`,
            patterns: [
                'Identified recurring patterns in system behavior',
                'Statistical analysis shows 87% correlation with previous incidents',
                'Performance metrics indicate optimal efficiency thresholds',
                'Predictive modeling suggests 92% success probability'
            ],
            recommendations: 'Implement data-driven decision making protocols',
            monitoring: 'Continuous real-time monitoring recommended'
        },
        geordi: {
            role: 'Infrastructure & System Integration',
            technicalAssessment: `Technical assessment of: "${task}"`,
            systemStatus: 'All systems operating within normal parameters',
            integrationPoints: [
                'Warp core integration: Optimal',
                'Shield systems: 98% efficiency',
                'Life support: 100% operational',
                'Communications: Enhanced protocols active'
            ],
            optimization: 'System performance at peak efficiency',
            maintenance: 'Preventive maintenance schedule optimized'
        },
        crusher: {
            role: 'Health & Diagnostics Officer',
            healthAssessment: `Health and diagnostics analysis of: "${task}"`,
            systemHealth: 'All critical systems showing excellent health metrics',
            diagnostics: [
                'Core systems: 100% operational',
                'Backup systems: 100% operational',
                'Emergency protocols: Active and tested',
                'Crew safety systems: Optimal performance'
            ],
            recommendations: 'Continue current maintenance protocols',
            alerts: 'No critical alerts at this time'
        },
        worf: {
            role: 'Security & Compliance Operations',
            securityAssessment: `Security and compliance analysis of: "${task}"`,
            threatLevel: 'Minimal - all security protocols active',
            securityStatus: [
                'Perimeter security: 100% active',
                'Access control: Enhanced protocols enabled',
                'Threat detection: Advanced sensors operational',
                'Emergency response: Ready and tested'
            ],
            compliance: 'All Federation security protocols compliant',
            recommendations: 'Maintain current security posture'
        },
        troi: {
            role: 'User Experience & Empathy Analysis',
            empathyAnalysis: `Empathy and UX analysis of: "${task}"`,
            userExperience: 'Excellent user satisfaction metrics',
            accessibility: [
                'Interface accessibility: 100% compliant',
                'User feedback: 94% positive rating',
                'Ease of use: Intuitive design confirmed',
                'Accessibility features: All active and tested'
            ],
            recommendations: 'Continue current UX optimization efforts',
            improvements: 'Minor interface refinements suggested'
        },
        uhura: {
            role: 'Communications & I/O Operations',
            communicationStatus: `Communication systems analysis of: "${task}"`,
            systemStatus: 'All communication systems operational',
            protocols: [
                'Internal communications: 100% operational',
                'External communications: Enhanced protocols active',
                'Data transfer: Optimal bandwidth utilization',
                'Emergency communications: Redundant systems active'
            ],
            recommendations: 'Maintain current communication protocols',
            monitoring: 'Continuous monitoring active'
        },
        quark: {
            role: 'Business Intelligence & Budget Optimization',
            businessAnalysis: `Business intelligence analysis of: "${task}"`,
            costAnalysis: 'All operations within budget parameters',
            roi: [
                'Current ROI: 127% of projected targets',
                'Cost efficiency: 23% improvement over baseline',
                'Resource utilization: Optimal allocation confirmed',
                'Growth opportunities: 3 new revenue streams identified'
            ],
            recommendations: 'Continue current optimization strategies',
            projections: 'Projected 15% improvement in next quarter'
        }
    };

    const crewResponse = crewResponses[crewMemberId];
    if (!crewResponse) {
        throw new Error(`Unknown crew member: ${crewMemberId}`);
    }

    return {
        analysis: {
            priority: 'Medium',
            complexity: 'Standard',
            estimatedDuration: '2-4 hours'
        },
        recommendations: crewResponse.recommendations || [
            'Proceed with standard protocols',
            'Monitor system performance',
            'Document any anomalies'
        ],
        nextSteps: [
            'Review analysis results',
            'Coordinate with relevant departments',
            'Schedule follow-up assessment'
        ],
        crewDetails: {
            role: crewResponse.role,
            analysis: crewResponse.analysis || crewResponse.tacticalPlan || crewResponse.dataAnalysis || crewResponse.technicalAssessment || crewResponse.healthAssessment || crewResponse.securityAssessment || crewResponse.empathyAnalysis || crewResponse.communicationStatus || crewResponse.businessAnalysis,
            additionalData: crewResponse
        }
    };
}
