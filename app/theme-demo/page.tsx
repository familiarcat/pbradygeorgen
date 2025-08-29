'use client';

import { Card, Button, Input, Text, Badge, Flex, Grid, Icon } from '@/theme/ComponentLibrary';
import { useTheme } from '@/theme/ThemeProvider';

export default function ThemeDemoPage() {
    const theme = useTheme();

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.colors.background.primary} 0%, ${theme.colors.background.secondary} 100%)`,
            padding: theme.spacing.xl,
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <Card variant="primary" style={{ marginBottom: theme.spacing.xl }}>
                    <Flex direction="column" align="center" gap={theme.spacing.md}>
                        <Text variant="h1" color="primary">
                            🎨 Theme System Demo
                        </Text>
                        <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                            Universal styling system for consistent UI across the entire application
                        </Text>
                    </Flex>
                </Card>

                {/* Component Showcase */}
                <Grid columns={2} gap={theme.spacing.xl}>
                    {/* Buttons Section */}
                    <Card variant="secondary">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Buttons</Text>

                            <Flex direction="column" gap={theme.spacing.sm}>
                                <Button variant="primary" size="lg">
                                    <Icon icon="🚀" size="md" />
                                    Primary Button
                                </Button>

                                <Button variant="secondary" size="md">
                                    <Icon icon="⚡" size="sm" />
                                    Secondary Button
                                </Button>

                                <Button variant="accent" size="sm">
                                    <Icon icon="🎯" size="sm" />
                                    Accent Button
                                </Button>

                                <Button variant="success" size="md">
                                    <Icon icon="✅" size="sm" />
                                    Success Button
                                </Button>

                                <Button variant="warning" size="md">
                                    <Icon icon="⚠️" size="sm" />
                                    Warning Button
                                </Button>

                                <Button variant="error" size="md">
                                    <Icon icon="❌" size="sm" />
                                    Error Button
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Inputs Section */}
                    <Card variant="accent">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Inputs</Text>

                            <Flex direction="column" gap={theme.spacing.sm}>
                                <Input
                                    value=""
                                    onChange={() => { }}
                                    placeholder="Text input placeholder"
                                    type="text"
                                />

                                <Input
                                    value=""
                                    onChange={() => { }}
                                    placeholder="Textarea placeholder"
                                    type="textarea"
                                    rows={3}
                                />

                                <Input
                                    value=""
                                    onChange={() => { }}
                                    placeholder="Email input"
                                    type="email"
                                />
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Typography Section */}
                    <Card variant="primary">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Typography</Text>

                            <Flex direction="column" gap={theme.spacing.sm}>
                                <Text variant="h1" color="primary">Heading 1</Text>
                                <Text variant="h2" color="secondary">Heading 2</Text>
                                <Text variant="h3" color="tertiary">Heading 3</Text>
                                <Text variant="h4" color="primary">Heading 4</Text>
                                <Text variant="body" color="primary">Body text with normal weight</Text>
                                <Text variant="caption" color="secondary">Caption text for smaller details</Text>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Badges Section */}
                    <Card variant="secondary">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Badges</Text>

                            <Flex direction="row" gap={theme.spacing.sm} wrap>
                                <Badge variant="primary" size="sm">Primary</Badge>
                                <Badge variant="secondary" size="md">Secondary</Badge>
                                <Badge variant="accent" size="lg">Accent</Badge>
                                <Badge variant="success" size="sm">Success</Badge>
                                <Badge variant="warning" size="md">Warning</Badge>
                                <Badge variant="error" size="lg">Error</Badge>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Layout Components */}
                    <Card variant="accent">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Layout Components</Text>

                            <Grid columns={2} gap={theme.spacing.sm}>
                                <div style={{
                                    background: theme.colors.background.tertiary,
                                    padding: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    textAlign: 'center'
                                }}>
                                    Grid Item 1
                                </div>
                                <div style={{
                                    background: theme.colors.background.tertiary,
                                    padding: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    textAlign: 'center'
                                }}>
                                    Grid Item 2
                                </div>
                            </Grid>

                            <Flex direction="row" gap={theme.spacing.sm} justify="space-between">
                                <div style={{
                                    background: theme.colors.background.tertiary,
                                    padding: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    flex: 1,
                                    textAlign: 'center'
                                }}>
                                    Flex Item 1
                                </div>
                                <div style={{
                                    background: theme.colors.background.tertiary,
                                    padding: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    flex: 1,
                                    textAlign: 'center'
                                }}>
                                    Flex Item 2
                                </div>
                            </Flex>
                        </Flex>
                    </Card>

                    {/* Theme Info */}
                    <Card variant="primary">
                        <Flex direction="column" gap={theme.spacing.md}>
                            <Text variant="h3" color="primary">Theme Information</Text>

                            <Flex direction="column" gap={theme.spacing.sm}>
                                <Text variant="body" color="secondary">
                                    <strong>Primary Color:</strong> {theme.colors.primary}
                                </Text>
                                <Text variant="body" color="secondary">
                                    <strong>Secondary Color:</strong> {theme.colors.secondary}
                                </Text>
                                <Text variant="body" color="secondary">
                                    <strong>Accent Color:</strong> {theme.colors.accent}
                                </Text>
                                <Text variant="body" color="secondary">
                                    <strong>Font Family:</strong> {theme.typography.fontFamily}
                                </Text>
                                <Text variant="body" color="secondary">
                                    <strong>Base Spacing:</strong> {theme.spacing.md}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                </Grid>

                {/* Usage Instructions */}
                <Card variant="secondary" style={{ marginTop: theme.spacing.xl }}>
                    <Flex direction="column" gap={theme.spacing.md}>
                        <Text variant="h3" color="primary">How to Use</Text>

                        <Text variant="body" color="secondary">
                            1. Import components from <code>@/theme/ComponentLibrary</code>
                        </Text>
                        <Text variant="body" color="secondary">
                            2. Use the <code>useTheme()</code> hook to access theme values
                        </Text>
                        <Text variant="body" color="secondary">
                            3. All components automatically use consistent styling
                        </Text>
                        <Text variant="body" color="secondary">
                            4. Customize with additional style props when needed
                        </Text>
                    </Flex>
                </Card>
            </div>
        </div>
    );
}
