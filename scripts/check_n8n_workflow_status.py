#!/usr/bin/env python3
"""
n8n Workflow Status Checker
Checks the status of all n8n workflows and identifies activation issues
"""

import os
import requests
import json
from datetime import datetime
from typing import Dict, List, Any

class N8NWorkflowChecker:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.session = requests.Session()
        
        if self.n8n_api_key:
            self.session.headers.update({
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            })
    
    def get_all_workflows(self) -> List[Dict[str, Any]]:
        """Get all workflows from n8n"""
        try:
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                data = response.json()
                # Handle both response formats
                workflows = data.get('data', []) if isinstance(data, dict) else data
                return workflows
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []
    
    def check_webhook_status(self, webhook_path: str) -> Dict[str, Any]:
        """Test a webhook endpoint to see if it's active"""
        try:
            test_payload = {
                "test": "workflow_status_check",
                "timestamp": datetime.now().isoformat()
            }
            
            response = self.session.post(
                f"{self.n8n_base_url}/webhook/{webhook_path}",
                json=test_payload,
                timeout=10
            )
            
            return {
                "path": webhook_path,
                "status_code": response.status_code,
                "active": response.status_code in [200, 201],
                "response": response.text[:200] if response.text else "No response body",
                "error": None
            }
        except Exception as e:
            return {
                "path": webhook_path,
                "status_code": None,
                "active": False,
                "response": None,
                "error": str(e)
            }
    
    def analyze_workflow_status(self) -> Dict[str, Any]:
        """Analyze the status of all workflows"""
        print("🔍 Checking n8n Workflow Status")
        print("=" * 50)
        
        workflows = self.get_all_workflows()
        if not workflows:
            return {"error": "No workflows found"}
        
        print(f"📋 Found {len(workflows)} workflows")
        print()
        
        workflow_analysis = {
            "total_workflows": len(workflows),
            "active_webhooks": 0,
            "inactive_webhooks": 0,
            "error_webhooks": 0,
            "workflow_details": [],
            "recommendations": []
        }
        
        # Known webhook paths from our standardized workflows
        expected_webhooks = [
            "crew-captain-jean-luc-picard",
            "crew-commander-william-riker", 
            "crew-commander-data",
            "crew-lieutenant-worf",
            "crew-lieutenant-commander-geordi-la-forge",
            "crew-counselor-deanna-troi",
            "crew-lieutenant-uhura",
            "crew-dr-beverly-crusher",
            "crew-quark",
            "alexai-crew-mission"
        ]
        
        print("🧪 Testing Expected Webhook Endpoints")
        print("-" * 40)
        
        for webhook_path in expected_webhooks:
            status = self.check_webhook_status(webhook_path)
            workflow_analysis["workflow_details"].append(status)
            
            if status["active"]:
                workflow_analysis["active_webhooks"] += 1
                print(f"✅ {webhook_path}: Active (Status {status['status_code']})")
            elif status["error"]:
                workflow_analysis["error_webhooks"] += 1
                print(f"💥 {webhook_path}: Error - {status['error']}")
            else:
                workflow_analysis["inactive_webhooks"] += 1
                print(f"❌ {webhook_path}: Inactive (Status {status['status_code']})")
        
        print()
        print("📊 Summary")
        print("-" * 20)
        print(f"✅ Active Webhooks: {workflow_analysis['active_webhooks']}")
        print(f"❌ Inactive Webhooks: {workflow_analysis['inactive_webhooks']}")
        print(f"💥 Error Webhooks: {workflow_analysis['error_webhooks']}")
        print(f"📋 Total Expected: {len(expected_webhooks)}")
        
        # Generate recommendations
        if workflow_analysis["inactive_webhooks"] > 0:
            workflow_analysis["recommendations"].append(
                f"Activate {workflow_analysis['inactive_webhooks']} inactive workflows in n8n UI"
            )
        
        if workflow_analysis["error_webhooks"] > 0:
            workflow_analysis["recommendations"].append(
                f"Investigate {workflow_analysis['error_webhooks']} workflows with errors"
            )
        
        if workflow_analysis["active_webhooks"] == len(expected_webhooks):
            workflow_analysis["recommendations"].append("All workflows are active and ready for Claude integration")
        
        print()
        print("💡 Recommendations")
        print("-" * 20)
        for rec in workflow_analysis["recommendations"]:
            print(f"• {rec}")
        
        return workflow_analysis
    
    def generate_activation_guide(self, analysis: Dict[str, Any]) -> str:
        """Generate a guide for activating workflows"""
        guide = """
# n8n Workflow Activation Guide

## Current Status
- Total Expected Workflows: {total}
- Active Webhooks: {active}
- Inactive Webhooks: {inactive}
- Error Webhooks: {error}

## Steps to Activate Workflows

1. **Access n8n Interface**
   - Go to: {base_url}
   - Login with your credentials

2. **Navigate to Workflows**
   - Click "Workflows" in the left sidebar
   - Look for workflows with these names:
""".format(
            total=analysis["total_workflows"],
            active=analysis["active_webhooks"],
            inactive=analysis["inactive_webhooks"],
            error=analysis["error_webhooks"],
            base_url=self.n8n_base_url
        )
        
        for detail in analysis["workflow_details"]:
            if not detail["active"]:
                guide += f"   - {detail['path']}\n"
        
        guide += """
3. **Activate Each Workflow**
   - Click on the workflow name
   - Look for the toggle switch in the top-right corner
   - Click to activate (should turn green)
   - Save the workflow

4. **Verify Activation**
   - Run this script again to confirm all webhooks are active
   - Test individual webhook endpoints

## Expected Webhook Paths
"""
        
        for detail in analysis["workflow_details"]:
            status_icon = "✅" if detail["active"] else "❌"
            guide += f"- {status_icon} {detail['path']}\n"
        
        return guide

def main():
    checker = N8NWorkflowChecker()
    analysis = checker.analyze_workflow_status()
    
    if "error" not in analysis:
        # Save analysis to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        analysis_file = f"n8n_workflow_status_{timestamp}.json"
        
        with open(analysis_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n📁 Analysis saved to: {analysis_file}")
        
        # Generate and save activation guide
        guide = checker.generate_activation_guide(analysis)
        guide_file = f"n8n_activation_guide_{timestamp}.md"
        
        with open(guide_file, 'w') as f:
            f.write(guide)
        
        print(f"📖 Activation guide saved to: {guide_file}")
    
    return analysis

if __name__ == "__main__":
    main()
