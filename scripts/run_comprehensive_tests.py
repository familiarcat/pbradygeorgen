#!/usr/bin/env python3
"""
Comprehensive Test Execution Script for N8N Workflow Testing
Runs all test scenarios using the generated test data
"""

import json
import requests
import time
from datetime import datetime
from typing import Dict, List, Any

class N8NTestRunner:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.test_results = []
        self.start_time = None
        
    def load_test_data(self, filename: str = "simple_test_data.json") -> Dict[str, Any]:
        """Load test data from JSON file"""
        try:
            with open(filename, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Test data file {filename} not found!")
            return {}
    
    def test_individual_crew_member(self, crew_id: str, webhook_path: str, task: str) -> Dict[str, Any]:
        """Test individual crew member workflow"""
        url = f"{self.base_url}/api/test-n8n/crew-member"
        payload = {
            "crewMemberId": crew_id,
            "webhookPath": webhook_path,
            "task": task
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, json=payload, timeout=30)
            end_time = time.time()
            
            result = {
                "test_type": "individual_crew",
                "crew_member": crew_id,
                "webhook_path": webhook_path,
                "task": task,
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "response_time": round((end_time - start_time) * 1000, 2),
                "timestamp": datetime.now().isoformat(),
                "response_data": response.json() if response.status_code == 200 else None
            }
            
            return result
            
        except Exception as e:
            return {
                "test_type": "individual_crew",
                "crew_member": crew_id,
                "webhook_path": webhook_path,
                "task": task,
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def test_mission_scenario(self, scenario_id: str, mission_description: str, selected_crew: List[str], complexity: str) -> Dict[str, Any]:
        """Test mission scenario workflow"""
        url = f"{self.base_url}/api/test-n8n/mission-scenario"
        payload = {
            "scenarioId": scenario_id,
            "missionDescription": mission_description,
            "selectedCrew": selected_crew,
            "complexity": complexity
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, json=payload, timeout=30)
            end_time = time.time()
            
            result = {
                "test_type": "mission_scenario",
                "scenario_id": scenario_id,
                "mission_description": mission_description,
                "selected_crew": selected_crew,
                "complexity": complexity,
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "response_time": round((end_time - start_time) * 1000, 2),
                "timestamp": datetime.now().isoformat(),
                "response_data": response.json() if response.status_code == 200 else None
            }
            
            return result
            
        except Exception as e:
            return {
                "test_type": "mission_scenario",
                "scenario_id": scenario_id,
                "mission_description": mission_description,
                "selected_crew": selected_crew,
                "complexity": complexity,
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def test_observation_lounge(self, mission_directive: str, selected_crew: List[str], test_mode: str, complexity: str) -> Dict[str, Any]:
        """Test Observation Lounge workflow"""
        url = f"{self.base_url}/api/test-n8n/observation-lounge"
        payload = {
            "missionDirective": mission_directive,
            "selectedCrew": selected_crew,
            "testMode": test_mode,
            "complexity": complexity
        }
        
        try:
            start_time = time.time()
            response = requests.post(url, json=payload, timeout=30)
            end_time = time.time()
            
            result = {
                "test_type": "observation_lounge",
                "mission_directive": mission_directive,
                "selected_crew": selected_crew,
                "test_mode": test_mode,
                "complexity": complexity,
                "status": "success" if response.status_code == 200 else "failed",
                "status_code": response.status_code,
                "response_time": round((end_time - start_time) * 1000, 2),
                "timestamp": datetime.now().isoformat(),
                "response_data": response.json() if response.status_code == 200 else None
            }
            
            return result
            
        except Exception as e:
            return {
                "test_type": "observation_lounge",
                "mission_directive": mission_directive,
                "selected_crew": selected_crew,
                "test_mode": test_mode,
                "complexity": complexity,
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def run_comprehensive_tests(self, test_data: Dict[str, Any]) -> None:
        """Run all test scenarios"""
        print("🚀 Starting Comprehensive N8N Workflow Testing...")
        print(f"⏰ Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        self.start_time = time.time()
        
        # Test 1: Individual Crew Members
        print("\n🧪 Phase 1: Testing Individual Crew Members...")
        crew_data = test_data.get("crew_test_data", {})
        
        for crew_id, crew_info in crew_data.items():
            print(f"   Testing {crew_id}...", end=" ")
            webhook_path = f"crew-{crew_id}"
            task = crew_info.get("task", "Default task")
            
            result = self.test_individual_crew_member(crew_id, webhook_path, task)
            self.test_results.append(result)
            
            status_icon = "✅" if result["status"] == "success" else "❌"
            response_time = result.get("response_time", "N/A")
            print(f"{status_icon} {response_time}ms")
            
            time.sleep(0.5)  # Small delay between tests
        
        # Test 2: Mission Scenarios
        print("\n🎯 Phase 2: Testing Mission Scenarios...")
        mission_data = test_data.get("mission_scenarios", {})
        
        for scenario_id, scenario_info in mission_data.items():
            print(f"   Testing {scenario_id}...", end=" ")
            mission_description = scenario_info.get("name", "Default mission")
            selected_crew = scenario_info.get("crew_required", [])
            complexity = scenario_info.get("expected_outcomes", {}).get("coordination_efficiency", "Medium")
            
            result = self.test_mission_scenario(scenario_id, mission_description, selected_crew, complexity)
            self.test_results.append(result)
            
            status_icon = "✅" if result["status"] == "success" else "❌"
            response_time = result.get("response_time", "N/A")
            print(f"{status_icon} {response_time}ms")
            
            time.sleep(0.5)  # Small delay between tests
        
        # Test 3: Observation Lounge
        print("\n🏛️ Phase 3: Testing Observation Lounge...")
        
        # Test different modes
        test_modes = [
            ("core_crew", ["picard", "riker", "data", "geordi"]),
            ("specialist_team", ["data", "geordi", "crusher", "worf"]),
            ("full_crew", ["picard", "riker", "data", "geordi", "crusher", "worf", "troi", "uhura", "quark"])
        ]
        
        for test_mode, crew_list in test_modes:
            print(f"   Testing {test_mode} mode...", end=" ")
            mission_directive = f"Test {test_mode} coordination"
            complexity = "High" if test_mode == "full_crew" else "Medium"
            
            result = self.test_observation_lounge(mission_directive, crew_list, test_mode, complexity)
            self.test_results.append(result)
            
            status_icon = "✅" if result["status"] == "success" else "❌"
            response_time = result.get("response_time", "N/A")
            print(f"{status_icon} {response_time}ms")
            
            time.sleep(0.5)  # Small delay between tests
        
        # Generate test report
        self.generate_test_report()
    
    def generate_test_report(self) -> None:
        """Generate comprehensive test report"""
        if not self.test_results:
            print("❌ No test results to report!")
            return
        
        end_time = time.time()
        total_duration = round(end_time - self.start_time, 2)
        
        # Calculate statistics
        total_tests = len(self.test_results)
        successful_tests = len([r for r in self.test_results if r["status"] == "success"])
        failed_tests = len([r for r in self.test_results if r["status"] == "failed"])
        error_tests = len([r for r in self.test_results if r["status"] == "error"])
        
        success_rate = round((successful_tests / total_tests) * 100, 2)
        
        # Calculate average response times
        response_times = [r.get("response_time", 0) for r in self.test_results if r.get("response_time")]
        avg_response_time = round(sum(response_times) / len(response_times), 2) if response_times else 0
        
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST REPORT")
        print("=" * 80)
        print(f"⏰ Total Duration: {total_duration}s")
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Successful: {successful_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Errors: {error_tests}")
        print(f"📈 Success Rate: {success_rate}%")
        print(f"⚡ Average Response Time: {avg_response_time}ms")
        
        # Breakdown by test type
        print("\n📋 Test Breakdown by Type:")
        test_types = {}
        for result in self.test_results:
            test_type = result["test_type"]
            if test_type not in test_types:
                test_types[test_type] = {"total": 0, "success": 0, "failed": 0, "error": 0}
            
            test_types[test_type]["total"] += 1
            test_types[test_type][result["status"]] += 1
        
        for test_type, stats in test_types.items():
            type_success_rate = round((stats["success"] / stats["total"]) * 100, 2)
            print(f"   • {test_type.replace('_', ' ').title()}: {stats['success']}/{stats['total']} ({type_success_rate}%)")
        
        # Save detailed results
        report_filename = f"comprehensive_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w') as f:
            json.dump({
                "metadata": {
                    "generated_at": datetime.now().isoformat(),
                    "total_duration": total_duration,
                    "total_tests": total_tests,
                    "success_rate": success_rate,
                    "average_response_time": avg_response_time
                },
                "test_results": self.test_results,
                "summary": {
                    "successful": successful_tests,
                    "failed": failed_tests,
                    "errors": error_tests,
                    "test_type_breakdown": test_types
                }
            }, f, indent=2)
        
        print(f"\n📁 Detailed report saved to: {report_filename}")
        print("\n🚀 Comprehensive testing completed!")

def main():
    """Main function to run comprehensive tests"""
    print("🚀 N8N Workflow Comprehensive Test Runner")
    print("=" * 50)
    
    # Initialize test runner
    test_runner = N8NTestRunner()
    
    # Load test data
    test_data = test_runner.load_test_data()
    if not test_data:
        print("❌ Failed to load test data. Exiting.")
        return
    
    print(f"✅ Loaded test data: {len(test_data.get('crew_test_data', {}))} crew members, {len(test_data.get('mission_scenarios', {}))} scenarios")
    
    # Run comprehensive tests
    try:
        test_runner.run_comprehensive_tests(test_data)
    except KeyboardInterrupt:
        print("\n⚠️  Testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")

if __name__ == "__main__":
    main()
