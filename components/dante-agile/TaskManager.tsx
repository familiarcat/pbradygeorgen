'use client';

import { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { mockTasksData } from './mockData';

export default function TaskManager() {
  const [tasks, setTasks] = useState(mockTasksData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeRealm, setActiveRealm] = useState('all');
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    DanteLogger.success.ux(`Filtered tasks by status: ${filter}`);
  };
  
  const handleRealmChange = (realm: string) => {
    setActiveRealm(realm);
    DanteLogger.success.ux(`Filtered tasks by realm: ${realm}`);
  };
  
  const filteredTasks = tasks.filter(task => {
    const statusMatch = activeFilter === 'all' || task.status === activeFilter;
    const realmMatch = activeRealm === 'all' || task.realm === activeRealm;
    return statusMatch && realmMatch;
  });
  
  const getRealmEmoji = (realm: string) => {
    switch (realm) {
      case 'inferno': return '🔥';
      case 'purgatorio': return '⛰️';
      case 'paradiso': return '✨';
      default: return '';
    }
  };
  
  const getRealmColor = (realm: string) => {
    switch (realm) {
      case 'inferno': return 'bg-red-50 border-red-200 text-red-800';
      case 'purgatorio': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'paradiso': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };
  
  const getLevelName = (realm: string, level: number) => {
    if (realm === 'inferno') {
      const circles = [
        'Validation Failures', 'Data Flow Errors', 'Resource Issues',
        'Storage Problems', 'Runtime Exceptions', 'Configuration Errors',
        'Build Failures', 'Security Vulnerabilities', 'Critical System Failures'
      ];
      return circles[level - 1] || `Circle ${level}`;
    } else if (realm === 'purgatorio') {
      const terraces = [
        'Legacy Code Refactoring', 'Performance Optimization', 'Resource Management',
        'Process Improvement', 'Dependency Management', 'Knowledge Sharing',
        'Security Hardening'
      ];
      return terraces[level - 1] || `Terrace ${level}`;
    } else if (realm === 'paradiso') {
      const spheres = [
        'Basic Completion', 'Performance Excellence', 'UX Delight',
        'Core Functionality', 'Security Excellence', 'System Harmony',
        'Architectural Beauty', 'Successful Deployment', 'Innovation',
        'Transcendence'
      ];
      return spheres[level - 1] || `Sphere ${level}`;
    }
    return `Level ${level}`;
  };
  
  const getLevelEmoji = (realm: string, level: number) => {
    if (realm === 'inferno') {
      const emojis = ['🧩', '🔄', '🔋', '💾', '⚡', '⚙️', '🔨', '🔒', '💥'];
      return emojis[level - 1] || '🔥';
    } else if (realm === 'purgatorio') {
      const emojis = ['📜', '⏱️', '📊', '🐢', '📦', '🧠', '🛡️'];
      return emojis[level - 1] || '⛰️';
    } else if (realm === 'paradiso') {
      const emojis = ['✅', '🚀', '😊', '🧠', '🔐', '🌐', '🏛️', '🚢', '💡', '✨'];
      return emojis[level - 1] || '✨';
    }
    return '';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'todo': return '📋';
      case 'in-progress': return '🔄';
      case 'review': return '👀';
      case 'completed': return '✅';
      case 'blocked': return '🚫';
      default: return '';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Task Manager
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Manage tasks across the three realms of Dante's journey.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                    : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('todo')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'todo'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 To Do
              </button>
              <button
                onClick={() => handleFilterChange('in-progress')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'in-progress'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                🔄 In Progress
              </button>
              <button
                onClick={() => handleFilterChange('review')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'review'
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                👀 Review
              </button>
              <button
                onClick={() => handleFilterChange('completed')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'completed'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✅ Completed
              </button>
              <button
                onClick={() => handleFilterChange('blocked')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'blocked'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                🚫 Blocked
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Filter by Realm</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRealmChange('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'all'
                    ? 'bg-[var(--cta-primary, #0070f3)] text-white'
                    : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
                }`}
              >
                All Realms
              </button>
              <button
                onClick={() => handleRealmChange('inferno')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'inferno'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                🔥 Inferno
              </button>
              <button
                onClick={() => handleRealmChange('purgatorio')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'purgatorio'
                    ? 'bg-yellow-700 text-white'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                ⛰️ Purgatorio
              </button>
              <button
                onClick={() => handleRealmChange('paradiso')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'paradiso'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✨ Paradiso
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realm & Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{task.name}</div>
                    <div className="text-xs text-gray-500">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRealmColor(task.realm)}`}>
                      <span className="mr-1">{getRealmEmoji(task.realm)}</span>
                      {task.realm.charAt(0).toUpperCase() + task.realm.slice(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="mr-1">{getLevelEmoji(task.realm, task.level)}</span>
                      {getLevelName(task.realm, task.level)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--cta-primary, #0070f3)] flex items-center justify-center text-white text-xs font-medium">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{task.assignee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      <span className="mr-1">{getStatusEmoji(task.status)}</span>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary, #666)]">No tasks match the current filters.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Task Creation Guide
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          How to create tasks using our philosophical framework.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="flex items-center text-lg font-medium text-red-800 mb-2">
              <span className="mr-2">🔥</span> Inferno Tasks
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Tasks that address challenges, bugs, and technical debt.
            </p>
            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Focus on fixing what's broken</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Address technical debt</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Resolve security vulnerabilities</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="flex items-center text-lg font-medium text-yellow-800 mb-2">
              <span className="mr-2">⛰️</span> Purgatorio Tasks
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              Tasks that improve existing functionality and processes.
            </p>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>Refactor code for better maintainability</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>Optimize performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>Improve documentation</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="flex items-center text-lg font-medium text-green-800 mb-2">
              <span className="mr-2">✨</span> Paradiso Tasks
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Tasks that create new value and innovation.
            </p>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Develop new features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Enhance user experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Create innovative solutions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
