'use client';

import { useState, useEffect } from 'react';
import { TestCrewMember } from '@/components/TestCrewMember';
import { TestMissionScenario } from '@/components/TestMissionScenario';
import { TestObservationLounge } from '@/components/TestObservationLounge';
import { TestResults } from '@/components/TestResults';

export default function TestN8NPage() {
    const [activeTests, setActiveTests] = useState<string[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const crewMembers = [
        {
            id: 'picard',
            name: 'Captain Jean-Luc Picard',
            abbreviation: 'CJP',
            role: 'Strategic Leadership & Mission Command',
            description: 'High-level strategy, cost-benefit analysis, mission optimization',
            webhookPath: 'crew-captain-jean-luc-picard'
        },
        {
            id: 'riker',
            name: 'Commander William Riker',
            abbreviation: 'CWR',
            role: 'Tactical Execution & Workflow Management',
            description: 'Operational efficiency, workflow optimization, tactical decisions',
            webhookPath: 'crew-commander-william-riker'
        },
        {
            id: 'data',
            name: 'Commander Data',
            abbreviation: 'CD',
            role: 'Analytics & Logic Operations',
            description: 'Data analysis, logical validation, performance metrics',
            webhookPath: 'crew-commander-data'
        },
        {
            id: 'geordi',
            name: 'Lieutenant Commander Geordi La Forge',
            abbreviation: 'GCLF',
            role: 'Infrastructure & System Integration',
            description: 'Technical architecture, system optimization, integration',
            webhookPath: 'crew-lieutenant-commander-geordi-la-forge'
        },
        {
            id: 'crusher',
            name: 'Dr. Beverly Crusher',
            abbreviation: 'DBC',
            role: 'Health & Diagnostics Officer',
            description: 'System health monitoring, performance diagnostics',
            webhookPath: 'crew-dr-beverly-crusher'
        },
        {
            id: 'worf',
            name: 'Lieutenant Worf',
            abbreviation: 'LW',
            role: 'Security & Compliance Operations',
            description: 'Security protocols, compliance monitoring, access control',
            webhookPath: 'crew-lieutenant-worf'
        },
        {
            id: 'troi',
            name: 'Counselor Deanna Troi',
            abbreviation: 'CDT',
            role: 'User Experience & Empathy Analysis',
            description: 'Empathy analysis, UX optimization, user satisfaction',
            webhookPath: 'crew-counselor-deanna-troi'
        },
        {
            id: 'uhura',
            name: 'Lieutenant Uhura',
            abbreviation: 'LU',
            role: 'Communications & I/O Operations',
            description: 'Communication systems, data transfer, API management',
            webhookPath: 'crew-lieutenant-uhura'
        },
        {
            id: 'quark',
            name: 'Quark',
            abbreviation: 'Q',
            role: 'Business Intelligence & Budget Optimization',
            description: 'Cost analysis, ROI optimization, business strategy',
            webhookPath: 'crew-quark'
        }
    ];

    const missionScenarios = [
        { id: 'crisis_response', name: 'Enterprise Crisis Response', description: 'Test full crew coordination during a critical mission scenario', complexity: 'High', crewRequired: 'All 9 members' },
        { id: 'technical_audit', name: 'Technical System Audit', description: 'Test technical crew members (Data, Geordi, Crusher)', complexity: 'Medium', crewRequired: 'Data, Geordi, Crusher' },
        { id: 'business_analysis', name: 'Business Strategy Analysis', description: 'Test business and strategic crew members (Picard, Quark, Troi)', complexity: 'Medium', crewRequired: 'Picard, Quark, Troi' },
        { id: 'security_incident', name: 'Security Incident Response', description: 'Test security and tactical crew members (Worf, Riker, Uhura)', complexity: 'Medium', crewRequired: 'Worf, Riker, Uhura' },
        { id: 'user_experience', name: 'User Experience Optimization', description: 'Test UX and empathy crew members (Troi, Uhura, Data)', complexity: 'Low', crewRequired: 'Troi, Uhura, Data' }
    ];

    const handleTestResult = (result: any) => {
        setTestResults(prev => [...prev, { ...result, timestamp: new Date().toISOString() }]);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
            padding: '24px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                        borderRadius: '24px',
                        marginBottom: '24px',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                    }}>
                        <span style={{ fontSize: '48px' }}>🚀</span>
                    </div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px',
                        margin: '0 0 16px 0'
                    }}>
                        N8N Workflow Testing Console
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: '#475569',
                        maxWidth: '600px',
                        margin: '0 auto 16px auto',
                        lineHeight: '1.6'
                    }}>
                        Comprehensive testing interface for the AlexAI Crew n8n workflow system
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        backgroundColor: '#D1FAE5',
                        border: '1px solid #10B981',
                        borderRadius: '20px',
                        color: '#065F46',
                        fontSize: '14px'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#10B981',
                            borderRadius: '50%',
                            marginRight: '8px'
                        }}></span>
                        Connected to: n8n.pbradygeorgen.com
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '24px',
                    marginBottom: '32px'
                }}>
                    {/* Individual Crew Member Testing - Large Card */}
                    <div style={{ gridColumn: 'span 12', lg: { gridColumn: 'span 8' } }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            padding: '32px',
                            height: '100%',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '16px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>🧪</span>
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#1F2937',
                                        margin: '0 0 8px 0'
                                    }}>
                                        Individual Crew Member Testing
                                    </h2>
                                    <p style={{
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        margin: 0
                                    }}>
                                        Test each crew member's workflow individually
                                    </p>
                                </div>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '16px'
                            }}>
                                {crewMembers.map((member, index) => (
                                    <div key={member.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <TestCrewMember
                                            member={member}
                                            onTestResult={handleTestResult}
                                            isActive={activeTests.includes(member.id)}
                                            onToggleActive={(id) => {
                                                setActiveTests(prev =>
                                                    prev.includes(id)
                                                        ? prev.filter(t => t !== id)
                                                        : [...prev, id]
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mission Scenario Testing - Medium Card */}
                    <div style={{ gridColumn: 'span 12', lg: { gridColumn: 'span 4' } }}>
                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                            padding: '24px',
                            height: '100%',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px'
                                }}>
                                    <span style={{ fontSize: '20px' }}>🎯</span>
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#1F2937',
                                        margin: '0 0 8px 0'
                                    }}>
                                        Mission Scenarios
                                    </h2>
                                    <p style={{
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        margin: 0
                                    }}>
                                        Test coordinated mission workflows
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {missionScenarios.map((scenario, index) => (
                                    <div key={scenario.id} style={{ animationDelay: `${index * 0.2}s` }}>
                                        <TestMissionScenario
                                            scenario={scenario}
                                            onTestResult={handleTestResult}
                                            crewMembers={crewMembers}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Observation Lounge Testing - Full Width */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '32px',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px'
                            }}>
                                <span style={{ fontSize: '32px' }}>🏛️</span>
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: '#1F2937',
                                    margin: '0 0 8px 0'
                                }}>
                                    Observation Lounge Integration Testing
                                </h2>
                                <p style={{
                                    color: '#6B7280',
                                    fontSize: '16px',
                                    margin: 0
                                }}>
                                    Test full crew coordination and workflow integration
                                </p>
                            </div>
                        </div>
                        <TestObservationLounge
                            crewMembers={crewMembers}
                            onTestResult={handleTestResult}
                        />
                    </div>
                </div>

                {/* Test Results - Full Width */}
                <div>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '32px',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '16px'
                                }}>
                                    <span style={{ fontSize: '24px' }}>📊</span>
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#1F2937',
                                        margin: '0 0 8px 0'
                                    }}>
                                        Test Results & Analytics
                                    </h2>
                                    <p style={{
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        margin: 0
                                    }}>
                                        Monitor and analyze test performance
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={clearResults}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                Clear Results
                            </button>
                        </div>
                        <TestResults results={testResults} />
                    </div>
                </div>
            </div>
        </div>
    );
}
