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
      case 'inferno': return 'ğŸ”¥';
      case 'purgatorio': return 'â›°ï¸�';
      case 'paradiso': return 'âœ¨';
      default: return '';
    }
  };
  
  const getRealmColor = (realm: string) => {
    switch (realm) {
      case 'inferno': return 'bg-red-500 border-red-1000 text-red-1000';
      case 'purgatorio': return 'bg-yellow-500 border-yellow-1000 text-yellow-1000';
      case 'paradiso': return 'bg-green-500 border-green-1000 text-green-1000';
      default: return 'bg-gray-500 border-gray-1000 text-gray-1000';
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
      const emojis = ['ğŸ§©', 'ğŸ”„', 'ğŸ”‹', 'ğŸ’¾', 'âš¡', 'âš™ï¸�', 'ğŸ”¨', 'ğŸ”’', 'ğŸ’¥'];
      return emojis[level - 1] || 'ğŸ”¥';
    } else if (realm === 'purgatorio') {
      const emojis = ['ğŸ“œ', 'â�±ï¸�', 'ğŸ“Š', 'ğŸ�¢', 'ğŸ“¦', 'ğŸ§ ', 'ğŸ›¡ï¸�'];
      return emojis[level - 1] || 'â›°ï¸�';
    } else if (realm === 'paradiso') {
      const emojis = ['âœ…', 'ğŸš€', 'ğŸ˜Š', 'ğŸ§ ', 'ğŸ”�', 'ğŸŒ�', 'ğŸ�›ï¸�', 'ğŸš¢', 'ğŸ’¡', 'âœ¨'];
      return emojis[level - 1] || 'âœ¨';
    }
    return '';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-1000 text-gray-1000';
      case 'in-progress': return 'bg-blue-1000 text-blue-1000';
      case 'review': return 'bg-purple-1000 text-purple-1000';
      case 'completed': return 'bg-green-1000 text-green-1000';
      case 'blocked': return 'bg-red-1000 text-red-1000';
      default: return 'bg-gray-1000 text-gray-1000';
    }
  };
  
  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'todo': return 'ğŸ“‹';
      case 'in-progress': return 'ğŸ”„';
      case 'review': return 'ğŸ‘€';
      case 'completed': return 'âœ…';
      case 'blocked': return 'ğŸš«';
      default: return '';
    }
  };
  
  return (
    <div className="font-lcars space-y-8">
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Task Manager
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Manage tasks across the three realms of Dante's journey.
        </p>
        
        <div className="font-lcars flex flex-wrap gap-4 mb-6">
          <div>
            <h3 className="font-lcars text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Filter by Status</h3>
            <div className="font-lcars flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                    : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('todo')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'todo'
                    ? 'bg-gray-1000 text-white'
                    : 'bg-gray-1000 text-gray-1000 hover:bg-gray-1000'
                }`}
              >
                ğŸ“‹ To Do
              </button>
              <button
                onClick={() => handleFilterChange('in-progress')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'in-progress'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-blue-1000 text-blue-1000 hover:bg-blue-1000'
                }`}
              >
                ğŸ”„ In Progress
              </button>
              <button
                onClick={() => handleFilterChange('review')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'review'
                    ? 'bg-purple-1000 text-white'
                    : 'bg-purple-1000 text-purple-1000 hover:bg-purple-1000'
                }`}
              >
                ğŸ‘€ Review
              </button>
              <button
                onClick={() => handleFilterChange('completed')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'completed'
                    ? 'bg-green-1000 text-white'
                    : 'bg-green-1000 text-green-1000 hover:bg-green-1000'
                }`}
              >
                âœ… Completed
              </button>
              <button
                onClick={() => handleFilterChange('blocked')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === 'blocked'
                    ? 'bg-red-1000 text-white'
                    : 'bg-red-1000 text-red-1000 hover:bg-red-1000'
                }`}
              >
                ğŸš« Blocked
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-lcars text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Filter by Realm</h3>
            <div className="font-lcars flex flex-wrap gap-2">
              <button
                onClick={() => handleRealmChange('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'all'
                    ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                    : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
                }`}
              >
                All Realms
              </button>
              <button
                onClick={() => handleRealmChange('inferno')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'inferno'
                    ? 'bg-red-1000 text-white'
                    : 'bg-red-1000 text-red-1000 hover:bg-red-1000'
                }`}
              >
                ğŸ”¥ Inferno
              </button>
              <button
                onClick={() => handleRealmChange('purgatorio')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'purgatorio'
                    ? 'bg-yellow-1000 text-white'
                    : 'bg-yellow-1000 text-yellow-1000 hover:bg-yellow-1000'
                }`}
              >
                â›°ï¸� Purgatorio
              </button>
              <button
                onClick={() => handleRealmChange('paradiso')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeRealm === 'paradiso'
                    ? 'bg-green-1000 text-white'
                    : 'bg-green-1000 text-green-1000 hover:bg-green-1000'
                }`}
              >
                âœ¨ Paradiso
              </button>
            </div>
          </div>
        </div>
        
        <div className="font-lcars overflow-x-auto">
          <table className="font-lcars min-w-full divide-y divide-gray-1000">
            <thead className="font-lcars bg-gray-500">
              <tr>
                <th scope="col" className="font-lcars px-6 py-3 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="font-lcars px-6 py-3 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Realm & Level
                </th>
                <th scope="col" className="font-lcars px-6 py-3 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="font-lcars px-6 py-3 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="font-lcars px-6 py-3 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="font-lcars bg-white divide-y divide-gray-1000">
              {filteredTasks.map((task, index) => (
                <tr key={index}>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap">
                    <div className="font-lcars text-sm font-medium text-gray-1000">{task.name}</div>
                    <div className="font-lcars text-xs text-gray-1000">{task.description}</div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRealmColor(task.realm)}`}>
                      <span className="font-lcars mr-1">{getRealmEmoji(task.realm)}</span>
                      {task.realm.charAt(0).toUpperCase() + task.realm.slice(1)}
                    </div>
                    <div className="font-lcars text-xs text-gray-1000 mt-1 flex items-center">
                      <span className="font-lcars mr-1">{getLevelEmoji(task.realm, task.level)}</span>
                      {getLevelName(task.realm, task.level)}
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap">
                    <div className="font-lcars flex items-center">
                      <div className="font-lcars flex-shrink-0 h-8 w-8 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-xs font-medium">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="font-lcars ml-3">
                        <div className="font-lcars text-sm font-medium text-gray-1000">{task.assignee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      <span className="font-lcars mr-1">{getStatusEmoji(task.status)}</span>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    {task.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="font-lcars text-center py-8">
            <p className="font-lcars text-[var(--text-secondary, #666)]">No tasks match the current filters.</p>
          </div>
        )}
      </div>
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Task Creation Guide
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          How to create tasks using our philosophical framework.
        </p>
        
        <div className="font-lcars grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="font-lcars bg-red-500 rounded-lg p-4 border border-red-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-red-1000 mb-2">
              <span className="font-lcars mr-2">ğŸ”¥</span> Inferno Tasks
            </h3>
            <p className="font-lcars text-sm text-red-1000 mb-4">
              Tasks that address challenges, bugs, and technical debt.
            </p>
            <ul className="font-lcars space-y-2 text-sm text-red-1000">
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-red-1000 mr-2">â€¢</span>
                <span>Focus on fixing what's broken</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-red-1000 mr-2">â€¢</span>
                <span>Address technical debt</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-red-1000 mr-2">â€¢</span>
                <span>Resolve security vulnerabilities</span>
              </li>
            </ul>
          </div>
          
          <div className="font-lcars bg-yellow-500 rounded-lg p-4 border border-yellow-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-yellow-1000 mb-2">
              <span className="font-lcars mr-2">â›°ï¸�</span> Purgatorio Tasks
            </h3>
            <p className="font-lcars text-sm text-yellow-1000 mb-4">
              Tasks that improve existing functionality and processes.
            </p>
            <ul className="font-lcars space-y-2 text-sm text-yellow-1000">
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-yellow-1000 mr-2">â€¢</span>
                <span>Refactor code for better maintainability</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-yellow-1000 mr-2">â€¢</span>
                <span>Optimize performance</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-yellow-1000 mr-2">â€¢</span>
                <span>Improve documentation</span>
              </li>
            </ul>
          </div>
          
          <div className="font-lcars bg-green-500 rounded-lg p-4 border border-green-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-green-1000 mb-2">
              <span className="font-lcars mr-2">âœ¨</span> Paradiso Tasks
            </h3>
            <p className="font-lcars text-sm text-green-1000 mb-4">
              Tasks that create new value and innovation.
            </p>
            <ul className="font-lcars space-y-2 text-sm text-green-1000">
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                <span>Develop new features</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                <span>Enhance user experience</span>
              </li>
              <li className="font-lcars flex items-start">
                <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                <span>Create innovative solutions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}