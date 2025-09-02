"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
function Home() {
    const features = [
        {
            title: "🏛️ Observation Lounge",
            description: "View comprehensive crew status and project analysis from all 8 specialized AI agents",
            href: "/observation-lounge",
            status: "Fully Operational",
            statusColor: "text-green-600 bg-green-50"
        },
        {
            title: "🧪 Unified Testing",
            description: "Test N8N workflows and crew member connectivity with comprehensive test suite",
            href: "/unified-testing",
            status: "Ready",
            statusColor: "text-blue-600 bg-blue-50"
        },
        {
            title: "🎭 Playwright Runner",
            description: "Visual test runner with real-time execution and comprehensive reporting",
            href: "/playwright-runner",
            status: "Active",
            statusColor: "text-purple-600 bg-purple-50"
        },
        {
            title: "📄 PDF Viewer",
            description: "Advanced PDF viewing with intelligent content analysis capabilities",
            href: "/view",
            status: "Enhanced",
            statusColor: "text-indigo-600 bg-indigo-50"
        },
        {
            title: "📊 Content Analyzer",
            description: "AI-powered content analysis with crew member insights and recommendations",
            href: "/content-analyzer",
            status: "Operational",
            statusColor: "text-teal-600 bg-teal-50"
        }
    ];
    const systemStats = [
        { label: "Crew Members", value: "8/8", icon: "🤖", color: "text-green-600" },
        { label: "N8N Workflows", value: "Ready", icon: "🔧", color: "text-yellow-600" },
        { label: "CLI Access", value: "Active", icon: "💻", color: "text-blue-600" },
        { label: "System Health", value: "100%", icon: "❤️", color: "text-red-500" }
    ];
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Claude Code Integration
              </h1>
              <p className="text-gray-600 mt-1">
                Multi-Agent AI System with N8N Workflow Automation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 font-medium">✅ System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* System Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (<div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Interfaces</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, index) => (<link_1.default key={index} href={feature.href} className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${feature.statusColor}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                    <span>Launch Interface</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </link_1.default>))}
          </div>
        </div>

        {/* Crew Status Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crew Status Preview</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
            { name: "Captain Picard", role: "Strategic Leadership", status: "operational" },
            { name: "Commander Data", role: "Scientific Analysis", status: "operational" },
            { name: "Lt. Worf", role: "Security Operations", status: "operational" },
            { name: "Geordi La Forge", role: "Engineering", status: "operational" },
            { name: "Counselor Troi", role: "Psychology", status: "operational" },
            { name: "Lt. Uhura", role: "Communications", status: "operational" },
            { name: "Dr. Crusher", role: "System Health", status: "operational" },
            { name: "Quark", role: "Business Analysis", status: "operational" }
        ].map((crew, index) => (<div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm">{crew.name}</span>
                    <span className="text-green-500 text-xs">✅</span>
                  </div>
                  <p className="text-xs text-gray-600">{crew.role}</p>
                </div>))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <link_1.default href="/observation-lounge" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                View Full Crew Analysis 
                <span className="ml-1">→</span>
              </link_1.default>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🧪</div>
              <h3 className="font-semibold text-gray-800 mb-2">Run Tests</h3>
              <p className="text-sm text-gray-600">Execute Playwright and Jest test suites</p>
            </button>
            <button className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-800 mb-2">Activate N8N</h3>
              <p className="text-sm text-gray-600">Enable workflow automation endpoints</p>
            </button>
            <button className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibent text-gray-800 mb-2">View Metrics</h3>
              <p className="text-sm text-gray-600">System performance and analytics</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <div className="inline-block bg-white rounded-lg shadow-sm p-4">
            <p className="text-gray-600 text-sm mb-2">
              🎉 <strong>Claude Code Integration Complete</strong>
            </p>
            <p className="text-gray-500 text-xs">
              Multi-agent AI system with N8N workflows • Production ready • CLI accessible via `cc`
            </p>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map