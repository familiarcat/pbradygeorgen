"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const BusinessPlanDesigner = () => {
    const [businessIdea, setBusinessIdea] = (0, react_1.useState)('');
    const [generatedBusinessModel, setGeneratedBusinessModel] = (0, react_1.useState)(null);
    const [selectedTheme, setSelectedTheme] = (0, react_1.useState)(null);
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [currentStep, setCurrentStep] = (0, react_1.useState)('idea');
    const [generatedInterface, setGeneratedInterface] = (0, react_1.useState)(null);
    // Pre-defined business themes
    const businessThemes = [
        {
            id: 'tech_startup',
            name: 'Tech Startup',
            category: 'Technology',
            aesthetic: 'Modern, minimalist, innovative',
            features: ['Product development', 'Funding', 'Scaling'],
            interfaceElements: ['Dashboard', 'Analytics', 'Team collaboration'],
            colorScheme: ['#3B82F6', '#1E40AF', '#DBEAFE', '#FFFFFF', '#1F2937'],
            typography: 'Inter, system-ui, sans-serif',
            iconStyle: 'Outlined, modern, tech-focused'
        },
        {
            id: 'ecommerce_empire',
            name: 'E-commerce Empire',
            category: 'Retail',
            aesthetic: 'Retail-focused, conversion-optimized',
            features: ['Inventory management', 'Customer analytics', 'Marketing'],
            interfaceElements: ['Product catalog', 'Order management', 'Analytics'],
            colorScheme: ['#10B981', '#059669', '#D1FAE5', '#FFFFFF', '#374151'],
            typography: 'Poppins, system-ui, sans-serif',
            iconStyle: 'Filled, friendly, conversion-focused'
        }
    ];
    const generateBusinessModel = (0, react_1.useCallback)(async () => {
        if (!businessIdea.trim())
            return;
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const model = {
                id: Date.now().toString(),
                name: businessIdea,
                description: `A comprehensive business model for ${businessIdea}`,
                marketAnalysis: `Market analysis for ${businessIdea} shows strong potential in the current economic climate.`,
                revenueStreams: ['Product Sales', 'Subscription Services', 'Consulting'],
                costStructure: ['Development Costs', 'Marketing', 'Operations'],
                customerSegments: ['Small Business', 'Enterprise', 'Individual Consumers'],
                valueProposition: `Delivering innovative solutions that transform how businesses operate.`,
                goToMarketStrategy: 'Direct sales, digital marketing, and strategic partnerships.',
                financialProjections: {
                    year1: 100000,
                    year2: 500000,
                    year3: 1200000
                },
                riskAssessment: ['Market Competition', 'Technology Changes', 'Economic Factors'],
                implementationRoadmap: ['Phase 1: MVP Development', 'Phase 2: Market Testing', 'Phase 3: Full Launch']
            };
            setGeneratedBusinessModel(model);
            setCurrentStep('model');
            setIsGenerating(false);
        }, 2000);
    }, [businessIdea]);
    const selectTheme = (0, react_1.useCallback)((theme) => {
        setSelectedTheme(theme);
        setCurrentStep('interface');
    }, []);
    return (<div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Header */}
            <header style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
                <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '80px'
        }}>
                    <div>
                        <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
        }}>
                            AI Business Plan Designer
                        </h1>
                        <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            margin: 0,
            maxWidth: '600px'
        }}>
                            Transform your business idea into a comprehensive plan with AI-powered insights
                        </p>
                    </div>
                    <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
                        <div style={{
            width: '16px',
            height: '16px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '50%'
        }}/>
                        <span style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            fontWeight: '500'
        }}>
                            AI System Active
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px'
        }}>
                <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '32px',
            alignItems: 'start'
        }}>
                    {/* Left Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Business Idea Input */}
                        <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '32px'
        }}>
                            <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
                                <span style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.25rem'
        }}>
                                    💡
                                </span>
                                Share Your Business Idea
                            </h2>
                            <textarea value={businessIdea} onChange={(e) => setBusinessIdea(e.target.value)} placeholder="Describe your business idea, target market, and unique value proposition..." style={{
            width: '100%',
            height: '128px',
            padding: '24px',
            border: '2px solid #e5e7eb',
            borderRadius: '16px',
            fontSize: '1rem',
            resize: 'none',
            background: 'rgba(255, 255, 255, 0.9)',
            outline: 'none'
        }}/>
                            <button onClick={generateBusinessModel} disabled={!businessIdea.trim() || isGenerating} style={{
            width: '100%',
            marginTop: '24px',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: (!businessIdea.trim() || isGenerating) ? 0.6 : 1
        }}>
                                {isGenerating ? 'Generating...' : '🚀 Generate Complete Business Model'}
                            </button>
                        </div>

                        {/* Progress Indicator */}
                        <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '32px'
        }}>
                            <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
                                <span style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 'bold'
        }}>
                                    📊
                                </span>
                                Progress
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {['idea', 'model', 'theme', 'interface', 'roadmap'].map((step, index) => (<div key={step} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                background: currentStep === step
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : index < ['idea', 'model', 'theme', 'interface', 'roadmap'].indexOf(currentStep)
                        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                        : '#f3f4f6',
                color: currentStep === step || index < ['idea', 'model', 'theme', 'interface', 'roadmap'].indexOf(currentStep)
                    ? 'white'
                    : '#6b7280'
            }}>
                                            {index < ['idea', 'model', 'theme', 'interface', 'roadmap'].indexOf(currentStep) ? '✓' : index + 1}
                                        </div>
                                        <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: currentStep === step ? '#667eea' : '#6b7280'
            }}>
                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                        </span>
                                    </div>))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Welcome State */}
                        {!generatedBusinessModel && currentStep === 'idea' && (<div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '64px',
                textAlign: 'center'
            }}>
                                <div style={{ fontSize: '6rem', marginBottom: '32px' }}>🚀</div>
                                <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0'
            }}>
                                    Ready to Build Your Business?
                                </h2>
                                <p style={{
                fontSize: '1.25rem',
                color: '#6b7280',
                margin: '0 auto 48px auto',
                maxWidth: '600px',
                lineHeight: '1.6'
            }}>
                                    Our AI-powered system will analyze your business idea and generate a comprehensive plan
                                    with professional design themes. Start by describing your vision above.
                                </p>

                                <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                                    {[
                { icon: '📊', title: 'Business Analysis', desc: 'Market research, competitive analysis, and financial projections' },
                { icon: '🎨', title: 'Design Themes', desc: 'Professional, industry-specific design templates' },
                { icon: '📱', title: 'Interface Generation', desc: 'Custom UI components and responsive layouts' }
            ].map((feature, index) => (<div key={index} style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{feature.icon}</div>
                                            <h3 style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '1.125rem',
                    margin: '0 0 12px 0'
                }}>
                                                {feature.title}
                                            </h3>
                                            <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    margin: 0
                }}>
                                                {feature.desc}
                                            </p>
                                        </div>))}
                                </div>
                            </div>)}

                        {/* Business Model Output */}
                        {generatedBusinessModel && (<div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '32px'
            }}>
                                <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 32px 0'
            }}>
                                    Generated Business Model
                                </h2>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                    <strong>Business Idea:</strong> {generatedBusinessModel.name}
                                </p>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                    <strong>Market Analysis:</strong> {generatedBusinessModel.marketAnalysis}
                                </p>
                                <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                                    <strong>Value Proposition:</strong> {generatedBusinessModel.valueProposition}
                                </p>
                                <button onClick={() => setCurrentStep('theme')} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '16px'
            }}>
                                    Choose Design Theme
                                </button>
                            </div>)}

                        {/* Theme Selection */}
                        {currentStep === 'theme' && (<div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '32px'
            }}>
                                <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 32px 0'
            }}>
                                    Select Your Design Theme
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    {businessThemes.map((theme) => (<div key={theme.id} onClick={() => selectTheme(theme)} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '24px',
                    padding: '24px',
                    cursor: 'pointer',
                    border: '2px solid rgba(229, 231, 235, 0.5)',
                    transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}>
                                            <h3 style={{
                    fontWeight: 'bold',
                    color: '#1f2937',
                    fontSize: '1.25rem',
                    margin: '0 0 8px 0'
                }}>
                                                {theme.name}
                                            </h3>
                                            <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: '0 0 4px 0'
                }}>
                                                {theme.category}
                                            </p>
                                            <p style={{
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    margin: 0
                }}>
                                                {theme.aesthetic}
                                            </p>
                                        </div>))}
                                </div>
                            </div>)}

                        {/* Interface Generation */}
                        {currentStep === 'interface' && selectedTheme && (<div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '32px'
            }}>
                                <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 32px 0'
            }}>
                                    Generated Interface for {selectedTheme.name}
                                </h2>
                                <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px'
            }}>
                                    <h3 style={{
                fontWeight: 'bold',
                color: '#1f2937',
                fontSize: '1.125rem',
                margin: '0 0 16px 0'
            }}>
                                        Interface Components
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        {selectedTheme.interfaceElements.map((element, index) => (<div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                                                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                                                    {element === 'Dashboard' ? '📊' :
                    element === 'Analytics' ? '📈' :
                        element === 'Team collaboration' ? '👥' :
                            element === 'Product catalog' ? '📦' :
                                element === 'Order management' ? '🛒' : '⚡'}
                                                </div>
                                                <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                }}>
                                                    {element}
                                                </span>
                                            </div>))}
                                    </div>
                                </div>
                                <button onClick={() => setCurrentStep('roadmap')} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}>
                                    View Implementation Roadmap
                                </button>
                            </div>)}

                        {/* Implementation Roadmap */}
                        {currentStep === 'roadmap' && (<div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '32px'
            }}>
                                <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 32px 0'
            }}>
                                    Implementation Roadmap
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {[
                'Phase 1: MVP Development (Weeks 1-4)',
                'Phase 2: Market Testing (Weeks 5-8)',
                'Phase 3: Full Launch (Weeks 9-12)',
                'Phase 4: Scale & Optimize (Weeks 13-16)'
            ].map((phase, index) => (<div key={index} style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(229, 231, 235, 0.5)'
                }}>
                                            <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                                                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                }}>
                                                    {index + 1}
                                                </div>
                                                <span style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#374151'
                }}>
                                                    {phase}
                                                </span>
                                            </div>
                                        </div>))}
                                </div>
                                <button onClick={() => setCurrentStep('idea')} style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '24px'
            }}>
                                    Start New Business Plan
                                </button>
                            </div>)}
                    </div>
                </div>
            </main>
        </div>);
};
exports.default = BusinessPlanDesigner;
//# sourceMappingURL=BusinessPlanDesigner.js.map