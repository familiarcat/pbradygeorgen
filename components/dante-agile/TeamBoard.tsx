'use client';

import { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { mockTeamData } from './mockData';

export default function TeamBoard() {
  const [teamData, setTeamData] = useState(mockTeamData);
  
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
  
  return (
    <div className="font-lcars space-y-8">
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Team Dashboard
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Current team status and task distribution across the three realms.
        </p>
        
        <div className="font-lcars grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamData.members.map((member, index) => (
            <div key={index} className="font-lcars bg-white rounded-lg border border-gray-1000 overflow-hidden">
              <div className="font-lcars p-4 border-b border-gray-1000">
                <div className="font-lcars flex items-center">
                  <div className="font-lcars w-12 h-12 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-lg font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="font-lcars ml-4">
                    <h3 className="font-lcars text-lg font-medium text-[var(--text-primary, #333)]">{member.name}</h3>
                    <p className="font-lcars text-sm text-[var(--text-tertiary, #888)]">{member.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="font-lcars p-4">
                <h4 className="font-lcars text-sm font-medium text-[var(--text-secondary, #666)] mb-2">Current Tasks</h4>
                <div className="font-lcars space-y-2">
                  {member.tasks.map((task, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg border ${getRealmColor(task.realm)}`}
                    >
                      <div className="font-lcars flex items-start">
                        <span className="font-lcars text-lg mr-2">{getRealmEmoji(task.realm)}</span>
                        <div>
                          <div className="font-lcars font-medium">{task.name}</div>
                          <div className="font-lcars text-xs mt-1 flex items-center">
                            <span className="font-lcars mr-1">{getLevelEmoji(task.realm, task.level)}</span>
                            {getLevelName(task.realm, task.level)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="font-lcars p-4 bg-gray-500 border-t border-gray-1000">
                <div className="font-lcars flex justify-between items-center mb-2">
                  <h4 className="font-lcars text-sm font-medium text-[var(--text-secondary, #666)]">Realm Distribution</h4>
                </div>
                <div className="font-lcars flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="font-lcars bg-red-1000" 
                    style={{ width: `${member.distribution.inferno}%` }}
                    title={`Inferno: ${member.distribution.inferno}%`}
                  ></div>
                  <div 
                    className="font-lcars bg-yellow-1000" 
                    style={{ width: `${member.distribution.purgatorio}%` }}
                    title={`Purgatorio: ${member.distribution.purgatorio}%`}
                  ></div>
                  <div 
                    className="font-lcars bg-green-1000" 
                    style={{ width: `${member.distribution.paradiso}%` }}
                    title={`Paradiso: ${member.distribution.paradiso}%`}
                  ></div>
                </div>
                <div className="font-lcars flex justify-between mt-1 text-xs text-[var(--text-tertiary, #888)]">
                  <div>ğŸ”¥ {member.distribution.inferno}%</div>
                  <div>â›°ï¸� {member.distribution.purgatorio}%</div>
                  <div>âœ¨ {member.distribution.paradiso}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Team Philosophical Balance
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          How the team embodies our four philosophical approaches.
        </p>
        
        <div className="font-lcars grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="font-lcars bg-blue-500 rounded-lg p-4 border border-blue-1000">
            <h3 className="font-lcars text-lg font-medium text-blue-1000 mb-2">Hesse</h3>
            <p className="font-lcars text-sm text-blue-1000 mb-4">Technical precision and analytical rigor</p>
            
            <div className="font-lcars flex items-center mb-2">
              <div className="font-lcars w-full bg-blue-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-blue-1000 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.hesse}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-blue-1000">
                {teamData.philosophy.hesse}%
              </span>
            </div>
            
            <div className="font-lcars text-xs text-blue-1000">
              {teamData.philosophy.hesse < 33 ? (
                "The team could benefit from more technical precision and analytical thinking."
              ) : teamData.philosophy.hesse < 66 ? (
                "The team has a good balance of technical precision in their work."
              ) : (
                "The team excels at technical precision and analytical problem-solving."
              )}
            </div>
          </div>
          
          <div className="font-lcars bg-green-500 rounded-lg p-4 border border-green-1000">
            <h3 className="font-lcars text-lg font-medium text-green-1000 mb-2">Salinger</h3>
            <p className="font-lcars text-sm text-green-1000 mb-4">Authentic human-centered approach</p>
            
            <div className="font-lcars flex items-center mb-2">
              <div className="font-lcars w-full bg-green-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-green-1000 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.salinger}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-green-1000">
                {teamData.philosophy.salinger}%
              </span>
            </div>
            
            <div className="font-lcars text-xs text-green-1000">
              {teamData.philosophy.salinger < 33 ? (
                "The team could focus more on authentic user experiences and human needs."
              ) : teamData.philosophy.salinger < 66 ? (
                "The team has a good balance of human-centered design in their work."
              ) : (
                "The team excels at creating authentic, human-centered experiences."
              )}
            </div>
          </div>
          
          <div className="font-lcars bg-purple-500 rounded-lg p-4 border border-purple-1000">
            <h3 className="font-lcars text-lg font-medium text-purple-1000 mb-2">Derrida</h3>
            <p className="font-lcars text-sm text-purple-1000 mb-4">Questioning assumptions and conventions</p>
            
            <div className="font-lcars flex items-center mb-2">
              <div className="font-lcars w-full bg-purple-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-purple-1000 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.derrida}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-purple-1000">
                {teamData.philosophy.derrida}%
              </span>
            </div>
            
            <div className="font-lcars text-xs text-purple-1000">
              {teamData.philosophy.derrida < 33 ? (
                "The team could benefit from more questioning of assumptions and conventions."
              ) : teamData.philosophy.derrida < 66 ? (
                "The team has a good balance of critical thinking in their work."
              ) : (
                "The team excels at challenging assumptions and finding innovative solutions."
              )}
            </div>
          </div>
          
          <div className="font-lcars bg-amber-500 rounded-lg p-4 border border-amber-1000">
            <h3 className="font-lcars text-lg font-medium text-amber-1000 mb-2">Dante</h3>
            <p className="font-lcars text-sm text-amber-1000 mb-4">Journey through challenges to excellence</p>
            
            <div className="font-lcars flex items-center mb-2">
              <div className="font-lcars w-full bg-amber-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-amber-1000 h-3 rounded-full"
                  style={{ width: `${teamData.philosophy.dante}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-amber-1000">
                {teamData.philosophy.dante}%
              </span>
            </div>
            
            <div className="font-lcars text-xs text-amber-1000">
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
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Learning & Growth
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Team learning activities and knowledge sharing.
        </p>
        
        <div className="font-lcars space-y-4">
          {teamData.learningActivities.map((activity, index) => (
            <div key={index} className="font-lcars p-4 bg-indigo-500 rounded-lg border border-indigo-1000">
              <div className="font-lcars flex items-start">
                <div className="font-lcars text-2xl mr-3">
                  {activity.type === 'pair' ? 'ğŸ‘¥' : 
                   activity.type === 'mob' ? 'ğŸ‘¨â€�ğŸ‘©â€�ğŸ‘§â€�ğŸ‘¦' : 
                   activity.type === 'workshop' ? 'ğŸ§ ' : 
                   activity.type === 'presentation' ? 'ğŸ�¯' : 'ğŸ“š'}
                </div>
                <div>
                  <h3 className="font-lcars text-lg font-medium text-[var(--text-primary, #333)]">{activity.title}</h3>
                  <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">{activity.description}</p>
                  <div className="font-lcars mt-2 flex flex-wrap gap-2">
                    {activity.participants.map((participant, i) => (
                      <div 
                        key={i}
                        className="font-lcars px-2 py-1 bg-indigo-1000 rounded-full text-xs font-medium text-indigo-1000"
                      >
                        {participant}
                      </div>
                    ))}
                  </div>
                  <div className="font-lcars mt-2 text-xs text-[var(--text-tertiary, #888)]">
                    {activity.date} â€¢ {activity.duration}
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