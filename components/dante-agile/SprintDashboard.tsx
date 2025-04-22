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
  const totalDays = Math.floor((sprintEnd.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.floor((today.getTime() - sprintStart.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Calculate completion percentages for each realm
  const infernoTotal = currentSprint.tasks.filter(task => task.realm === 'inferno').length;
  const infernoCompleted = currentSprint.tasks.filter(task => task.realm === 'inferno' && task.status === 'completed').length;
  const infernoPercentage = infernoTotal > 0 ? (infernoCompleted / infernoTotal) * 100 : 100;
  
  const purgatorioTotal = currentSprint.tasks.filter(task => task.realm === 'purgatorio').length;
  const purgatorioCompleted = currentSprint.tasks.filter(task => task.realm === 'purgatorio' && task.status === 'completed').length;
  const purgatorioPercentage = purgatorioTotal > 0 ? (purgatorioCompleted / purgatorioTotal) * 100 : 100;
  
  const paradisoTotal = currentSprint.tasks.filter(task => task.realm === 'paradiso').length;
  const paradisoCompleted = currentSprint.tasks.filter(task => task.realm === 'paradiso' && task.status === 'completed').length;
  const paradisoPercentage = paradisoTotal > 0 ? (paradisoCompleted / paradisoTotal) * 100 : 100;
  
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
    if (tasks.length === 0) return 'bg-gray-100';
    
    const infernoCount = tasks.filter(task => task.realm === 'inferno').length;
    const purgatorioCount = tasks.filter(task => task.realm === 'purgatorio').length;
    const paradisoCount = tasks.filter(task => task.realm === 'paradiso').length;
    
    if (infernoCount > purgatorioCount && infernoCount > paradisoCount) {
      const intensity = Math.min(100, infernoCount * 20);
      return `bg-red-${intensity}`;
    } else if (purgatorioCount > infernoCount && purgatorioCount > paradisoCount) {
      const intensity = Math.min(100, purgatorioCount * 20);
      return `bg-yellow-${intensity}`;
    } else if (paradisoCount > 0) {
      const intensity = Math.min(100, paradisoCount * 20);
      return `bg-green-${intensity}`;
    }
    
    return 'bg-gray-200';
  };
  
  // Get emoji for the day based on tasks
  const getDayEmoji = (day: number) => {
    const tasks = getDayTasks(day);
    if (tasks.length === 0) return '';
    
    const infernoCount = tasks.filter(task => task.realm === 'inferno').length;
    const purgatorioCount = tasks.filter(task => task.realm === 'purgatorio').length;
    const paradisoCount = tasks.filter(task => task.realm === 'paradiso').length;
    
    if (infernoCount > purgatorioCount && infernoCount > paradisoCount) {
      return '🔥';
    } else if (purgatorioCount > infernoCount && purgatorioCount > paradisoCount) {
      return '⛰️';
    } else if (paradisoCount > 0) {
      return '✨';
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
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Sprint Journey: {currentSprint.name}
        </h2>
        
        <div className="flex items-center mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
            <div 
              className="bg-[var(--cta-primary, #0070f3)] h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-[var(--text-secondary, #666)]">
            Day {daysElapsed} of {totalDays}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="flex items-center text-lg font-medium text-red-800 mb-2">
              <span className="mr-2">🔥</span> Inferno
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-red-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-red-600 h-3 rounded-full"
                  style={{ width: `${infernoPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-red-800">
                {infernoCompleted}/{infernoTotal}
              </span>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="flex items-center text-lg font-medium text-yellow-800 mb-2">
              <span className="mr-2">⛰️</span> Purgatorio
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-yellow-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-yellow-600 h-3 rounded-full"
                  style={{ width: `${purgatorioPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-yellow-800">
                {purgatorioCompleted}/{purgatorioTotal}
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="flex items-center text-lg font-medium text-green-800 mb-2">
              <span className="mr-2">✨</span> Paradiso
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-green-200 rounded-full h-3 mr-2">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${paradisoPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-green-800">
                {paradisoCompleted}/{paradisoTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Sprint Heat Map
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Visualizing task distribution and realm concentration across the sprint.
        </p>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-[var(--text-tertiary, #888)]">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
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
                  ${isToday ? 'ring-2 ring-[var(--cta-primary, #0070f3)]' : ''}
                  ${isPast ? 'opacity-90' : ''}
                  ${isFuture ? 'opacity-70' : ''}
                  hover:opacity-100 transition-opacity
                `}
              >
                <span className="text-lg">{getDayEmoji(i)}</span>
                <span className="text-xs font-medium">
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
        
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-[var(--text-secondary, #666)]">Inferno</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-[var(--text-secondary, #666)]">Purgatorio</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-[var(--text-secondary, #666)]">Paradiso</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Vertical Slices
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Feature completion progress across team members and realms.
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Members
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inferno
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purgatorio
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paradiso
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSprint.features.map((feature, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex -space-x-2">
                      {feature.teamMembers.map((member, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-red-100 rounded-full h-2 mr-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${feature.progress.inferno}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.inferno}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-yellow-100 rounded-full h-2 mr-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: `${feature.progress.purgatorio}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.purgatorio}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-green-100 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${feature.progress.paradiso}%` }}
                        ></div>
                      </div>
                      <span>{feature.progress.paradiso}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-blue-100 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
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
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Collaboration Patterns
        </h2>
        <p className="text-[var(--text-secondary, #666)] mb-6">
          Visualizing pair programming and mob coding sessions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--text-primary, #333)]">
              Pair Programming
            </h3>
            <div className="space-y-4">
              {currentSprint.pairSessions.map((session, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium">
                      {session.members[0].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="mx-2 text-blue-500">👥</div>
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium">
                      {session.members[1].name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary, #333)]">{session.task}</div>
                    <div className="text-sm text-[var(--text-tertiary, #888)]">{session.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-[var(--text-primary, #333)]">
              Mob Coding
            </h3>
            <div className="space-y-4">
              {currentSprint.mobSessions.map((session, index) => (
                <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex -space-x-2 mr-4">
                    {session.members.map((member, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium border-2 border-purple-50"
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary, #333)]">{session.task}</div>
                    <div className="text-sm text-[var(--text-tertiary, #888)]">{session.date}</div>
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
