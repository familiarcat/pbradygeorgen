'use client';

import { useState } from 'react';

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
    isActive: boolean;
    onToggleActive: (id: string) => void;
}

export function TestCrewMember({ member, onTestResult, isActive, onToggleActive }: TestCrewMemberProps) {
    const [task, setTask] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState<any>(null);

    const handleQuickTest = async () => {
        if (!task.trim()) {
            setTask(`Quick test for ${member.name}`);
        }
        await runTest(task || `Quick test for ${member.name}`);
    };

    const handleCustomTest = async () => {
        if (!task.trim()) return;
        await runTest(task);
    };

    const runTest = async (testTask: string) => {
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
                    task: testTask,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setLastResponse(result);
                onTestResult({
                    type: 'crew_member_test',
                    status: 'success',
                    crewMember: member.name,
                    task: testTask,
                    response: result.response,
                    testMetrics: result.testMetrics,
                    note: result.note
                });
            } else {
                onTestResult({
                    type: 'crew_member_test',
                    status: 'error',
                    crewMember: member.name,
                    task: testTask,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Test failed:', error);
            onTestResult({
                type: 'crew_member_test',
                status: 'error',
                crewMember: member.name,
                task: testTask,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleColor = (role: string) => {
        if (role.includes('Strategic')) return '#3B82F6';
        if (role.includes('Tactical')) return '#10B981';
        if (role.includes('Analytics')) return '#8B5CF6';
        if (role.includes('Infrastructure')) return '#F59E0B';
        if (role.includes('Health')) return '#059669';
        if (role.includes('Security')) return '#EF4444';
        if (role.includes('User Experience')) return '#EC4899';
        if (role.includes('Communications')) return '#6366F1';
        if (role.includes('Business')) return '#F59E0B';
        return '#6B7280';
    };

    const roleColor = getRoleColor(member.role);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: `2px solid ${isActive ? '#3B82F6' : '#E5E7EB'}`,
            boxShadow: isActive ? '0 10px 25px rgba(59, 130, 246, 0.1)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
        }}>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: roleColor,
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}>
                                {member.abbreviation}
                            </div>
                            <div>
                                <h3 style={{
                                    fontWeight: 'bold',
                                    color: '#111827',
                                    fontSize: '18px',
                                    lineHeight: '1.2',
                                    margin: 0
                                }}>
                                    {member.name}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#6B7280',
                                    lineHeight: '1.2',
                                    margin: '4px 0 0 0'
                                }}>
                                    {member.role}
                                </p>
                            </div>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            lineHeight: '1.5',
                            margin: '8px 0 0 0'
                        }}>
                            {member.description}
                        </p>
                    </div>
                    <button
                        onClick={() => onToggleActive(member.id)}
                        style={{
                            marginLeft: '16px',
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isActive ? '#DBEAFE' : '#F3F4F6',
                            color: isActive ? '#2563EB' : '#6B7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        title={isActive ? 'Deactivate' : 'Activate'}
                    >
                        {isActive ? '✓' : '○'}
                    </button>
                </div>

                {/* Input Field */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                    }}>
                        Task for {member.name.split(' ')[0]}
                    </label>
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder={`Enter task for ${member.name.split(' ')[0]}...`}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '12px',
                            fontSize: '16px',
                            color: '#111827',
                            backgroundColor: 'white',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#3B82F6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleQuickTest}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                            color: 'white',
                            fontWeight: '600',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {isLoading ? (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid white',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '8px'
                            }}></div>
                        ) : (
                            <span style={{ fontSize: '18px', marginRight: '8px' }}>⚡</span>
                        )}
                        Quick Test
                    </button>
                    <button
                        onClick={handleCustomTest}
                        disabled={!task.trim() || isLoading}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            fontWeight: '600',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: (!task.trim() || isLoading) ? 'not-allowed' : 'pointer',
                            opacity: (!task.trim() || isLoading) ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            if (task.trim() && !isLoading) {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span style={{ fontSize: '18px', marginRight: '8px' }}>🎯</span>
                        Custom Test
                    </button>
                </div>

                {/* Last Response */}
                {lastResponse && (
                    <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <h4 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>Last Response</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {lastResponse.testMetrics?.mode && (
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        backgroundColor: lastResponse.testMetrics.mode === 'live_n8n' ? '#D1FAE5' : '#FEF3C7',
                                        color: lastResponse.testMetrics.mode === 'live_n8n' ? '#065F46' : '#92400E'
                                    }}>
                                        {lastResponse.testMetrics.mode === 'live_n8n' ? 'LIVE n8n' : 'Mock Data'}
                                    </span>
                                )}
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {lastResponse.testMetrics?.responseTime || 0}ms
                                </span>
                            </div>
                        </div>

                        {lastResponse.note && (
                            <div style={{
                                marginBottom: '8px',
                                padding: '8px',
                                backgroundColor: '#FEF3C7',
                                border: '1px solid #F59E0B',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: '#92400E'
                            }}>
                                {lastResponse.note}
                            </div>
                        )}

                        <div style={{ fontSize: '14px', color: '#374151' }}>
                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>Analysis:</div>
                            <div style={{ color: '#6B7280' }}>
                                Priority: {lastResponse.response?.analysis?.priority || 'N/A'} |
                                Complexity: {lastResponse.response?.analysis?.complexity || 'N/A'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
