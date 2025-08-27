'use client';

import { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { mockTeamData } from './mockData';

export default function TeamBoard() {
  const [teamData, setTeamData] = useState(mockTeamData);
  
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
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Team Dashboard
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Current team status and task distribution across the three realms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamData.members.map((member, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--cta-primary, #0070f3)] flex items-center justify-center text-white text-lg font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-[var(--text-primary, #333)]">{member.name}</h3>
                    <p className="text-sm text-[var(--text-tertiary, #888)]">{member.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Current Tasks</h4>
                <div className="space-y-2">
                  {member.tasks.map((task, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg border ${getRealmColor(task.realm)}`}
                    >
                      <div className="flex items-start">
                        <span className="text-lg mr-2">{getRealmEmoji(task.realm)}</span>
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-xs mt-1 flex items-center">
                            <span className="mr-1">{getLevelEmoji(task.realm, task.level)}</span>
                            {getLevelName(task.realm, task.level)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-[var(--text-secondary, #666)]">Realm Distribution</h4>
                </div>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${member.distribution.inferno}%` }}
                    title={`Inferno: ${member.distribution.inferno}%`}
                  ></div>
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${member.distribution.purgatorio}%` }}
                    title={`Purgatorio: ${member.distribution.purgatorio}%`}
                  ></div>
                  <div 
                    className="bg-green-500" 
                    style={{ width: `${member.distribution.paradiso}%` }}
                    title={`Paradiso: ${member.distribution.paradiso}%`}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-[var(--text-tertiary, #888)]">
                  <div>🔥 {member.distribution.inferno}%</div>
                  <div>⛰️ {member.distribution.purgatorio}%</div>
                  <div>✨ {member.distribution.paradiso}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Team Philosophical Balance
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          How the team embodies our four philosophical approaches.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Hesse</h3>
            <p className="text-sm text-blue-700 mb-4">Technical precision and analytical rigor</p>
            
            <div className="flex items-center mb-2">
              <div className="w-full bg-blue-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.hesse}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-800">
                {teamData.philosophy.hesse}%
              </span>
            </div>
            
            <div className="text-xs text-blue-700">
              {teamData.philosophy.hesse < 33 ? (
                "The team could benefit from more technical precision and analytical thinking."
              ) : teamData.philosophy.hesse < 66 ? (
                "The team has a good balance of technical precision in their work."
              ) : (
                "The team excels at technical precision and analytical problem-solving."
              )}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-2">Salinger</h3>
            <p className="text-sm text-green-700 mb-4">Authentic human-centered approach</p>
            
            <div className="flex items-center mb-2">
              <div className="w-full bg-green-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.salinger}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-green-800">
                {teamData.philosophy.salinger}%
              </span>
            </div>
            
            <div className="text-xs text-green-700">
              {teamData.philosophy.salinger < 33 ? (
                "The team could focus more on authentic user experiences and human needs."
              ) : teamData.philosophy.salinger < 66 ? (
                "The team has a good balance of human-centered design in their work."
              ) : (
                "The team excels at creating authentic, human-centered experiences."
              )}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Derrida</h3>
            <p className="text-sm text-purple-700 mb-4">Questioning assumptions and conventions</p>
            
            <div className="flex items-center mb-2">
              <div className="w-full bg-purple-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.derrida}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-purple-800">
                {teamData.philosophy.derrida}%
              </span>
            </div>
            
            <div className="text-xs text-purple-700">
              {teamData.philosophy.derrida < 33 ? (
                "The team could benefit from more questioning of assumptions and conventions."
              ) : teamData.philosophy.derrida < 66 ? (
                "The team has a good balance of critical thinking in their work."
              ) : (
                "The team excels at challenging assumptions and finding innovative solutions."
              )}
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Dante</h3>
            <p className="text-sm text-amber-700 mb-4">Journey through challenges to excellence</p>
            
            <div className="flex items-center mb-2">
              <div className="w-full bg-amber-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-amber-600 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.dante}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-amber-800">
                {teamData.philosophy.dante}%
              </span>
            </div>
            
            <div className="text-xs text-amber-700">
              {teamData.philosophy.dante < 33 ? (
                "The team could benefit from a more structured approach to overcoming challenges."
              ) : teamData.philosophy.dante < 66 ? (
                "The team has a good balance of perseverance and growth in their work."
              ) : (
                "The team excels at navigating challenges and achieving excellence."
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Learning & Growth
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Team learning activities and knowledge sharing.
        </p>
        
        <div className="space-y-4">
          {teamData.learningActivities.map((activity, index) => (
            <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {activity.type === 'pair' ? '👥' : 
                   activity.type === 'mob' ? '👨‍👩‍👧‍👦' : 
                   activity.type === 'workshop' ? '🧠' : 
                   activity.type === 'presentation' ? '🎯' : '📚'}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary, #333)]">{activity.title}</h3>
                  <p className="text-sm text-[var(--text-secondary, #666)] mt-1">{activity.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activity.participants.map((participant, i) => (
                      <div 
                        key={i}
                        className="px-2 py-1 bg-indigo-100 rounded-full text-xs font-medium text-indigo-800"
                      >
                        {participant}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-[var(--text-tertiary, #888)]">
                    {activity.date} • {activity.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
