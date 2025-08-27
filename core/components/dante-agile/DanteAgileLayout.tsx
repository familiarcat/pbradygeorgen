'use client';

import { useState } from 'react';
import Link from 'next/link';
import SprintDashboard from './SprintDashboard';
import TeamBoard from './TeamBoard';
import CeremonyGuide from './CeremonyGuide';
import TaskManager from './TaskManager';
import { DanteLogger } from '@/utils/DanteLogger';

interface DanteAgileLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DanteAgileLayout({ activeTab, onTabChange }: DanteAgileLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary, #f5f5f5)]">
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
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'dashboard'
                      ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                      : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'
                  }`}
                >
                  Sprint Journey
                </button>
                <button
                  onClick={() => onTabChange('team')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'team'
                      ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                      : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'
                  }`}
                >
                  Team Board
                </button>
                <button
                  onClick={() => onTabChange('ceremonies')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'ceremonies'
                      ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                      : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'
                  }`}
                >
                  Ceremony Guide
                </button>
                <button
                  onClick={() => onTabChange('tasks')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'tasks'
                      ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                      : 'text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]'
                  }`}
                >
                  Task Manager
                </button>
              </nav>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="text-[var(--text-secondary, #666)] hover:text-[var(--text-primary, #333)]"
              >
                Back to App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <SprintDashboard />}
        {activeTab === 'team' && <TeamBoard />}
        {activeTab === 'ceremonies' && <CeremonyGuide />}
        {activeTab === 'tasks' && <TaskManager />}
      </main>
    </div>
  );
}
