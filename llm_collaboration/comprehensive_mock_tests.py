#!/usr/bin/env python3
"""
Comprehensive Mock Tests for Claude Sub-Agents and N8N Integration
Tests the complete system with realistic scenarios and validation
"""

import json
import asyncio
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MockTestSuite:
    """Comprehensive mock test suite for the sub-agent system"""
    
    def __init__(self):
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "test_suite": "Comprehensive Mock Tests",
            "results": {}
        }
        self.workspace_root = Path.cwd()
        
    def log_test_result(self, test_name: str, status: str, details: str = ""):
        """Log test result"""
        self.test_results["results"][test_name] = {
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
    
    def test_sub_agent_orchestrator_initialization(self):
        """Test sub-agent orchestrator initialization"""
        test_name = "sub_agent_orchestrator_initialization"
        try:
            # Import the orchestrator
            from sub_agent_orchestrator import SubAgentOrchestrator
            
            # Initialize orchestrator
            orchestrator = SubAgentOrchestrator()
            
            # Check agent count
            agent_status = orchestrator.get_agent_status()
            expected_agents = 8  # We have 8 specialized agents
            
            if agent_status['total_agents'] != expected_agents:
                self.log_test_result(test_name, "FAIL", f"Expected {expected_agents} agents, got {agent_status['total_agents']}")
                return False
            
            if agent_status['active_agents'] != expected_agents:
                self.log_test_result(test_name, "FAIL", f"Expected {expected_agents} active agents, got {agent_status['active_agents']}")
                return False
            
            # Check specific agents exist
            required_agents = [
                'strategic_analyst', 'code_implementer', 'visual_debugger',
                'documentation_specialist', 'research_analyst', 'testing_coordinator',
                'optimization_engineer', 'integration_specialist'
            ]
            
            for agent_id in required_agents:
                if agent_id not in orchestrator.sub_agents:
                    self.log_test_result(test_name, "FAIL", f"Required agent {agent_id} not found")
                    return False
            
            self.log_test_result(test_name, "PASS", f"All {expected_agents} agents initialized correctly")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_agent_capabilities_and_roles(self):
        """Test agent capabilities and role assignments"""
        test_name = "agent_capabilities_and_roles"
        try:
            from sub_agent_orchestrator import SubAgentOrchestrator
            
            orchestrator = SubAgentOrchestrator()
            
            # Test each agent's capabilities
            capability_tests = {
                'strategic_analyst': ['system_architecture', 'strategic_planning', 'risk_assessment'],
                'code_implementer': ['code_generation', 'debugging', 'refactoring'],
                'visual_debugger': ['visual_debugging', 'ui_analysis', 'ux_optimization'],
                'documentation_specialist': ['technical_writing', 'api_documentation', 'user_guides'],
                'research_analyst': ['research_methodology', 'data_analysis', 'information_synthesis'],
                'testing_coordinator': ['test_planning', 'quality_assurance', 'automated_testing'],
                'optimization_engineer': ['performance_optimization', 'resource_management', 'efficiency_improvement'],
                'integration_specialist': ['system_integration', 'api_design', 'workflow_automation']
            }
            
            for agent_id, expected_capabilities in capability_tests.items():
                agent = orchestrator.sub_agents[agent_id]
                
                for capability in expected_capabilities:
                    if capability not in agent.capabilities:
                        self.log_test_result(test_name, "FAIL", f"Agent {agent_id} missing capability: {capability}")
                        return False
            
            # Test prompt templates
            for agent_id, agent in orchestrator.sub_agents.items():
                if not agent.prompt_template or len(agent.prompt_template) < 100:
                    self.log_test_result(test_name, "FAIL", f"Agent {agent_id} has insufficient prompt template")
                    return False
                
                if '{task_description}' not in agent.prompt_template or '{context}' not in agent.prompt_template:
                    self.log_test_result(test_name, "FAIL", f"Agent {agent_id} prompt template missing required placeholders")
                    return False
            
            self.log_test_result(test_name, "PASS", "All agents have proper capabilities and prompt templates")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_collaboration_session_creation(self):
        """Test collaboration session creation and management"""
        test_name = "collaboration_session_creation"
        try:
            from sub_agent_orchestrator import SubAgentOrchestrator
            
            orchestrator = SubAgentOrchestrator()
            
            # Test automatic agent selection
            test_tasks = [
                {
                    'task': 'Design a comprehensive testing strategy for the Cursor AI extension',
                    'expected_agents': ['strategic_analyst', 'testing_coordinator']
                },
                {
                    'task': 'Implement a React component with TypeScript and optimize its performance',
                    'expected_agents': ['code_implementer', 'optimization_engineer']
                },
                {
                    'task': 'Research and analyze the latest trends in AI development tools',
                    'expected_agents': ['research_analyst']
                },
                {
                    'task': 'Create API documentation and user guides for the new system',
                    'expected_agents': ['documentation_specialist']
                }
            ]
            
            for test_case in test_tasks:
                session = orchestrator.create_collaboration_session(
                    primary_task=test_case['task'],
                    collaboration_mode="sequential"
                )
                
                if not session.session_id:
                    self.log_test_result(test_name, "FAIL", f"Session creation failed for task: {test_case['task']}")
                    return False
                
                if not session.assigned_agents:
                    self.log_test_result(test_name, "FAIL", f"No agents assigned for task: {test_case['task']}")
                    return False
                
                # Check if expected agents are included
                for expected_agent in test_case['expected_agents']:
                    if expected_agent not in session.assigned_agents:
                        self.log_test_result(test_name, "WARN", f"Expected agent {expected_agent} not selected for task: {test_case['task']}")
            
            # Test manual agent selection
            manual_session = orchestrator.create_collaboration_session(
                primary_task="Test manual agent selection",
                collaboration_mode="parallel",
                priority_agents=['strategic_analyst', 'code_implementer', 'testing_coordinator']
            )
            
            if set(manual_session.assigned_agents) != {'strategic_analyst', 'code_implementer', 'testing_coordinator'}:
                self.log_test_result(test_name, "FAIL", "Manual agent selection not working correctly")
                return False
            
            self.log_test_result(test_name, "PASS", "Collaboration session creation working correctly")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_task_assignment_and_execution(self):
        """Test task assignment and execution workflow"""
        test_name = "task_assignment_and_execution"
        try:
            from sub_agent_orchestrator import SubAgentOrchestrator, TaskAssignment
            
            orchestrator = SubAgentOrchestrator()
            
            # Create a test session
            session = orchestrator.create_collaboration_session(
                primary_task="Test task assignment system",
                priority_agents=['strategic_analyst', 'code_implementer']
            )
            
            # Test task assignment
            assignment1 = asyncio.run(orchestrator.assign_task_to_agent(
                session.session_id,
                'strategic_analyst',
                'Analyze the system architecture and provide strategic recommendations',
                {'system_type': 'AI extension', 'complexity': 'high'}
            ))
            
            if not assignment1.task_id or assignment1.agent_id != 'strategic_analyst':
                self.log_test_result(test_name, "FAIL", "Task assignment failed")
                return False
            
            assignment2 = asyncio.run(orchestrator.assign_task_to_agent(
                session.session_id,
                'code_implementer',
                'Implement the recommended architecture changes',
                {'implementation_language': 'TypeScript', 'framework': 'React'}
            ))
            
            if not assignment2.task_id or assignment2.agent_id != 'code_implementer':
                self.log_test_result(test_name, "FAIL", "Second task assignment failed")
                return False
            
            # Test session status
            session_status = orchestrator.get_session_status(session.session_id)
            if session_status['task_count'] != 2:
                self.log_test_result(test_name, "FAIL", f"Expected 2 tasks, got {session_status['task_count']}")
                return False
            
            self.log_test_result(test_name, "PASS", "Task assignment and management working correctly")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_n8n_workflow_validation(self):
        """Test N8N workflow structure and configuration"""
        test_name = "n8n_workflow_validation"
        try:
            # Test main collaboration workflow
            main_workflow_path = self.workspace_root / "llm_collaboration" / "n8n_workflow_llm_collaboration.json"
            if not main_workflow_path.exists():
                self.log_test_result(test_name, "FAIL", "Main N8N workflow file not found")
                return False
            
            with open(main_workflow_path, 'r') as f:
                main_workflow = json.load(f)
            
            # Validate main workflow structure
            required_nodes = ['Webhook Trigger', 'Democratic LLM Router', 'Model Router', 'Response Aggregator']
            node_names = [node['name'] for node in main_workflow.get('nodes', [])]
            
            for required_node in required_nodes:
                if required_node not in node_names:
                    self.log_test_result(test_name, "FAIL", f"Required node {required_node} not found in main workflow")
                    return False
            
            # Test sub-agent workflow
            sub_agent_workflow_path = self.workspace_root / "llm_collaboration" / "n8n_sub_agent_workflow.json"
            if not sub_agent_workflow_path.exists():
                self.log_test_result(test_name, "FAIL", "Sub-agent N8N workflow file not found")
                return False
            
            with open(sub_agent_workflow_path, 'r') as f:
                sub_agent_workflow = json.load(f)
            
            # Validate sub-agent workflow structure
            required_sub_nodes = ['Sub-Agent Webhook', 'Prepare Claude Request', 'Claude API Call', 'Process Response']
            sub_node_names = [node['name'] for node in sub_agent_workflow.get('nodes', [])]
            
            for required_node in required_sub_nodes:
                if required_node not in sub_node_names:
                    self.log_test_result(test_name, "FAIL", f"Required node {required_node} not found in sub-agent workflow")
                    return False
            
            # Test workflow connections
            main_connections = main_workflow.get('connections', {})
            sub_connections = sub_agent_workflow.get('connections', {})
            
            if not main_connections or not sub_connections:
                self.log_test_result(test_name, "FAIL", "Workflow connections not properly configured")
                return False
            
            self.log_test_result(test_name, "PASS", "Both N8N workflows properly structured and configured")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_unified_query_structure(self):
        """Test unified query structure and LLM routing"""
        test_name = "unified_query_structure"
        try:
            from unified_query_structure import UnifiedLLMCollaborationSystem, CollaborationMode
            
            system = UnifiedLLMCollaborationSystem()
            
            # Test query creation
            test_query = system.create_unified_query(
                task_description="Test the unified query system with a complex multi-step task",
                task_type="system_integration",
                complexity="high",
                requesting_llm="claude",
                collaboration_mode=CollaborationMode.SEQUENTIAL_HANDOFF
            )
            
            # Validate query structure
            required_fields = ['collaboration_id', 'session_id', 'task', 'collaboration_context', 'llm_routing']
            for field in required_fields:
                if field not in test_query.to_dict():
                    self.log_test_result(test_name, "FAIL", f"Required field {field} missing from query")
                    return False
            
            # Test LLM routing
            routing = test_query.llm_routing
            if 'primary' not in routing or 'routing_strategy' not in routing:
                self.log_test_result(test_name, "FAIL", "LLM routing structure incomplete")
                return False
            
            # Test available models
            if len(system.available_models) < 3:
                self.log_test_result(test_name, "FAIL", f"Expected at least 3 models, got {len(system.available_models)}")
                return False
            
            # Test cost estimation
            primary_model = system.available_models[routing['primary']['name'].lower().replace('-', '').replace(' ', '')]
            if not primary_model:
                # Try alternative lookup
                for model_id, model in system.available_models.items():
                    if model.name.lower() in routing['primary']['name'].lower():
                        primary_model = model
                        break
            
            if primary_model:
                estimated_cost = system.estimate_cost(primary_model, test_query.task)
                if estimated_cost <= 0:
                    self.log_test_result(test_name, "FAIL", "Cost estimation not working")
                    return False
            
            self.log_test_result(test_name, "PASS", "Unified query structure and routing working correctly")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_environment_configuration(self):
        """Test environment configuration and API keys"""
        test_name = "environment_configuration"
        try:
            # Check required environment variables
            required_env_vars = [
                'N8N_BASE_URL',
                'N8N_API_KEY', 
                'ANTHROPIC_API_KEY',
                'OPENROUTER_API_KEY'
            ]
            
            missing_vars = []
            for var in required_env_vars:
                if not os.environ.get(var):
                    missing_vars.append(var)
            
            if missing_vars:
                self.log_test_result(test_name, "WARN", f"Missing environment variables: {', '.join(missing_vars)}")
                return False
            
            # Test N8N URL format
            n8n_url = os.environ.get('N8N_BASE_URL')
            if not n8n_url.startswith('https://'):
                self.log_test_result(test_name, "FAIL", "N8N_BASE_URL should use HTTPS")
                return False
            
            # Test API key formats
            anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
            if not anthropic_key.startswith('sk-ant-'):
                self.log_test_result(test_name, "WARN", "ANTHROPIC_API_KEY format may be incorrect")
            
            openrouter_key = os.environ.get('OPENROUTER_API_KEY')
            if not openrouter_key.startswith('sk-or-'):
                self.log_test_result(test_name, "WARN", "OPENROUTER_API_KEY format may be incorrect")
            
            self.log_test_result(test_name, "PASS", "Environment configuration validated")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_mock_collaboration_scenarios(self):
        """Test realistic collaboration scenarios with mock data"""
        test_name = "mock_collaboration_scenarios"
        try:
            from sub_agent_orchestrator import SubAgentOrchestrator
            
            orchestrator = SubAgentOrchestrator()
            
            # Scenario 1: Extension Development
            extension_session = orchestrator.create_collaboration_session(
                primary_task="Develop a comprehensive Cursor AI extension with multi-LLM support",
                collaboration_mode="sequential",
                priority_agents=['strategic_analyst', 'code_implementer', 'testing_coordinator', 'documentation_specialist']
            )
            
            # Assign tasks for extension development
            tasks = [
                ('strategic_analyst', 'Design the extension architecture and integration strategy'),
                ('code_implementer', 'Implement the core extension functionality and LLM integration'),
                ('testing_coordinator', 'Create comprehensive test suite and quality assurance plan'),
                ('documentation_specialist', 'Write user documentation and API reference')
            ]
            
            for agent_id, task_desc in tasks:
                asyncio.run(orchestrator.assign_task_to_agent(
                    extension_session.session_id,
                    agent_id,
                    task_desc,
                    {'project': 'Cursor AI Extension', 'version': '3.0.0'}
                ))
            
            # Scenario 2: Performance Optimization
            optimization_session = orchestrator.create_collaboration_session(
                primary_task="Optimize the N8N workflow performance and reduce API costs",
                collaboration_mode="parallel",
                priority_agents=['optimization_engineer', 'research_analyst', 'integration_specialist']
            )
            
            # Scenario 3: Research and Analysis
            research_session = orchestrator.create_collaboration_session(
                primary_task="Research latest AI development trends and competitive analysis",
                collaboration_mode="sequential",
                priority_agents=['research_analyst', 'strategic_analyst']
            )
            
            # Validate sessions
            sessions = [extension_session, optimization_session, research_session]
            for session in sessions:
                if not session.session_id or not session.assigned_agents:
                    self.log_test_result(test_name, "FAIL", f"Session creation failed: {session.session_id}")
                    return False
            
            # Test session status retrieval
            for session in sessions:
                status = orchestrator.get_session_status(session.session_id)
                if status.get('error'):
                    self.log_test_result(test_name, "FAIL", f"Session status error: {status['error']}")
                    return False
            
            self.log_test_result(test_name, "PASS", f"All {len(sessions)} collaboration scenarios created successfully")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_integration_readiness(self):
        """Test overall system integration readiness"""
        test_name = "integration_readiness"
        try:
            # Test all components are available
            components = {
                'sub_agent_orchestrator': 'llm_collaboration/sub_agent_orchestrator.py',
                'unified_query_structure': 'llm_collaboration/unified_query_structure.py',
                'main_n8n_workflow': 'llm_collaboration/n8n_workflow_llm_collaboration.json',
                'sub_agent_n8n_workflow': 'llm_collaboration/n8n_sub_agent_workflow.json',
                'test_communication': 'llm_collaboration/test_claude_cursor_communication.py'
            }
            
            missing_components = []
            for component_name, file_path in components.items():
                if not (self.workspace_root / file_path).exists():
                    missing_components.append(component_name)
            
            if missing_components:
                self.log_test_result(test_name, "FAIL", f"Missing components: {', '.join(missing_components)}")
                return False
            
            # Test import capabilities
            try:
                from sub_agent_orchestrator import SubAgentOrchestrator
                from unified_query_structure import UnifiedLLMCollaborationSystem
                orchestrator = SubAgentOrchestrator()
                query_system = UnifiedLLMCollaborationSystem()
            except Exception as e:
                self.log_test_result(test_name, "FAIL", f"Import error: {str(e)}")
                return False
            
            # Test basic functionality
            agent_status = orchestrator.get_agent_status()
            if agent_status['total_agents'] == 0:
                self.log_test_result(test_name, "FAIL", "No agents available")
                return False
            
            # Test query system
            test_query = query_system.create_unified_query("Test query", "general", "medium")
            if not test_query.collaboration_id:
                self.log_test_result(test_name, "FAIL", "Query creation failed")
                return False
            
            self.log_test_result(test_name, "PASS", "All components ready for integration")
            return True
            
        except Exception as e:
            self.log_test_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 70)
        print("📊 COMPREHENSIVE MOCK TEST REPORT")
        print("=" * 70)
        
        total_tests = len(self.test_results["results"])
        passed_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "PASS")
        failed_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "FAIL")
        warning_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "WARN")
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Warnings: {warning_tests}")
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Component status
        print(f"\n🔧 COMPONENT STATUS:")
        components = [
            "Sub-Agent Orchestrator",
            "Agent Capabilities & Roles",
            "Collaboration Sessions",
            "Task Assignment & Execution",
            "N8N Workflow Validation",
            "Unified Query Structure",
            "Environment Configuration",
            "Mock Collaboration Scenarios",
            "Integration Readiness"
        ]
        
        for i, component in enumerate(components):
            if i < len(self.test_results["results"]):
                status = list(self.test_results["results"].values())[i]["status"]
                icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
                print(f"  {icon} {component}: {status}")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if success_rate >= 90:
            print("🎉 System is production ready!")
            print("✅ All major components are functional")
            print("🚀 Ready for live deployment and testing")
        elif success_rate >= 75:
            print("⚡ System is nearly ready with minor issues")
            print("🔧 Address failed tests before production deployment")
            print("📋 Review warnings for optimization opportunities")
        else:
            print("❌ System needs significant work")
            print("🔧 Multiple components require attention")
            print("📋 Review all failed tests and fix critical issues")
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"comprehensive_mock_test_report_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"\n📄 Test results saved to: {filename}")
    
    def run_all_tests(self):
        """Run all comprehensive mock tests"""
        print("🧪 COMPREHENSIVE MOCK TEST SUITE")
        print("=" * 70)
        print("🎯 Testing Claude Sub-Agents, N8N Integration, and Complete System")
        print("")
        
        # Run all tests
        self.test_sub_agent_orchestrator_initialization()
        self.test_agent_capabilities_and_roles()
        self.test_collaboration_session_creation()
        self.test_task_assignment_and_execution()
        self.test_n8n_workflow_validation()
        self.test_unified_query_structure()
        self.test_environment_configuration()
        self.test_mock_collaboration_scenarios()
        self.test_integration_readiness()
        
        # Generate report
        self.generate_test_report()

def main():
    """Main execution function"""
    try:
        test_suite = MockTestSuite()
        test_suite.run_all_tests()
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")

if __name__ == "__main__":
    main()
