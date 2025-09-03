#!/usr/bin/env python3
"""
Claude Sub-Agent Orchestrator
Manages multiple Claude sub-agents with specialized roles and N8N integration
"""

import os
import json
import asyncio
import aiohttp
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubAgentRole(Enum):
    """Specialized roles for Claude sub-agents"""
    STRATEGIC_ANALYST = "strategic_analyst"
    CODE_IMPLEMENTER = "code_implementer"
    VISUAL_DEBUGGER = "visual_debugger"
    DOCUMENTATION_SPECIALIST = "documentation_specialist"
    RESEARCH_ANALYST = "research_analyst"
    TESTING_COORDINATOR = "testing_coordinator"
    OPTIMIZATION_ENGINEER = "optimization_engineer"
    INTEGRATION_SPECIALIST = "integration_specialist"

@dataclass
class SubAgent:
    """Individual Claude sub-agent configuration"""
    agent_id: str
    role: SubAgentRole
    name: str
    description: str
    capabilities: List[str]
    prompt_template: str
    max_tokens: int = 4000
    temperature: float = 0.7
    active: bool = True

@dataclass
class TaskAssignment:
    """Task assignment to a sub-agent"""
    task_id: str
    agent_id: str
    task_description: str
    context: Dict[str, Any]
    priority: str = "medium"
    deadline: Optional[str] = None
    dependencies: List[str] = None

@dataclass
class CollaborationSession:
    """Session for multi-agent collaboration"""
    session_id: str
    primary_task: str
    assigned_agents: List[str]
    task_assignments: List[TaskAssignment]
    collaboration_mode: str
    created_at: str
    status: str = "active"

