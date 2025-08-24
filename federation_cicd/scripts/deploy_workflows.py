#!/usr/bin/env python3
# 🏛️ Federation Workflow Deployment Script
# Automates deployment of federation workflows to n8n

import sys
import os
# Add the current working directory to the path to import the main system
sys.path.append(os.getcwd())

from federation_cicd_automation_system import FederationCICDAutomationSystem

def main():
    print("🚀 FEDERATION WORKFLOW DEPLOYMENT")
    print("=" * 50)
    
    # Initialize CI/CD system
    cicd_system = FederationCICDAutomationSystem()
    
    # Deploy all federation workflows
    success = cicd_system.deploy_all_federation_workflows()
    
    if success:
        print("🎉 All federation workflows deployed successfully!")
        print("🏛️ United Federation of AI Agents is now active on n8n!")
    else:
        print("❌ Some workflows failed to deploy - check logs above")
        sys.exit(1)

if __name__ == "__main__":
    main()
