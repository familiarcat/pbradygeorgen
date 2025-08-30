#!/usr/bin/env python3
"""
N8N Workflow Connector for Claude Agents
Allows Claude agents to trigger n8n workflows for business process automation
"""

import os
import json
import requests
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from dataclasses import dataclass

@dataclass
class N8NWorkflow:
    """Represents an n8n workflow"""
    id: str
    name: str
    webhook_path: str
    description: str
    category: str
    parameters: Dict[str, Any]
    expected_output: Dict[str, Any]

class N8NConnector:
    """
    Connector for Claude agents to interact with n8n workflows
    """
    
    def __init__(self, n8n_base_url: Optional[str] = None, n8n_api_key: Optional[str] = None):
        """
        Initialize the n8n connector
        
        Args:
            n8n_base_url: n8n instance base URL
            n8n_api_key: n8n API key for authentication
        """
        self.n8n_base_url = n8n_base_url or os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = n8n_api_key or os.getenv('N8N_API_KEY')
        
        # Setup logging
        self.logger = logging.getLogger("N8NConnector")
        
        # Available workflows registry
        self.workflow_registry = self._initialize_workflow_registry()
        
        # Session for HTTP requests
        self.session = requests.Session()
        if self.n8n_api_key:
            self.session.headers.update({
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            })
    
    def _initialize_workflow_registry(self) -> Dict[str, N8NWorkflow]:
        """Initialize the registry of available n8n workflows"""
        return {
            "mission_planning": N8NWorkflow(
                id="mission_planning_workflow",
                name="Mission Planning Workflow",
                webhook_path="mission-planning",
                description="Automates mission planning processes including resource allocation and timeline creation",
                category="mission_management",
                parameters={
                    "mission_objectives": "List of mission objectives",
                    "available_resources": "Available crew and resources",
                    "timeline_constraints": "Time constraints for the mission"
                },
                expected_output={
                    "mission_plan": "Detailed mission plan",
                    "resource_allocation": "Resource allocation plan",
                    "timeline": "Mission timeline",
                    "risk_assessment": "Risk assessment report"
                }
            ),
            "crew_coordination": N8NWorkflow(
                id="crew_coordination_workflow",
                name="Crew Coordination Workflow",
                webhook_path="crew-coordination",
                description="Manages crew assignments, communication, and progress tracking",
                category="crew_management",
                parameters={
                    "crew_members": "List of available crew members",
                    "mission_tasks": "Tasks that need to be completed",
                    "coordination_requirements": "Specific coordination needs"
                },
                expected_output={
                    "crew_assignments": "Crew task assignments",
                    "communication_plan": "Communication strategy",
                    "progress_tracking": "Progress tracking setup"
                }
            ),
            "data_analysis": N8NWorkflow(
                id="data_analysis_workflow",
                name="Data Analysis Workflow",
                webhook_path="data-analysis",
                description="Processes and analyzes data for insights and decision-making",
                category="analytics",
                parameters={
                    "data_source": "Source of data to analyze",
                    "analysis_type": "Type of analysis required",
                    "output_format": "Desired output format"
                },
                expected_output={
                    "analysis_results": "Analysis results and insights",
                    "visualizations": "Data visualizations",
                    "recommendations": "Actionable recommendations"
                }
            ),
            "business_process": N8NWorkflow(
                id="business_process_workflow",
                name="Business Process Workflow",
                webhook_path="business-process",
                description="Automates business processes like approvals, notifications, and reporting",
                category="business_automation",
                parameters={
                    "process_type": "Type of business process",
                    "process_data": "Data required for the process",
                    "approval_chain": "Required approvals and workflow"
                },
                expected_output={
                    "process_status": "Current process status",
                    "next_steps": "Next steps in the process",
                    "completion_estimate": "Estimated completion time"
                }
            ),
            "security_compliance": N8NWorkflow(
                id="security_compliance_workflow",
                name="Security & Compliance Workflow",
                webhook_path="security-compliance",
                description="Handles security checks, compliance verification, and risk assessments",
                category="security",
                parameters={
                    "security_requirements": "Security requirements to check",
                    "compliance_standards": "Compliance standards to verify",
                    "risk_factors": "Risk factors to assess"
                },
                expected_output={
                    "security_status": "Security compliance status",
                    "risk_assessment": "Risk assessment report",
                    "compliance_report": "Compliance verification report"
                }
            )
        }
    
    def get_available_workflows(self) -> List[N8NWorkflow]:
        """Get list of available n8n workflows"""
        return list(self.workflow_registry.values())
    
    def get_workflow_by_category(self, category: str) -> List[N8NWorkflow]:
        """Get workflows by category"""
        return [wf for wf in self.workflow_registry.values() if wf.category == category]
    
    def get_workflow_by_name(self, name: str) -> Optional[N8NWorkflow]:
        """Get a specific workflow by name"""
        for workflow in self.workflow_registry.values():
            if workflow.name.lower() == name.lower():
                return workflow
        return None
    
    def can_workflow_handle_task(self, workflow: N8NWorkflow, task_description: str) -> bool:
        """
        Check if a workflow can handle a specific task
        
        Args:
            workflow: The workflow to check
            task_description: Description of the task
            
        Returns:
            True if the workflow can handle the task
        """
        task_lower = task_description.lower()
        workflow_lower = f"{workflow.name} {workflow.description}".lower()
        
        # Check if task keywords match workflow capabilities
        task_keywords = task_lower.split()
        workflow_keywords = workflow_lower.split()
        
        # Simple keyword matching - could be enhanced with NLP
        matches = sum(1 for tk in task_keywords if tk in workflow_keywords)
        return matches >= 2  # At least 2 keywords should match
    
    def recommend_workflow(self, task_description: str) -> Optional[N8NWorkflow]:
        """
        Recommend the best workflow for a given task
        
        Args:
            task_description: Description of the task
            
        Returns:
            Recommended workflow or None if no suitable workflow found
        """
        best_match = None
        best_score = 0
        
        for workflow in self.workflow_registry.values():
            if self.can_workflow_handle_task(workflow, task_description):
                # Calculate a simple relevance score
                task_lower = task_description.lower()
                workflow_text = f"{workflow.name} {workflow.description}".lower()
                
                # Count matching words
                task_words = set(task_lower.split())
                workflow_words = set(workflow_text.split())
                matches = len(task_words.intersection(workflow_words))
                
                if matches > best_score:
                    best_score = matches
                    best_match = workflow
        
        return best_match
    
    def trigger_workflow(self, workflow: N8NWorkflow, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger an n8n workflow with the given parameters
        
        Args:
            workflow: The workflow to trigger
            parameters: Parameters to pass to the workflow
            
        Returns:
            Workflow execution result
        """
        try:
            # Prepare the webhook URL
            webhook_url = f"{self.n8n_base_url}/webhook/{workflow.webhook_path}"
            
            # Prepare the payload
            payload = {
                "workflow_id": workflow.id,
                "workflow_name": workflow.name,
                "parameters": parameters,
                "triggered_by": "claude_agent",
                "timestamp": datetime.now().isoformat()
            }
            
            self.logger.info(f"Triggering workflow: {workflow.name}")
            self.logger.info(f"Webhook URL: {webhook_url}")
            self.logger.info(f"Parameters: {json.dumps(parameters, indent=2)}")
            
            # Make the request
            response = self.session.post(
                webhook_url,
                json=payload,
                timeout=30
            )
            
            # Process the response
            if response.status_code == 200:
                try:
                    result = response.json()
                    execution_result = {
                        "status": "success",
                        "workflow": workflow.name,
                        "execution_id": result.get("execution_id", "unknown"),
                        "result": result,
                        "timestamp": datetime.now().isoformat()
                    }
                except json.JSONDecodeError:
                    # Handle non-JSON responses
                    execution_result = {
                        "status": "success",
                        "workflow": workflow.name,
                        "execution_id": "unknown",
                        "result": {"raw_response": response.text},
                        "timestamp": datetime.now().isoformat()
                    }
            else:
                execution_result = {
                    "status": "error",
                    "workflow": workflow.name,
                    "error_code": response.status_code,
                    "error_message": response.text,
                    "timestamp": datetime.now().isoformat()
                }
            
            self.logger.info(f"Workflow execution result: {execution_result['status']}")
            return execution_result
            
        except Exception as e:
            self.logger.error(f"Error triggering workflow {workflow.name}: {e}")
            return {
                "status": "error",
                "workflow": workflow.name,
                "error_message": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def execute_task_with_workflow(self, task_description: str, task_parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a task using the most appropriate n8n workflow
        
        Args:
            task_description: Description of the task to execute
            task_parameters: Parameters for the task
            
        Returns:
            Execution result including workflow recommendation and execution
        """
        # Find the best workflow for the task
        recommended_workflow = self.recommend_workflow(task_description)
        
        if not recommended_workflow:
            return {
                "status": "no_workflow_found",
                "task": task_description,
                "message": "No suitable n8n workflow found for this task",
                "timestamp": datetime.now().isoformat()
            }
        
        # Execute the workflow
        execution_result = self.trigger_workflow(recommended_workflow, task_parameters)
        
        # Combine recommendation and execution results
        result = {
            "task": task_description,
            "recommended_workflow": {
                "name": recommended_workflow.name,
                "description": recommended_workflow.description,
                "category": recommended_workflow.category
            },
            "execution": execution_result,
            "timestamp": datetime.now().isoformat()
        }
        
        return result
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """
        Get the status of a specific workflow
        
        Args:
            workflow_id: ID of the workflow to check
            
        Returns:
            Workflow status information
        """
        try:
            # This would typically call the n8n API to get workflow status
            # For now, return a mock status
            return {
                "workflow_id": workflow_id,
                "status": "active",
                "last_execution": datetime.now().isoformat(),
                "execution_count": 0,
                "success_rate": 1.0
            }
        except Exception as e:
            self.logger.error(f"Error getting workflow status: {e}")
            return {
                "workflow_id": workflow_id,
                "status": "unknown",
                "error": str(e)
            }
    
    def test_connection(self) -> bool:
        """Test connection to the n8n instance"""
        try:
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            return response.status_code == 200
        except Exception as e:
            self.logger.error(f"Connection test failed: {e}")
            return False
    
    def get_connection_status(self) -> Dict[str, Any]:
        """Get detailed connection status"""
        is_connected = self.test_connection()
        
        return {
            "n8n_base_url": self.n8n_base_url,
            "connected": is_connected,
            "api_key_configured": bool(self.n8n_api_key),
            "available_workflows": len(self.workflow_registry),
            "last_check": datetime.now().isoformat()
        }
