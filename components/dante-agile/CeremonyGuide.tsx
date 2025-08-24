'use client';

import { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

export default function CeremonyGuide() {
  const [activeCeremony, setActiveCeremony] = useState('planning');
  
  const handleCeremonyChange = (ceremony: string) => {
    setActiveCeremony(ceremony);
    DanteLogger.success.ux(`Viewing ${ceremony} ceremony guide`);
  };
  
  return (
    <div className="font-lcars space-y-8">
      <div className="font-lcars bg-white rounded-lg shadow-md p-6">
        <h2 className="font-lcars text-2xl font-bold mb-4 text-[var(--text-primary, #333)]">
          Philosophical Ceremony Guide
        </h2>
        <p className="font-lcars text-[var(--text-secondary, #666)] mb-6">
          Transform Agile ceremonies with our philosophical framework.
        </p>
        
        <div className="font-lcars flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCeremonyChange('planning')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCeremony === 'planning'
                ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
            }`}
          >
            Sprint Planning
          </button>
          <button
            onClick={() => handleCeremonyChange('standup')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCeremony === 'standup'
                ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
            }`}
          >
            Daily Stand-up
          </button>
          <button
            onClick={() => handleCeremonyChange('review')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCeremony === 'review'
                ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
            }`}
          >
            Sprint Review
          </button>
          <button
            onClick={() => handleCeremonyChange('retro')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCeremony === 'retro'
                ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
            }`}
          >
            Sprint Retrospective
          </button>
          <button
            onClick={() => handleCeremonyChange('refinement')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCeremony === 'refinement'
                ? 'bg-[var(--cta-primary, #00500f3)] text-white'
                : 'bg-[var(--bg-secondary, #f0f0f0)] text-[var(--text-secondary, #666)] hover:bg-[var(--bg-tertiary, #e0e0e0)]'
            }`}
          >
            Backlog Refinement
          </button>
        </div>
        
        {activeCeremony === 'planning' && (
          <div className="font-lcars space-y-6">
            <div className="font-lcars flex items-center">
              <div className="font-lcars text-3xl mr-4">ðŸ—ºï¸�</div>
              <h3 className="font-lcars text-xl font-bold text-[var(--text-primary, #333)]">
                Sprint Planning: The Cartography of Intention
              </h3>
            </div>
            
            <div className="font-lcars grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="font-lcars bg-blue-500 rounded-lg p-4 border border-blue-1000">
                <h4 className="font-lcars text-lg font-medium text-blue-1000 mb-2">Hesse Approach</h4>
                <p className="font-lcars text-sm text-blue-1000 mb-3">Precision in defining tasks and requirements</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Define acceptance criteria with technical precision</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Analyze dependencies and technical constraints</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Estimate with analytical rigor</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-green-500 rounded-lg p-4 border border-green-1000">
                <h4 className="font-lcars text-lg font-medium text-green-1000 mb-2">Salinger Approach</h4>
                <p className="font-lcars text-sm text-green-1000 mb-3">Authentic discussion of user needs</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Focus on the human impact of features</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Discuss the authentic user experience</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Share personal perspectives on user needs</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-purple-500 rounded-lg p-4 border border-purple-1000">
                <h4 className="font-lcars text-lg font-medium text-purple-1000 mb-2">Derrida Approach</h4>
                <p className="font-lcars text-sm text-purple-1000 mb-3">Questioning assumptions</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Challenge assumptions about requirements</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Deconstruct the "diffÃ©rance" between plan and execution</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Question conventional approaches to problems</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-amber-500 rounded-lg p-4 border border-amber-1000">
                <h4 className="font-lcars text-lg font-medium text-amber-1000 mb-2">Dante Approach</h4>
                <p className="font-lcars text-sm text-amber-1000 mb-3">Mapping the journey ahead</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Identify potential challenges (Inferno)</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Plan for improvements (Purgatorio)</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Envision success and innovation (Paradiso)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="font-lcars bg-white rounded-lg border border-gray-1000 p-4">
              <h4 className="font-lcars text-lg font-medium mb-3 text-[var(--text-primary, #333)]">Ceremony Format</h4>
              <ol className="font-lcars space-y-4">
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    1
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Realm Acknowledgment (5 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Begin by acknowledging which realm the team is currently in. Discuss the team's current state and challenges.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    2
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Story Mapping (500 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Use color-coding based on our realms (red for challenges, yellow for improvements, green for innovations).
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    3
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Philosophical Questioning (15 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      For each story, ask the four philosophical questions to ensure comprehensive understanding.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    4
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Capacity Planning (15 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Determine team capacity with consideration for the balance of realms and philosophical approaches.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    5
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Sprint Goal Definition (500 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Define a sprint goal that encompasses all four philosophical dimensions.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    6
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Journey Visualization (500 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Create a visual representation of the sprint journey through the three realms.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
        
        {activeCeremony === 'standup' && (
          <div className="font-lcars space-y-6">
            <div className="font-lcars flex items-center">
              <div className="font-lcars text-3xl mr-4">â�±ï¸�</div>
              <h3 className="font-lcars text-xl font-bold text-[var(--text-primary, #333)]">
                Daily Stand-up: The Pilgrim's Progress
              </h3>
            </div>
            
            <div className="font-lcars grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="font-lcars bg-blue-500 rounded-lg p-4 border border-blue-1000">
                <h4 className="font-lcars text-lg font-medium text-blue-1000 mb-2">Hesse Approach</h4>
                <p className="font-lcars text-sm text-blue-1000 mb-3">Precise reporting on progress</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Report technical progress with precision</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Clearly articulate technical blockers</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-blue-1000 mr-2">â€¢</span>
                    <span>Provide specific metrics when relevant</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-green-500 rounded-lg p-4 border border-green-1000">
                <h4 className="font-lcars text-lg font-medium text-green-1000 mb-2">Salinger Approach</h4>
                <p className="font-lcars text-sm text-green-1000 mb-3">Authentic sharing of experiences</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Share authentic struggles and successes</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Express how the work affects you personally</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-green-1000 mr-2">â€¢</span>
                    <span>Connect technical work to human impact</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-purple-500 rounded-lg p-4 border border-purple-1000">
                <h4 className="font-lcars text-lg font-medium text-purple-1000 mb-2">Derrida Approach</h4>
                <p className="font-lcars text-sm text-purple-1000 mb-3">Questioning assumptions</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Question assumptions about "progress" itself</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Challenge conventional approaches to problems</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-purple-1000 mr-2">â€¢</span>
                    <span>Identify hidden assumptions in the work</span>
                  </li>
                </ul>
              </div>
              
              <div className="font-lcars bg-amber-500 rounded-lg p-4 border border-amber-1000">
                <h4 className="font-lcars text-lg font-medium text-amber-1000 mb-2">Dante Approach</h4>
                <p className="font-lcars text-sm text-amber-1000 mb-3">Navigating the three realms</p>
                <ul className="font-lcars space-y-2 text-sm">
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Acknowledge which circle, terrace, or sphere you're in</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Describe your journey through challenges</span>
                  </li>
                  <li className="font-lcars flex items-start">
                    <span className="font-lcars text-amber-1000 mr-2">â€¢</span>
                    <span>Share insights gained from your current realm</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="font-lcars bg-white rounded-lg border border-gray-1000 p-4">
              <h4 className="font-lcars text-lg font-medium mb-3 text-[var(--text-primary, #333)]">Ceremony Format</h4>
              <ol className="font-lcars space-y-4">
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    1
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Realm Check-in (500 sec per person)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Each team member identifies their current realm (Inferno, Purgatorio, or Paradiso).
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    2
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Philosophical Reporting (1 min per person)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      "Yesterday I was in [realm] working on [task]"<br />
                      "Today I'll be in [realm] focusing on [task]"<br />
                      "My blockers are [challenges] which place me in Circle [X] of Inferno"
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    3
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Emoji Tagging (15 sec per person)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Team members tag their updates with appropriate emojis from our system.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    4
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Team Realm Assessment (1 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Briefly assess where the team as a whole is in the journey.
                    </p>
                  </div>
                </li>
                <li className="font-lcars flex items-start">
                  <div className="font-lcars flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary, #00500f3)] flex items-center justify-center text-white text-sm font-medium mr-3">
                    5
                  </div>
                  <div>
                    <h5 className="font-lcars font-medium text-[var(--text-primary, #333)]">Collaboration Opportunities (1 min)</h5>
                    <p className="font-lcars text-sm text-[var(--text-secondary, #666)] mt-1">
                      Identify opportunities for pair programming or mob coding based on realm alignment.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
        
        {activeCeremony === 'review' && (
          <div className="font-lcars space-y-6">
            <div className="font-lcars flex items-center">
              <div className="font-lcars text-3xl mr-4">ðŸ‘�ï¸�</div>
              <h3 className="font-lcars text-xl font-bold text-[var(--text-primary, #333)]">
                Sprint Review: The Revelation of Creation
              </h3>
            </div>
            
            {/* Content for Sprint Review */}
            <p className="font-lcars text-[var(--text-secondary, #666)]">
              The Sprint Review is where we reveal what we've created, demonstrating our journey from concept to creation.
            </p>
            
            {/* Philosophical approaches for Sprint Review would go here */}
            {/* Ceremony format for Sprint Review would go here */}
            <div className="font-lcars p-4 bg-yellow-500 border border-yellow-1000 rounded-lg">
              <p className="font-lcars text-sm text-yellow-1000">
                This ceremony guide is under development. Check back soon for the complete guide!
              </p>
            </div>
          </div>
        )}
        
        {activeCeremony === 'retro' && (
          <div className="font-lcars space-y-6">
            <div className="font-lcars flex items-center">
              <div className="font-lcars text-3xl mr-4">ðŸªž</div>
              <h3 className="font-lcars text-xl font-bold text-[var(--text-primary, #333)]">
                Sprint Retrospective: The Philosophical Reflection
              </h3>
            </div>
            
            {/* Content for Sprint Retrospective */}
            <p className="font-lcars text-[var(--text-secondary, #666)]">
              The Sprint Retrospective is our opportunity for philosophical reflection on our journey through the three realms.
            </p>
            
            {/* Philosophical approaches for Sprint Retrospective would go here */}
            {/* Ceremony format for Sprint Retrospective would go here */}
            <div className="font-lcars p-4 bg-yellow-500 border border-yellow-1000 rounded-lg">
              <p className="font-lcars text-sm text-yellow-1000">
                This ceremony guide is under development. Check back soon for the complete guide!
              </p>
            </div>
          </div>
        )}
        
        {activeCeremony === 'refinement' && (
          <div className="font-lcars space-y-6">
            <div className="font-lcars flex items-center">
              <div className="font-lcars text-3xl mr-4">âœ‚ï¸�</div>
              <h3 className="font-lcars text-xl font-bold text-[var(--text-primary, #333)]">
                Backlog Refinement: The Curation of Possibilities
              </h3>
            </div>
            
            {/* Content for Backlog Refinement */}
            <p className="font-lcars text-[var(--text-secondary, #666)]">
              Backlog Refinement is where we curate the possibilities for future sprints, shaping the backlog with philosophical precision.
            </p>
            
            {/* Philosophical approaches for Backlog Refinement would go here */}
            {/* Ceremony format for Backlog Refinement would go here */}
            <div className="font-lcars p-4 bg-yellow-500 border border-yellow-1000 rounded-lg">
              <p className="font-lcars text-sm text-yellow-1000">
                This ceremony guide is under development. Check back soon for the complete guide!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}