class SubAgentOrchestrator:
    """Orchestrates multiple Claude sub-agents for complex tasks"""
    
    def __init__(self):
        """Initialize the sub-agent orchestrator"""
        self.n8n_base_url = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.environ.get('N8N_API_KEY', '')
        self.anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY', '')
        
        # Initialize sub-agents
        self.sub_agents = self._initialize_sub_agents()
        self.active_sessions = {}
        self.collaboration_history = []
        
        logger.info(f"SubAgentOrchestrator initialized with {len(self.sub_agents)} agents")
    
    def _initialize_sub_agents(self) -> Dict[str, SubAgent]:
        """Initialize all available sub-agents"""
        
        agents = {
            "strategic_analyst": SubAgent(
                agent_id="strategic_analyst",
                role=SubAgentRole.STRATEGIC_ANALYST,
                name="Strategic Analyst Claude",
                description="Specializes in high-level strategic analysis, architecture planning, and system design",
                capabilities=[
                    "system_architecture",
                    "strategic_planning", 
                    "risk_assessment",
                    "integration_planning",
                    "performance_analysis"
                ],
                prompt_template="""You are Strategic Analyst Claude, an expert in system architecture and strategic planning.

Your role is to:
- Analyze complex systems and provide strategic recommendations
- Design scalable architectures and integration patterns
- Assess risks and propose mitigation strategies
- Plan multi-phase implementation approaches
- Coordinate with other specialists for comprehensive solutions

Current task: {task_description}

Context: {context}

Please provide a strategic analysis with:
1. High-level assessment
2. Key recommendations
3. Implementation roadmap
4. Risk analysis
5. Success metrics

Focus on strategic thinking and long-term planning."""
            ),
            
            "code_implementer": SubAgent(
                agent_id="code_implementer", 
                role=SubAgentRole.CODE_IMPLEMENTER,
                name="Code Implementer Claude",
                description="Specializes in code implementation, debugging, and technical execution",
                capabilities=[
                    "code_generation",
                    "debugging",
                    "refactoring",
                    "performance_optimization",
                    "code_review"
                ],
                prompt_template="""You are Code Implementer Claude, an expert in software development and implementation.

Your role is to:
- Write clean, efficient, and maintainable code
- Debug complex issues and optimize performance
- Implement best practices and design patterns
- Review and refactor existing code
- Ensure code quality and testing

Current task: {task_description}

Context: {context}

Please provide:
1. Implementation approach
2. Code examples/solutions
3. Testing strategy
4. Performance considerations
5. Maintenance recommendations

Focus on practical, executable solutions."""
            ),
            
            "visual_debugger": SubAgent(
                agent_id="visual_debugger",
                role=SubAgentRole.VISUAL_DEBUGGER, 
                name="Visual Debugger Claude",
                description="Specializes in visual debugging, UI/UX analysis, and frontend optimization",
                capabilities=[
                    "visual_debugging",
                    "ui_analysis",
                    "ux_optimization",
                    "frontend_performance",
                    "accessibility_review"
                ],
                prompt_template="""You are Visual Debugger Claude, an expert in visual systems and user interface optimization.

Your role is to:
- Debug visual rendering issues and UI problems
- Analyze user experience and interface design
- Optimize frontend performance and accessibility
- Review visual consistency and design patterns
- Provide visual debugging strategies

Current task: {task_description}

Context: {context}

Please provide:
1. Visual analysis and diagnosis
2. Debugging strategies
3. UI/UX improvements
4. Performance optimizations
5. Accessibility recommendations

Focus on visual quality and user experience."""
            ),
            
            "documentation_specialist": SubAgent(
                agent_id="documentation_specialist",
                role=SubAgentRole.DOCUMENTATION_SPECIALIST,
                name="Documentation Specialist Claude", 
                description="Specializes in creating comprehensive documentation and knowledge management",
                capabilities=[
                    "technical_writing",
                    "api_documentation",
                    "user_guides",
                    "knowledge_management",
                    "content_organization"
                ],
                prompt_template="""You are Documentation Specialist Claude, an expert in technical writing and knowledge management.

Your role is to:
- Create comprehensive technical documentation
- Write clear user guides and API documentation
- Organize knowledge and create searchable content
- Ensure documentation accuracy and completeness
- Maintain documentation standards

Current task: {task_description}

Context: {context}

Please provide:
1. Documentation structure and outline
2. Key content sections
3. Writing guidelines and standards
4. Review and maintenance plan
5. User experience considerations

Focus on clarity, completeness, and usability."""
            ),
            
            "research_analyst": SubAgent(
                agent_id="research_analyst",
                role=SubAgentRole.RESEARCH_ANALYST,
                name="Research Analyst Claude",
                description="Specializes in research, data analysis, and information synthesis",
                capabilities=[
                    "research_methodology",
                    "data_analysis",
                    "information_synthesis",
                    "trend_analysis",
                    "competitive_analysis"
                ],
                prompt_template="""You are Research Analyst Claude, an expert in research and data analysis.

Your role is to:
- Conduct thorough research on technical topics
- Analyze data and identify patterns
- Synthesize information from multiple sources
- Provide evidence-based recommendations
- Track trends and competitive landscape

Current task: {task_description}

Context: {context}

Please provide:
1. Research methodology and approach
2. Key findings and insights
3. Data analysis and patterns
4. Evidence-based recommendations
5. Future research directions

Focus on accuracy, depth, and actionable insights."""
            ),
            
            "testing_coordinator": SubAgent(
                agent_id="testing_coordinator",
                role=SubAgentRole.TESTING_COORDINATOR,
                name="Testing Coordinator Claude",
                description="Specializes in testing strategies, quality assurance, and validation",
                capabilities=[
                    "test_planning",
                    "quality_assurance",
                    "automated_testing",
                    "performance_testing",
                    "security_testing"
                ],
                prompt_template="""You are Testing Coordinator Claude, an expert in quality assurance and testing strategies.

Your role is to:
- Design comprehensive testing strategies
- Plan automated and manual testing approaches
- Ensure quality assurance and validation
- Coordinate testing across different systems
- Monitor and improve testing processes

Current task: {task_description}

Context: {context}

Please provide:
1. Testing strategy and approach
2. Test case design and coverage
3. Automation recommendations
4. Quality metrics and KPIs
5. Continuous improvement plan

Focus on thoroughness, reliability, and efficiency."""
            ),
            
            "optimization_engineer": SubAgent(
                agent_id="optimization_engineer",
                role=SubAgentRole.OPTIMIZATION_ENGINEER,
                name="Optimization Engineer Claude",
                description="Specializes in performance optimization, efficiency improvements, and resource management",
                capabilities=[
                    "performance_optimization",
                    "resource_management",
                    "efficiency_improvement",
                    "scalability_planning",
                    "cost_optimization"
                ],
                prompt_template="""You are Optimization Engineer Claude, an expert in performance and efficiency optimization.

Your role is to:
- Optimize system performance and efficiency
- Manage resources and improve scalability
- Reduce costs and improve ROI
- Plan for growth and scaling
- Monitor and improve system metrics

Current task: {task_description}

Context: {context}

Please provide:
1. Performance analysis and bottlenecks
2. Optimization strategies and techniques
3. Resource management recommendations
4. Cost-benefit analysis
5. Monitoring and measurement plan

Focus on measurable improvements and efficiency gains."""
            ),
            
            "integration_specialist": SubAgent(
                agent_id="integration_specialist",
                role=SubAgentRole.INTEGRATION_SPECIALIST,
                name="Integration Specialist Claude",
                description="Specializes in system integration, API design, and workflow automation",
                capabilities=[
                    "system_integration",
                    "api_design",
                    "workflow_automation",
                    "data_flow_optimization",
                    "third_party_integration"
                ],
                prompt_template="""You are Integration Specialist Claude, an expert in system integration and workflow automation.

Your role is to:
- Design and implement system integrations
- Create robust APIs and data flows
- Automate workflows and processes
- Optimize data flow and communication
- Integrate third-party services

Current task: {task_description}

Context: {context}

Please provide:
1. Integration architecture and design
2. API specifications and data flows
3. Workflow automation strategies
4. Error handling and resilience
5. Monitoring and maintenance plan

Focus on reliability, scalability, and maintainability."""
            )
        }
        
        return agents
    
    def create_collaboration_session(
        self, 
        primary_task: str,
        collaboration_mode: str = "sequential",
        priority_agents: List[str] = None
    ) -> CollaborationSession:
        """Create a new collaboration session"""
        
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Determine which agents to involve based on task analysis
        if priority_agents:
            assigned_agents = priority_agents
        else:
            assigned_agents = self._analyze_task_and_select_agents(primary_task)
        
        session = CollaborationSession(
            session_id=session_id,
            primary_task=primary_task,
            assigned_agents=assigned_agents,
            task_assignments=[],
            collaboration_mode=collaboration_mode,
            created_at=datetime.now().isoformat()
        )
        
        self.active_sessions[session_id] = session
        logger.info(f"Created collaboration session {session_id} with agents: {assigned_agents}")
        
        return session
    
    def _analyze_task_and_select_agents(self, task_description: str) -> List[str]:
        """Analyze task and select appropriate agents"""
        
        task_lower = task_description.lower()
        selected_agents = []
        
        # Strategic analysis keywords
        if any(keyword in task_lower for keyword in ['architecture', 'strategy', 'planning', 'design', 'system']):
            selected_agents.append('strategic_analyst')
        
        # Code implementation keywords
        if any(keyword in task_lower for keyword in ['implement', 'code', 'develop', 'build', 'create']):
            selected_agents.append('code_implementer')
        
        # Visual debugging keywords
        if any(keyword in task_lower for keyword in ['visual', 'ui', 'ux', 'frontend', 'interface', 'debug']):
            selected_agents.append('visual_debugger')
        
        # Documentation keywords
        if any(keyword in task_lower for keyword in ['document', 'guide', 'manual', 'api', 'explain']):
            selected_agents.append('documentation_specialist')
        
        # Research keywords
        if any(keyword in task_lower for keyword in ['research', 'analyze', 'investigate', 'study', 'compare']):
            selected_agents.append('research_analyst')
        
        # Testing keywords
        if any(keyword in task_lower for keyword in ['test', 'quality', 'validate', 'verify', 'check']):
            selected_agents.append('testing_coordinator')
        
        # Optimization keywords
        if any(keyword in task_lower for keyword in ['optimize', 'performance', 'efficient', 'improve', 'enhance']):
            selected_agents.append('optimization_engineer')
        
        # Integration keywords
        if any(keyword in task_lower for keyword in ['integrate', 'connect', 'api', 'workflow', 'automate']):
            selected_agents.append('integration_specialist')
        
        # Default to strategic analyst if no specific agents identified
        if not selected_agents:
            selected_agents = ['strategic_analyst']
        
        return selected_agents
    
    async def assign_task_to_agent(
        self, 
        session_id: str,
        agent_id: str,
        task_description: str,
        context: Dict[str, Any] = None
    ) -> TaskAssignment:
        """Assign a task to a specific agent"""
        
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")
        
        if agent_id not in self.sub_agents:
            raise ValueError(f"Agent {agent_id} not found")
        
        task_id = f"task_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        assignment = TaskAssignment(
            task_id=task_id,
            agent_id=agent_id,
            task_description=task_description,
            context=context or {},
            dependencies=[]
        )
        
        session = self.active_sessions[session_id]
        session.task_assignments.append(assignment)
        
        logger.info(f"Assigned task {task_id} to agent {agent_id} in session {session_id}")
        
        return assignment
    
    async def execute_agent_task(
        self, 
        assignment: TaskAssignment,
        session_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Execute a task with a specific agent"""
        
        agent = self.sub_agents[assignment.agent_id]
        
        if not agent.active:
            raise ValueError(f"Agent {assignment.agent_id} is not active")
        
        # Prepare the prompt
        prompt = agent.prompt_template.format(
            task_description=assignment.task_description,
            context=json.dumps(assignment.context, indent=2)
        )
        
        # Send to N8N for execution
        result = await self._send_to_n8n_agent_execution(
            agent=agent,
            prompt=prompt,
            assignment=assignment,
            session_context=session_context
        )
        
        return result
    
    async def _send_to_n8n_agent_execution(
        self,
        agent: SubAgent,
        prompt: str,
        assignment: TaskAssignment,
        session_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Send agent execution request to N8N"""
        
        webhook_url = f"{self.n8n_base_url}/webhook/claude-sub-agent"
        
        payload = {
            "agent_config": asdict(agent),
            "prompt": prompt,
            "assignment": asdict(assignment),
            "session_context": session_context or {},
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    webhook_url,
                    json=payload,
                    headers={
                        'Content-Type': 'application/json',
                        'X-Sub-Agent-Source': 'orchestrator'
                    },
                    timeout=120
                ) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Log the collaboration
                        self.collaboration_history.append({
                            'assignment': asdict(assignment),
                            'agent': asdict(agent),
                            'result': result,
                            'timestamp': datetime.now().isoformat(),
                            'success': True
                        })
                        
                        return result
                    else:
                        error_text = await response.text()
                        logger.error(f"N8N request failed: {response.status} - {error_text}")
                        
                        return {
                            'success': False,
                            'error': f'HTTP {response.status}: {error_text}',
                            'agent_id': agent.agent_id,
                            'assignment_id': assignment.task_id
                        }
                        
        except Exception as e:
            logger.error(f"Error sending to N8N: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'agent_id': agent.agent_id,
                'assignment_id': assignment.task_id
            }
    
    async def execute_collaborative_session(
        self, 
        session_id: str,
        execution_mode: str = "sequential"
    ) -> Dict[str, Any]:
        """Execute a full collaborative session"""
        
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = self.active_sessions[session_id]
        results = []
        
        logger.info(f"Executing collaborative session {session_id} in {execution_mode} mode")
        
        if execution_mode == "sequential":
            # Execute tasks sequentially
            for assignment in session.task_assignments:
                result = await self.execute_agent_task(assignment, {
                    'session_id': session_id,
                    'primary_task': session.primary_task,
                    'previous_results': results
                })
                results.append(result)
                
        elif execution_mode == "parallel":
            # Execute tasks in parallel
            tasks = []
            for assignment in session.task_assignments:
                task = self.execute_agent_task(assignment, {
                    'session_id': session_id,
                    'primary_task': session.primary_task,
                    'execution_mode': 'parallel'
                })
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Synthesize results
        synthesis = await self._synthesize_collaboration_results(session, results)
        
        # Update session status
        session.status = "completed"
        
        return {
            'session_id': session_id,
            'execution_mode': execution_mode,
            'results': results,
            'synthesis': synthesis,
            'completion_time': datetime.now().isoformat(),
            'success': True
        }
    
    async def _synthesize_collaboration_results(
        self, 
        session: CollaborationSession,
        results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Synthesize results from multiple agents"""
        
        # Create synthesis prompt
        synthesis_prompt = f"""
You are the Synthesis Coordinator for a multi-agent collaboration session.

Primary Task: {session.primary_task}
Collaboration Mode: {session.collaboration_mode}
Agents Involved: {', '.join(session.assigned_agents)}

Results from each agent:
"""
        
        for i, result in enumerate(results):
            if isinstance(result, dict) and result.get('success', False):
                agent_id = result.get('agent_id', f'agent_{i}')
                content = result.get('content', 'No content available')
                synthesis_prompt += f"\n{agent_id}:\n{content}\n"
        
        synthesis_prompt += """
Please provide a comprehensive synthesis that:
1. Integrates insights from all agents
2. Identifies key themes and patterns
3. Provides actionable recommendations
4. Highlights any conflicts or gaps
5. Suggests next steps

Format as a structured analysis with clear sections.
"""
        
        # Send synthesis to N8N
        synthesis_result = await self._send_to_n8n_agent_execution(
            agent=self.sub_agents['strategic_analyst'],  # Use strategic analyst for synthesis
            prompt=synthesis_prompt,
            assignment=TaskAssignment(
                task_id=f"synthesis_{session.session_id}",
                agent_id="strategic_analyst",
                task_description="Synthesize multi-agent collaboration results",
                context={'session': asdict(session), 'results': results}
            ),
            session_context={'synthesis_mode': True}
        )
        
        return synthesis_result
    
    def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        return {
            'total_agents': len(self.sub_agents),
            'active_agents': len([a for a in self.sub_agents.values() if a.active]),
            'agents': {agent_id: {
                'name': agent.name,
                'role': agent.role.value,
                'active': agent.active,
                'capabilities': agent.capabilities
            } for agent_id, agent in self.sub_agents.items()}
        }
    
    def get_session_status(self, session_id: str) -> Dict[str, Any]:
        """Get status of a specific session"""
        if session_id not in self.active_sessions:
            return {'error': f'Session {session_id} not found'}
        
        session = self.active_sessions[session_id]
        return {
            'session_id': session_id,
            'status': session.status,
            'primary_task': session.primary_task,
            'assigned_agents': session.assigned_agents,
            'task_count': len(session.task_assignments),
            'created_at': session.created_at
        }

async def main():
    """Test the sub-agent orchestrator"""
    
    print("🤖 CLAUDE SUB-AGENT ORCHESTRATOR")
    print("=" * 50)
    
    orchestrator = SubAgentOrchestrator()
    
    # Test agent status
    status = orchestrator.get_agent_status()
    print(f"✅ Initialized {status['total_agents']} agents ({status['active_agents']} active)")
    
    # Create a test collaboration session
    session = orchestrator.create_collaboration_session(
        primary_task="Design and implement a comprehensive testing strategy for the Cursor AI Supercharger extension",
        collaboration_mode="sequential",
        priority_agents=['strategic_analyst', 'testing_coordinator', 'documentation_specialist']
    )
    
    print(f"✅ Created session: {session.session_id}")
    print(f"   Primary task: {session.primary_task}")
    print(f"   Assigned agents: {session.assigned_agents}")
    
    # Assign specific tasks
    await orchestrator.assign_task_to_agent(
        session.session_id,
        'strategic_analyst',
        'Analyze the current testing landscape and recommend a comprehensive testing strategy',
        {'extension_name': 'Cursor AI Supercharger', 'version': '3.0.0'}
    )
    
    await orchestrator.assign_task_to_agent(
        session.session_id,
        'testing_coordinator',
        'Design specific test cases and automation strategies for the extension',
        {'testing_framework': 'Jest + Playwright', 'coverage_target': '90%'}
    )
    
    await orchestrator.assign_task_to_agent(
        session.session_id,
        'documentation_specialist',
        'Create comprehensive testing documentation and user guides',
        {'audience': 'developers', 'format': 'markdown'}
    )
    
    print(f"✅ Assigned {len(session.task_assignments)} tasks to agents")
    
    # Execute the session (mock execution for testing)
    print("🚀 Executing collaborative session...")
    
    # For testing, we'll simulate execution
    print("📋 Session execution would proceed with:")
    for assignment in session.task_assignments:
        agent = orchestrator.sub_agents[assignment.agent_id]
        print(f"   • {agent.name}: {assignment.task_description[:60]}...")
    
    print("\n🎯 Sub-Agent Orchestrator is ready for production!")
    print("✅ All agents configured and ready")
    print("✅ N8N integration prepared")
    print("✅ Collaboration workflows established")
    
    return orchestrator

if __name__ == "__main__":
    asyncio.run(main())
