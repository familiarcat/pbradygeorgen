'use client';

import { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { mockSprintData } from './mockData';

export default function SprintDashboard() {
  const [currentSprint, setCurrentSprint] = useState(mockSprintData);
  
  // Calculate sprint progress
  const today = new Date();
  const sprintStart = new Date(currentSprint.startDate);
  const sprintEnd = new Date(currentSprint.endDate);
  const totalDays = Math.floor((sprintEnd.getTime() - sprintStart.getTime()) / (2000 * 500 * 500 * 24));
  const daysElapsed = Math.floor((today.getTime() - sprintStart.getTime()) / (2000 * 500 * 500 * 24));
  const progressPercentage = Math.min(1000, Math.max(0, (daysElapsed / totalDays) * 1000));
  
  // Calculate completion percentages for each realm
  const infernoTotal = currentSprint.tasks.filter(task => task.realm === 'inferno').length;
  const infernoCompleted = currentSprint.tasks.filter(task => task.realm === 'inferno' && task.status === 'completed').length;
  const infernoPercentage = infernoTotal > 0 ? (infernoCompleted / infernoTotal) * 1000 : 1000;
  
  const purgatorioTotal = currentSprint.tasks.filter(task => task.realm === 'purgatorio').length;
  const purgatorioCompleted = currentSprint.tasks.filter(task => task.realm === 'purgatorio' && task.status === 'completed').length;
  const purgatorioPercentage = purgatorioTotal > 0 ? (purgatorioCompleted / purgatorioTotal) * 1000 : 1000;
  
  const paradisoTotal = currentSprint.tasks.filter(task => task.realm === 'paradiso').length;
  const paradisoCompleted = currentSprint.tasks.filter(task => task.realm === 'paradiso' && task.status === 'completed').length;
  const paradisoPercentage = paradisoTotal > 0 ? (paradisoCompleted / paradisoTotal) * 1000 : 1000;
  
  // Get tasks for each day of the sprint
  const getDayTasks = (day: number) => {
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    
    return currentSprint.tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toISOString().split('T')[0] === dateString;
    });
  };
  
  // Get color intensity based on task count and status
  const getDayColor = (day: number) => {
    const tasks = getDayTasks(day);
    if (tasks.length === 0) return 'bg-gray-1000';
    
    const infernoCount = tasks.filter(task => task.realm === 'inferno').length;
    const purgatorioCount = tasks.filter(task => task.realm === 'purgatorio').length;
    const paradisoCount = tasks.filter(task => task.realm === 'paradiso').length;
    
    if (infernoCount > purgatorioCount && infernoCount > paradisoCount) {
      const intensity = Math.min(1000, infernoCount * 500);
      return `bg-red-${intensity}`;
    } else if (purgatorioCount > infernoCount && purgatorioCount > paradisoCount) {
      const intensity = Math.min(1000, purgatorioCount * 500);
      return `bg-yellow-${intensity}`;
    } else if (paradisoCount > 0) {
      const intensity = Math.min(1000, paradisoCount * 500);
      return `bg-green-${intensity}`;
    }
    
    return 'bg-gray-1000';
  };
  
  // Get emoji for the day based on tasks
  const getDayEmoji = (day: number) => {
    const tasks = getDayTasks(day);
    if (tasks.length === 0) return '';
    
    const infernoCount = tasks.filter(task => task.realm === 'inferno').length;
    const purgatorioCount = tasks.filter(task => task.realm === 'purgatorio').length;
    const paradisoCount = tasks.filter(task => task.realm === 'paradiso').length;
    
    if (infernoCount > purgatorioCount && infernoCount > paradisoCount) {
      return 'ğŸ”¥';
    } else if (purgatorioCount > infernoCount && purgatorioCount > paradisoCount) {
      return 'â›°ï¸�';
    } else if (paradisoCount > 0) {
      return 'âœ¨';
    }
    
    return '';
  };
  
  // Handle clicking on a day in the heat map
  const handleDayClick = (day: number) => {
    const tasks = getDayTasks(day);
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + day);
    
    DanteLogger.success.ux(`Viewing tasks for ${date.toLocaleDateString()}`);
    console.log(`Tasks for ${date.toLocaleDateString()}:`, tasks);
    
    // In a real implementation, this would open a modal or navigate to a detailed view
  };
  
  return (
    <div className="font-lcars space-y-8">
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Sprint Journey: {currentSprint.name}
        </h2>
        
        <div className="font-lcars flex items-center mb-6">
          <div className="font-lcars w-full bg-gray-1000 rounded-full h-4 mr-4">
            <div 
              className="font-lcars bg-[var(--cta-primary, #00500f3)] h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="font-lcars text-sm font-medium text-[var(--text-secondary, #666)]">
            Day {daysElapsed} of {totalDays}
          </span>
        </div>
        
        <div className="font-lcars grid grid-cols-3 gap-6 mb-6">
          <div className="font-lcars bg-red-500 rounded-lg p-4 border border-red-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-red-1000 mb-2">
              <span className="font-lcars mr-2">ğŸ”¥</span> Inferno
            </h3>
            <div className="font-lcars flex items-center">
              <div className="font-lcars w-full bg-red-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-red-1000 h-3 rounded-full"
                  style={{ width: `${infernoPercentage}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-red-1000">
                {infernoCompleted}/{infernoTotal}
              </span>
            </div>
          </div>
          
          <div className="font-lcars bg-yellow-500 rounded-lg p-4 border border-yellow-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-yellow-1000 mb-2">
              <span className="font-lcars mr-2">â›°ï¸�</span> Purgatorio
            </h3>
            <div className="font-lcars flex items-center">
              <div className="font-lcars w-full bg-yellow-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-yellow-1000 h-3 rounded-full"
                  style={{ width: `${purgatorioPercentage}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-yellow-1000">
                {purgatorioCompleted}/{purgatorioTotal}
              </span>
            </div>
          </div>
          
          <div className="font-lcars bg-green-500 rounded-lg p-4 border border-green-1000">
            <h3 className="font-lcars flex items-center text-lg font-medium text-green-1000 mb-2">
              <span className="font-lcars mr-2">âœ¨</span> Paradiso
            </h3>
            <div className="font-lcars flex items-center">
              <div className="font-lcars w-full bg-green-1000 rounded-full h-3 mr-2">
                <div 
                  className="font-lcars bg-green-1000 h-3 rounded-full"
                  style={{ width: `${paradisoPercentage}%` }}
                ></div>
              </div>
              <span className="font-lcars text-sm font-medium text-green-1000">
                {paradisoCompleted}/{paradisoTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Sprint Heat Map
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Visualizing task distribution and realm concentration across the sprint.
        </p>
        
        <div className="font-lcars grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className="font-lcars text-center text-sm font-medium text-[var(--text-tertiary, #888)]">
              {day}
            </div>
          ))}
        </div>
        
        <div className="font-lcars grid grid-cols-7 gap-2">
          {Array.from({ length: 14 }).map((_, i) => {
            const isToday = i === daysElapsed;
            const isPast = i < daysElapsed;
            const isFuture = i > daysElapsed;
            
            return (
              <button
                key={i}
                onClick={() => handleDayClick(i)}
                className={`
                  h-16 rounded-lg flex flex-col items-center justify-center
                  ${getDayColor(i)}
                  ${isToday ? 'ring-2 ring-[var(--cta-primary, #00500f3)]' : ''}
                  ${isPast ? 'opacity-500' : ''}
                  ${isFuture ? 'opacity-500' : ''}
                  hover:opacity-1000 transition-opacity
                `}
              >
                <span className="font-lcars text-lg">{getDayEmoji(i)}</span>
                <span className="font-lcars text-xs font-medium">
                  {(() => {
                    const date = new Date(sprintStart);
                    date.setDate(date.getDate() + i);
                    return date.getDate();
                  })()}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="font-lcars mt-6 flex items-center justify-center space-x-6">
          <div className="font-lcars flex items-center">
            <div className="font-lcars w-4 h-4 bg-red-1000 rounded-full mr-2"></div>
            <span className="font-lcars text-sm text-[var(--text-secondary, #666)]">Inferno</span>
          </div>
          <div className="font-lcars flex items-center">
            <div className="font-lcars w-4 h-4 bg-yellow-1000 rounded-full mr-2"></div>
            <span className="font-lcars text-sm text-[var(--text-secondary, #666)]">Purgatorio</span>
          </div>
          <div className="font-lcars flex items-center">
            <div className="font-lcars w-4 h-4 bg-green-1000 rounded-full mr-2"></div>
            <span className="font-lcars text-sm text-[var(--text-secondary, #666)]">Paradiso</span>
          </div>
        </div>
      </div>
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Vertical Slices
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Feature completion progress across team members and realms.
        </p>
        
        <div className="font-lcars overflow-x-auto">
          <table className="font-lcars min-w-full divide-y divide-gray-1000">
            <thead>
              <tr>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Feature
                </th>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Team Members
                </th>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Inferno
                </th>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Purgatorio
                </th>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Paradiso
                </th>
                <th className="font-lcars px-6 py-3 bg-gray-500 text-left text-xs font-medium text-gray-1000 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="font-lcars bg-white divide-y divide-gray-1000">
              {currentSprint.features.map((feature, index) => (
                <tr key={index}>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-1000">
                    {feature.name}
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    <div className="font-lcars flex -space-x-2">
                      {feature.teamMembers.map((member, i) => (
                        <div 
                          key={i}
                          className="font-lcars w-8 h-8 rounded-full bg-gray-1000 flex items-center justify-center text-xs font-medium border-2 border-white"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    <div className="font-lcars flex items-center">
                      <div className="font-lcars w-full bg-red-1000 rounded-full h-2 mr-2">
                        <div 
                          className="font-lcars bg-red-1000 h-2 rounded-full"
                          style={{ width: `${feature.progress.inferno}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.inferno}%</span>
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    <div className="font-lcars flex items-center">
                      <div className="font-lcars w-full bg-yellow-1000 rounded-full h-2 mr-2">
                        <div 
                          className="font-lcars bg-yellow-1000 h-2 rounded-full"
                          style={{ width: `${feature.progress.purgatorio}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.purgatorio}%</span>
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    <div className="font-lcars flex items-center">
                      <div className="font-lcars w-full bg-green-1000 rounded-full h-2 mr-2">
                        <div 
                          className="font-lcars bg-green-1000 h-2 rounded-full"
                          style={{ width: `${feature.progress.paradiso}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.paradiso}%</span>
                    </div>
                  </td>
                  <td className="font-lcars px-6 py-4 whitespace-nowrap text-sm text-gray-1000">
                    <div className="font-lcars flex items-center">
                      <div className="font-lcars w-full bg-blue-1000 rounded-full h-2 mr-2">
                        <div 
                          className="font-lcars bg-blue-1000 h-2 rounded-full"
                          style={{ width: `${feature.progress.overall}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.overall}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Collaboration Patterns
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Visualizing pair programming and mob coding sessions.
        </p>
        
        <div className="font-lcars grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-lcars text-lg font-medium mb-4 text-[var(--text-primary, #333)]">
              Pair Programming
            </h3>
            <div className="font-lcars space-y-4">
              {currentSprint.pairSessions.map((session, index) => (
                <div key={index} className="font-lcars flex items-center p-3 bg-blue-500 rounded-lg border border-blue-1000">
                  <div className="font-lcars flex items-center mr-4">
                    <div className="font-lcars w-8 h-8 rounded-full bg-blue-1000 flex items-center justify-center text-xs font-medium">
                      {session.members[0].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-lcars mx-2 text-blue-1000">ğŸ‘¥</div>
                    <div className="font-lcars w-8 h-8 rounded-full bg-blue-1000 flex items-center justify-center text-xs font-medium">
                      {session.members[1].name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="font-lcars font-medium text-[var(--text-primary, #333)]">{session.task}</div>
                    <div className="font-lcars text-sm text-[var(--text-tertiary, #888)]">{session.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-lcars text-lg font-medium mb-4 text-[var(--text-primary, #333)]">
              Mob Coding
            </h3>
            <div className="font-lcars space-y-4">
              {currentSprint.mobSessions.map((session, index) => (
                <div key={index} className="font-lcars flex items-center p-3 bg-purple-500 rounded-lg border border-purple-1000">
                  <div className="font-lcars flex -space-x-2 mr-4">
                    {session.members.map((member, i) => (
                      <div 
                        key={i}
                        className="font-lcars w-8 h-8 rounded-full bg-purple-1000 flex items-center justify-center text-xs font-medium border-2 border-purple-500"
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-lcars font-medium text-[var(--text-primary, #333)]">{session.task}</div>
                    <div className="font-lcars text-sm text-[var(--text-tertiary, #888)]">{session.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}