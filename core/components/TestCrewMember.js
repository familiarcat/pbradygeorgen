"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCrewMember = TestCrewMember;
const react_1 = require("react");
const ThemeProvider_1 = require("@/theme/ThemeProvider");
const ComponentLibrary_1 = require("@/theme/ComponentLibrary");
function TestCrewMember({ member, onTestResult, isActive = false, onToggleActive }) {
    const theme = (0, ThemeProvider_1.useTheme)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [customTask, setCustomTask] = (0, react_1.useState)('');
    const getRoleColor = (role) => {
        if (role.includes('Strategic'))
            return theme.colors.primary;
        if (role.includes('Tactical'))
            return theme.colors.secondary;
        if (role.includes('Analytics'))
            return theme.colors.info;
        if (role.includes('Infrastructure'))
            return theme.colors.accent;
        if (role.includes('Health'))
            return theme.colors.success;
        if (role.includes('Security'))
            return theme.colors.warning;
        if (role.includes('User Experience'))
            return theme.colors.secondary;
        if (role.includes('Communications'))
            return theme.colors.info;
        if (role.includes('Business'))
            return theme.colors.accent;
        return theme.colors.text.tertiary;
    };
    const handleQuickTest = async () => {
        if (isLoading)
            return;
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
        }
        catch (error) {
            console.error('Quick test failed:', error);
            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCustomTest = async () => {
        if (isLoading || !customTask.trim())
            return;
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
        }
        catch (error) {
            console.error('Custom test failed:', error);
            onTestResult({
                type: 'crew_member_test',
                crewMember: member.name,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const roleColor = getRoleColor(member.role);
    return (<ComponentLibrary_1.Card variant="primary" style={{
            border: isActive ? `2px solid ${theme.colors.primary}` : undefined,
            transform: isActive ? 'scale(1.02)' : 'scale(1)',
            transition: theme.transitions.normal,
        }}>
            <ComponentLibrary_1.Flex direction="column" gap={theme.spacing.md}>
                {/* Header */}
                <ComponentLibrary_1.Flex align="center" justify="space-between">
                    <ComponentLibrary_1.Badge variant="primary" size="md" style={{ background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%)` }}>
                        {member.abbreviation}
                    </ComponentLibrary_1.Badge>

                    {onToggleActive && (<ComponentLibrary_1.Button variant="secondary" size="sm" onClick={() => onToggleActive(member.id)} style={{
                background: isActive ? theme.colors.primary : theme.colors.background.secondary,
                color: isActive ? theme.colors.text.inverse : theme.colors.text.primary,
            }}>
                            {isActive ? '✓' : '○'}
                        </ComponentLibrary_1.Button>)}
                </ComponentLibrary_1.Flex>

                {/* Member Info */}
                <div>
                    <ComponentLibrary_1.Text variant="h4" color="primary" style={{ marginBottom: theme.spacing.xs }}>
                        {member.name}
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Text variant="body" color="secondary" style={{ marginBottom: theme.spacing.sm }}>
                        {member.role}
                    </ComponentLibrary_1.Text>
                    <ComponentLibrary_1.Text variant="caption" color="tertiary">
                        {member.description}
                    </ComponentLibrary_1.Text>
                </div>

                {/* Task Input */}
                <ComponentLibrary_1.Input value={customTask} onChange={setCustomTask} placeholder={`Enter task for ${member.name.split(' ')[0]}...`} type="text" style={{ marginBottom: theme.spacing.sm }}/>

                {/* Action Buttons */}
                <ComponentLibrary_1.Grid columns={2} gap={theme.spacing.sm}>
                    <ComponentLibrary_1.Button variant="primary" size="md" onClick={handleQuickTest} disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? (<ComponentLibrary_1.Flex align="center" gap={theme.spacing.xs}>
                                <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}/>
                                Testing...
                            </ComponentLibrary_1.Flex>) : (<ComponentLibrary_1.Flex align="center" gap={theme.spacing.xs}>
                                <span>⚡</span>
                                Quick Test
                            </ComponentLibrary_1.Flex>)}
                    </ComponentLibrary_1.Button>

                    <ComponentLibrary_1.Button variant="secondary" size="md" onClick={handleCustomTest} disabled={isLoading || !customTask.trim()} style={{ width: '100%' }}>
                        <ComponentLibrary_1.Flex align="center" gap={theme.spacing.xs}>
                            <span>🎯</span>
                            Custom Test
                        </ComponentLibrary_1.Flex>
                    </ComponentLibrary_1.Button>
                </ComponentLibrary_1.Grid>
            </ComponentLibrary_1.Flex>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </ComponentLibrary_1.Card>);
}
//# sourceMappingURL=TestCrewMember.js.map