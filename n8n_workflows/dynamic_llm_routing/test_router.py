#!/usr/bin/env python3
"""
Test script for the Dynamic LLM Router
Run this to verify the router works before deploying to N8N
"""

import os
import sys
import json
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm_router import DynamicLLMRouter

def test_router():
    """Test the dynamic LLM router with various task types"""
    
    print("🧪 Testing Dynamic LLM Router")
    print("=" * 60)
    
    # Initialize router
    router = DynamicLLMRouter()
    
    # Test tasks with different complexities
    test_cases = [
        {
            "task": "Create a strategic plan for our PDF processing system",
            "expected_type": "strategic_planning",
            "expected_complexity": "high",
            "budget": {"max_cost": 0.10}
        },
        {
            "task": "Debug the authentication error in the login form",
            "expected_type": "debugging",
            "expected_complexity": "medium",
            "budget": {"max_cost": 0.05}
        },
        {
            "task": "Write documentation for the new API endpoints",
            "expected_type": "documentation",
            "expected_complexity": "low",
            "budget": {"max_cost": 0.03}
        },
        {
            "task": "Quick analysis of the performance metrics",
            "expected_type": "quick_analysis",
            "expected_complexity": "low",
            "budget": {"max_cost": 0.02}
        },
        {
            "task": "Analyze the system architecture for scalability",
            "expected_type": "complex_analysis",
            "expected_complexity": "medium",
            "budget": {"max_cost": 0.08}
        },
        {
            "task": "Implement a new authentication system",
            "expected_type": "code_implementation",
            "expected_complexity": "medium",
            "budget": {"max_cost": 0.06}
        }
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n🔍 Test Case {i}: {test_case['task']}")
        print("-" * 50)
        
        try:
            # Route the task
            result = router.route_task(
                test_case["task"], 
                budget_constraints=test_case["budget"]
            )
            
            if result["success"]:
                # Verify expectations
                task_type = result["task_analysis"]["task_type"]
                complexity = result["task_analysis"]["complexity"]
                selected_model = result["routing_summary"]["selected_model"]
                cost = result["routing_summary"]["total_cost"]
                
                print(f"✅ Success!")
                print(f"   Task Type: {task_type} (expected: {test_case['expected_type']})")
                print(f"   Complexity: {complexity} (expected: {test_case['expected_complexity']})")
                print(f"   Selected Model: {selected_model}")
                print(f"   Cost: ${cost:.4f}")
                print(f"   Reasoning: {result['routing_summary']['reasoning']}")
                
                # Check if expectations were met
                type_match = task_type == test_case["expected_type"]
                complexity_match = complexity == test_case["expected_complexity"]
                budget_ok = cost <= test_case["budget"]["max_cost"]
                
                if type_match and complexity_match and budget_ok:
                    print(f"   🎯 All expectations met!")
                else:
                    print(f"   ⚠️  Some expectations not met:")
                    if not type_match:
                        print(f"      - Type mismatch: got {task_type}, expected {test_case['expected_type']}")
                    if not complexity_match:
                        print(f"      - Complexity mismatch: got {complexity}, expected {test_case['expected_complexity']}")
                    if not budget_ok:
                        print(f"      - Budget exceeded: ${cost:.4f} > ${test_case['budget']['max_cost']:.2f}")
                
                results.append({
                    "test_case": i,
                    "success": True,
                    "task": test_case["task"],
                    "result": result,
                    "expectations_met": type_match and complexity_match and budget_ok
                })
                
            else:
                print(f"❌ Failed: {result['error']}")
                results.append({
                    "test_case": i,
                    "success": False,
                    "task": test_case["task"],
                    "error": result["error"]
                })
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            results.append({
                "test_case": i,
                "success": False,
                "task": test_case["task"],
                "error": f"Exception: {str(e)}"
            })
    
    # Summary
    print(f"\n📊 Test Summary")
    print("=" * 60)
    
    successful_tests = [r for r in results if r["success"]]
    failed_tests = [r for r in results if not r["success"]]
    expectations_met = [r for r in successful_tests if r.get("expectations_met", False)]
    
    print(f"Total Tests: {len(results)}")
    print(f"Successful: {len(successful_tests)}")
    print(f"Failed: {len(failed_tests)}")
    print(f"Expectations Met: {len(expectations_met)}")
    
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            print(f"   Test {test['test_case']}: {test['error']}")
    
    if successful_tests:
        print(f"\n✅ Successful Tests:")
        for test in successful_tests:
            print(f"   Test {test['test_case']}: {test['task'][:50]}...")
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"test_results_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump({
            "timestamp": timestamp,
            "summary": {
                "total_tests": len(results),
                "successful": len(successful_tests),
                "failed": len(failed_tests),
                "expectations_met": len(expectations_met)
            },
            "results": results
        }, f, indent=2)
    
    print(f"\n💾 Results saved to: {results_file}")
    
    return len(failed_tests) == 0

def test_crew_context():
    """Test router with Star Trek crew context"""
    
    print(f"\n🚀 Testing Crew Context Integration")
    print("=" * 60)
    
    router = DynamicLLMRouter()
    
    # Test with crew member context
    crew_context = {
        "crew_member": {
            "name": "Captain Jean-Luc Picard",
            "role": "Strategic Leadership & Mission Command",
            "specialization": "High-level strategy, cost-benefit analysis, mission optimization"
        }
    }
    
    task = "Analyze the strategic implications of our new PDF processing workflow"
    
    print(f"Task: {task}")
    print(f"Crew Context: {crew_context['crew_member']['name']}")
    
    try:
        result = router.route_task(task, context=crew_context, budget_constraints={"max_cost": 0.10})
        
        if result["success"]:
            print(f"✅ Success with crew context!")
            print(f"   Selected Model: {result['routing_summary']['selected_model']}")
            print(f"   Cost: ${result['routing_summary']['total_cost']:.4f}")
            print(f"   Response Preview: {result['execution_result']['response'][:200]}...")
        else:
            print(f"❌ Failed: {result['error']}")
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    # Check if OpenRouter API key is set
    if not os.getenv('OPENROUTER_API_KEY'):
        print("⚠️  Warning: OPENROUTER_API_KEY not set")
        print("   Set it with: export OPENROUTER_API_KEY=your_key_here")
        print("   Some tests may fail without API access")
        print()
    
    # Run tests
    success = test_router()
    
    # Test crew context if basic tests pass
    if success:
        test_crew_context()
    
    print(f"\n🎯 Overall Test Result: {'✅ PASSED' if success else '❌ FAILED'}")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)
