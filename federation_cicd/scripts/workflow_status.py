#!/usr/bin/env python3
# 📊 Federation Workflow Status Script
# Shows status of all federation workflows on n8n

import sys
import os
# Add the current working directory to the path to import the main system
sys.path.append(os.getcwd())

from federation_cicd_automation_system import FederationCICDAutomationSystem

def main():
    print("📊 FEDERATION WORKFLOW STATUS")
    print("=" * 50)
    
    # Initialize CI/CD system
    cicd_system = FederationCICDAutomationSystem()
    
    # Get workflow status
    status = cicd_system.workflow_manager.get_all_workflow_status()
    
    print("\nFederation Workflow Status on n8n.pbradygeorgen.com:")
    print("-" * 60)
    
    for workflow_name, workflow_status in status.items():
        status_emoji = "✅" if workflow_status.get('active') else "❌"
        print(f"{status_emoji} {workflow_name}: {workflow_status.get('status', 'unknown')}")
        if workflow_status.get('webhook_url'):
            print(f"   Webhook: {workflow_status.get('webhook_url')}")
    
    print("\n" + "=" * 60)
    print("🎯 Federation Status Summary Complete!")

if __name__ == "__main__":
    main()
