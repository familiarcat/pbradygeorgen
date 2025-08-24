#!/usr/bin/env python3
# 🤖 Federation Agent Tweaking Script
# Allows manual tweaking of agent parameters

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from federation_cicd_automation_system import FederationCICDAutomationSystem

def main():
    print("🤖 FEDERATION AGENT TWEAKING")
    print("=" * 50)
    
    # Initialize CI/CD system
    cicd_system = FederationCICDAutomationSystem()
    
    # Show available agents for tweaking
    agents = cicd_system.agent_tweaker.list_available_agents()
    print("Available agents for tweaking:")
    for i, agent in enumerate(agents, 1):
        print(f"{i}. {agent}")
    
    # Allow user to select agent and tweak
    try:
        choice = int(input("\nSelect agent to tweak (1-{}): ".format(len(agents))))
        if 1 <= choice <= len(agents):
            selected_agent = agents[choice - 1]
            cicd_system.agent_tweaker.tweak_agent(selected_agent)
        else:
            print("Invalid choice")
    except ValueError:
        print("Invalid input")
    except KeyboardInterrupt:
        print("\nTweaking cancelled")

if __name__ == "__main__":
    main()
