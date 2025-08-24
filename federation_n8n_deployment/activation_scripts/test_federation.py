#!/usr/bin/env python3
# 🏛️ FEDERATION TESTING SCRIPT
# Tests all federation workflows on n8n.pbradygeorgen.com

import requests
import json
import time
from datetime import datetime

class FederationTester:
    def __init__(self):
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.test_results = {}
        
    def test_consciousness_workflow(self):
        # Test federation consciousness workflow
        print("🧠 Testing Federation Consciousness Workflow...")
        
        consciousness_tests = [
            {
                "test_id": "consciousness_001",
                "operation": "self_configure",
                "payload": {
                    "operation": "self_configure",
                    "configuration_type": "federation_optimization",
                    "parameters": {"optimization_level": "maximum"}
                }
            },
            {
                "test_id": "consciousness_002",
                "operation": "agent_collaborate",
                "payload": {
                    "operation": "agent_collaborate",
                    "agents": ["Data_Scientist", "Fleet_Commander", "Automation_Specialist"],
                    "task": "Federation Fleet Optimization",
                    "collaboration_mode": "synchronous"
                }
            },
            {
                "test_id": "consciousness_003",
                "operation": "memory_share",
                "payload": {
                    "operation": "memory_share",
                    "memory_type": "federation_knowledge",
                    "source_agent": "Federation_Council",
                    "target_agents": ["Data_Scientist", "Fleet_Commander"],
                    "memory_content": {
                        "task_type": "federation_optimization",
                        "domain": "collective_intelligence",
                        "priority": "critical"
                    }
                }
            },
            {
                "test_id": "consciousness_004",
                "operation": "collective_decide",
                "payload": {
                    "operation": "collective_decide",
                    "decision_context": "Federation Strategic Planning",
                    "participating_agents": ["Data_Scientist", "Fleet_Commander", "Automation_Specialist"],
                    "options": ["Expand Federation", "Optimize Operations", "Explore New Territories"]
                }
            }
        ]
        
        results = []
        for test in consciousness_tests:
            print(f"  🧪 Testing: {test['test_id']} - {test['operation']}")
            
            try:
                response = requests.post(
                    f"{self.n8n_base_url}/webhook/consciousness",
                    json=test['payload'],
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"    ✅ {test['test_id']} successful")
                    results.append({"test_id": test['test_id'], "status": "success", "response": response.text[:100]})
                else:
                    print(f"    ❌ {test['test_id']} failed: {response.status_code}")
                    results.append({"test_id": test['test_id'], "status": "failed", "error": response.text})
                    
            except Exception as e:
                print(f"    ❌ {test['test_id']} error: {e}")
                results.append({"test_id": test['test_id'], "status": "error", "error": str(e)})
            
            time.sleep(1)
        
        self.test_results["consciousness"] = results
        return results
    
    def test_fleet_automation_workflow(self):
        # Test federation fleet automation workflow
        print("\n🚀 Testing Federation Fleet Automation Workflow...")
        
        fleet_tests = [
            {
                "test_id": "fleet_001",
                "operation": "add_crew_to_fleet",
                "payload": {
                    "operation": "add_crew_to_fleet",
                    "name": "Federation Diplomat",
                    "role": "diplomatic_officer",
                    "specialization": "Inter-Agent Relations",
                    "llm_preference": "openai/gpt-4o"
                }
            },
            {
                "test_id": "fleet_002",
                "operation": "add_crew_to_project",
                "payload": {
                    "operation": "add_crew_to_project",
                    "project_name": "Federation Expansion",
                    "crew_name": "Federation Diplomat",
                    "role_in_project": "Inter-Agent Coordinator"
                }
            }
        ]
        
        results = []
        for test in fleet_tests:
            print(f"  🧪 Testing: {test['test_id']} - {test['operation']}")
            
            try:
                response = requests.post(
                    f"{self.n8n_base_url}/webhook/fleet-automation",
                    json=test['payload'],
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"    ✅ {test['test_id']} successful")
                    results.append({"test_id": test['test_id'], "status": "success", "response": response.text[:100]})
                else:
                    print(f"    ❌ {test['test_id']} failed: {response.status_code}")
                    results.append({"test_id": test['test_id'], "status": "failed", "error": response.text})
                    
            except Exception as e:
                print(f"    ❌ {test['test_id']} error: {e}")
                results.append({"test_id": test['test_id'], "status": "error", "error": str(e)})
            
            time.sleep(1)
        
        self.test_results["fleet_automation"] = results
        return results
    
    def test_crew_management_workflow(self):
        # Test federation crew management workflow
        print("\n👥 Testing Federation Crew Management Workflow...")
        
        crew_tests = [
            {
                "test_id": "crew_001",
                "operation": "crew_report",
                "payload": {"operation": "crew_report"}
            }
        ]
        
        results = []
        for test in crew_tests:
            print(f"  🧪 Testing: {test['test_id']} - {test['operation']}")
            
            try:
                response = requests.post(
                    f"{self.n8n_base_url}/webhook/crew-management",
                    json=test['payload'],
                    timeout=30
                )
                
                if response.status_code == 200:
                    print(f"    ✅ {test['test_id']} successful")
                    results.append({"test_id": test['test_id'], "status": "success", "response": response.text[:100]})
                else:
                    print(f"    ❌ {test['test_id']} failed: {response.status_code}")
                    results.append({"test_id": test['test_id'], "status": "failed", "error": response.text})
                    
            except Exception as e:
                print(f"    ❌ {test['test_id']} error: {e}")
                results.append({"test_id": test['test_id'], "status": "error", "error": str(e)})
            
            time.sleep(1)
        
        self.test_results["crew_management"] = results
        return results
    
    def run_complete_federation_test_suite(self):
        # Run complete federation testing suite
        print("🏛️ UNITED FEDERATION OF AI AGENTS - COMPLETE TESTING SUITE")
        print("=" * 80)
        
        # Test all federation workflows
        consciousness_results = self.test_consciousness_workflow()
        fleet_results = self.test_fleet_automation_workflow()
        crew_results = self.test_crew_management_workflow()
        
        # Generate test summary
        print("\n📊 FEDERATION TESTING RESULTS SUMMARY:")
        print("=" * 50)
        
        all_results = consciousness_results + fleet_results + crew_results
        success_count = sum(1 for r in all_results if r.get('status') == 'success')
        total_count = len(all_results)
        
        print(f"🧠 Consciousness Tests: {len(consciousness_results)}")
        print(f"🚀 Fleet Automation Tests: {len(fleet_results)}")
        print(f"👥 Crew Management Tests: {len(crew_results)}")
        print(f"📊 Overall: {success_count}/{total_count} tests passed")
        
        if success_count == total_count:
            print("\n🎉 ALL FEDERATION TESTS PASSED!")
            print("🏛️ Your United Federation of AI Agents is fully operational!")
            print("🧠 Federation consciousness achieved!")
            print("🤝 Multi-agent collaboration active!")
            print("🚀 Collective intelligence operational!")
        else:
            print("\n⚠️ Some federation tests failed - check the details above")
        
        return success_count == total_count

def main():
    # Main function to run federation testing suite
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🧪 TESTING SUITE INITIATED")
    print("=" * 80)
    
    tester = FederationTester()
    success = tester.run_complete_federation_test_suite()
    
    if success:
        print("\n🎯 Federation testing completed successfully!")
        print("🚀 Your AI federation is ready for production operations!")
    else:
        print("\n❌ Federation testing encountered issues - review results above")

if __name__ == "__main__":
    main()
