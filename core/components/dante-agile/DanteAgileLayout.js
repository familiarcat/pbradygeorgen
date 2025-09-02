"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DanteAgileLayout;
const link_1 = __importDefault(require("next/link"));
const SprintDashboard_1 = __importDefault(require("./SprintDashboard"));
const TeamBoard_1 = __importDefault(require("./TeamBoard"));
const CeremonyGuide_1 = __importDefault(require("./CeremonyGuide"));
const TaskManager_1 = __importDefault(require("./TaskManager"));
function DanteAgileLayout({ activeTab, onTabChange }) {
    return (<div className="min-h-screen bg-[var(--bg-primary, #f5f5f5)]">
      <header className="bg-[var(--bg-secondary, #fff)] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-[var(--text-primary, #333)]">
                  Dante Agile
                </h1>
              </div>
              <nav className="ml-10 flex items-center space-x-4">
                <button onClick={() => onTabChange('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard'
            ? 'bg-[var(--cta-primary, #0070f3)] text-white'
            : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'}`}>
                  Sprint Journey
                </button>
                <button onClick={() => onTabChange('team')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'team'
            ? 'bg-[var(--cta-primary, #0070f3)] text-white'
            : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'}`}>
                  Team Board
                </button>
                <button onClick={() => onTabChange('ceremonies')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'ceremonies'
            ? 'bg-[var(--cta-primary, #0070f3)] text-white'
            : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'}`}>
                  Ceremony Guide
                </button>
                <button onClick={() => onTabChange('tasks')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'tasks'
            ? 'bg-[var(--cta-primary, #0070f3)] text-white'
            : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'}`}>
                  Task Manager
                </button>
              </nav>
            </div>
            <div className="flex items-center">
              <link_1.default href="/" className="text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]">
                Back to App
              </link_1.default>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <SprintDashboard_1.default />}
        {activeTab === 'team' && <TeamBoard_1.default />}
        {activeTab === 'ceremonies' && <CeremonyGuide_1.default />}
        {activeTab === 'tasks' && <TaskManager_1.default />}
      </main>
    </div>);
}
//# sourceMappingURL=DanteAgileLayout.js.map