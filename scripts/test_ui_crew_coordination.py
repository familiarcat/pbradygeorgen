#!/usr/bin/env python3
"""
UI Crew Coordination Test
Tests the crew coordination through the web UI interface
"""

import os
import json
import requests
import time
from datetime import datetime

def test_ui_crew_coordination():
    """Test crew coordination through the UI API endpoints"""
    print("🌐 UI Crew Coordination Test")
    print("=" * 40)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    base_url = "http://localhost:3000"
    results = {}
    
    # Test scenarios
    test_scenarios = [
        {
            'name': 'Core Crew Mission',
            'missionDirective': 'Establish first contact protocols with newly discovered alien civilization',
            'selectedCrew': ['picard', 'data', 'troi', 'uhura'],
            'testMode': 'core_crew',
            'complexity': 'High'
        },
        {
            'name': 'Technical Challenge',
            'missionDirective': 'Diagnose and resolve critical system failures in main engineering',
            'selectedCrew': ['geordi', 'data', 'worf'],
            'testMode': 'specialized',
            'complexity': 'Medium'
        },
        {
            'name': 'Diplomatic Mission',
            'missionDirective': 'Negotiate trade agreements while ensuring security protocols',
            'selectedCrew': ['picard', 'uhura', 'worf', 'quark'],
            'testMode': 'diplomatic',
            'complexity': 'High'
        },
        {
            'name': 'Medical Emergency',
            'missionDirective': 'Respond to outbreak of unknown pathogen affecting multiple crew members',
            'selectedCrew': ['crusher', 'data', 'troi'],
            'testMode': 'emergency',
            'complexity': 'Critical'
        }
    ]
    
    print("🧪 Testing Observation Lounge Coordination...")
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n   📋 Scenario {i}: {scenario['name']}")
        print(f"      Mission: {scenario['missionDirective'][:60]}...")
        print(f"      Crew: {', '.join(scenario['selectedCrew'])}")
        
        # Test the observation lounge endpoint
        try:
            response = requests.post(
                f"{base_url}/api/test-n8n/observation-lounge",
                json=scenario,
                timeout=30,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                response_data = response.json()
                
                # Extract key metrics
                coordination_summary = response_data.get('response', {}).get('coordination_summary', {})
                crew_responses = response_data.get('response', {}).get('individual_crew_responses', [])
                failed_crew = response_data.get('response', {}).get('failed_crew_members', [])
                
                results[scenario['name']] = {
                    'status': 'success',
                    'response_time': response.elapsed.total_seconds(),
                    'coordination_efficiency': coordination_summary.get('coordination_efficiency', '0%'),
                    'crew_responses': len(crew_responses),
                    'failed_crew': len(failed_crew),
                    'mission_status': coordination_summary.get('mission_status', 'Unknown'),
                    'selected_crew_count': len(scenario['selectedCrew']),
                    'success_rate': f"{len(crew_responses)}/{len(scenario['selectedCrew'])}"
                }
                
                print(f"      ✅ Success: {coordination_summary.get('coordination_efficiency', '0%')} efficiency")
                print(f"      ⏱️ Response time: {response.elapsed.total_seconds():.2f}s")
                print(f"      👥 Crew participation: {len(crew_responses)}/{len(scenario['selectedCrew'])}")
                
                if failed_crew:
                    print(f"      ⚠️ Failed crew members: {len(failed_crew)}")
                    
            else:
                results[scenario['name']] = {
                    'status': 'error',
                    'status_code': response.status_code,
                    'error': response.text[:200] if response.text else 'Unknown error'
                }
                print(f"      ❌ Failed: HTTP {response.status_code}")
                
        except Exception as e:
            results[scenario['name']] = {
                'status': 'error',
                'error': str(e)
            }
            print(f"      💥 Error: {e}")
    
    # Test individual crew member endpoints
    print(f"\n🧑‍🚀 Testing Individual Crew Member Access...")
    crew_endpoints = {
        'picard': 'crew-captain-jean-luc-picard',
        'data': 'crew-commander-data',
        'worf': 'crew-lieutenant-worf',
        'geordi': 'crew-lieutenant-commander-geordi-la-forge',
        'troi': 'crew-counselor-deanna-troi',
        'uhura': 'crew-lieutenant-uhura',
        'crusher': 'crew-dr-beverly-crusher',
        'quark': 'crew-quark'
    }
    
    individual_results = {}
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    for crew_id, webhook_path in crew_endpoints.items():
        try:
            webhook_url = f"{n8n_base_url}/webhook/{webhook_path}"
            
            test_payload = {
                'ui_test': True,
                'crew_member': crew_id,
                'task': f'UI coordination test for {crew_id}',
                'timestamp': datetime.now().isoformat(),
                'source': 'ui_coordination_test'
            }
            
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )
            
            individual_results[crew_id] = {
                'status': 'success' if response.status_code == 200 else 'error',
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds(),
                'webhook_path': webhook_path
            }
            
            status_emoji = "✅" if response.status_code == 200 else "❌"
            print(f"      {status_emoji} {crew_id}: {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
            
        except Exception as e:
            individual_results[crew_id] = {
                'status': 'error',
                'error': str(e),
                'webhook_path': webhook_path
            }
            print(f"      💥 {crew_id}: Error - {e}")
    
    # Generate comprehensive report
    report = generate_ui_coordination_report(results, individual_results, test_scenarios)
    
    return report

def generate_ui_coordination_report(coordination_results, individual_results, test_scenarios):
    """Generate UI coordination test report"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"ui_crew_coordination_report_{timestamp}.json"
    
    # Calculate statistics
    successful_scenarios = sum(1 for r in coordination_results.values() if r.get('status') == 'success')
    successful_individuals = sum(1 for r in individual_results.values() if r.get('status') == 'success')
    
    total_crew_tested = sum(len(scenario['selectedCrew']) for scenario in test_scenarios)
    total_crew_responses = sum(
        r.get('crew_responses', 0) for r in coordination_results.values() 
        if r.get('status') == 'success'
    )
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'test_summary': {
            'scenarios_tested': len(test_scenarios),
            'successful_scenarios': successful_scenarios,
            'scenario_success_rate': successful_scenarios / len(test_scenarios) if test_scenarios else 0,
            'individual_crew_tested': len(individual_results),
            'successful_individual_tests': successful_individuals,
            'individual_success_rate': successful_individuals / len(individual_results) if individual_results else 0,
            'total_crew_interactions': total_crew_tested,
            'successful_crew_responses': total_crew_responses,
            'crew_response_rate': total_crew_responses / total_crew_tested if total_crew_tested > 0 else 0
        },
        'coordination_results': coordination_results,
        'individual_results': individual_results,
        'test_scenarios': test_scenarios
    }
    
    # Save report
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📁 UI coordination report saved to: {report_file}")
    
    # Print summary
    print_ui_coordination_summary(report)
    
    return report

def print_ui_coordination_summary(report):
    """Print UI coordination test summary"""
    summary = report['test_summary']
    
    print("\n🎯 UI CREW COORDINATION SUMMARY")
    print("=" * 45)
    print(f"📋 Scenario Tests: {summary['successful_scenarios']}/{summary['scenarios_tested']} ({summary['scenario_success_rate']:.1%})")
    print(f"👥 Individual Tests: {summary['successful_individual_tests']}/{summary['individual_crew_tested']} ({summary['individual_success_rate']:.1%})")
    print(f"🤝 Crew Responses: {summary['successful_crew_responses']}/{summary['total_crew_interactions']} ({summary['crew_response_rate']:.1%})")
    
    print("\n📊 Scenario Results:")
    for scenario_name, result in report['coordination_results'].items():
        if result.get('status') == 'success':
            status_emoji = "✅"
            details = f"{result.get('coordination_efficiency', '0%')} efficiency, {result.get('success_rate', '0/0')} crew"
        else:
            status_emoji = "❌"
            details = result.get('error', 'Unknown error')[:50]
        
        print(f"   {status_emoji} {scenario_name}: {details}")
    
    print("\n🧑‍🚀 Individual Crew Results:")
    for crew_id, result in report['individual_results'].items():
        status_emoji = "✅" if result.get('status') == 'success' else "❌"
        status_code = result.get('status_code', 'Unknown')
        response_time = result.get('response_time', 0)
        print(f"   {status_emoji} {crew_id}: HTTP {status_code} ({response_time:.2f}s)")
    
    # Overall assessment
    overall_success = (summary['scenario_success_rate'] >= 0.8 and 
                      summary['individual_success_rate'] >= 0.8 and
                      summary['crew_response_rate'] >= 0.8)
    
    if overall_success:
        print("\n🎉 EXCELLENT UI CREW COORDINATION!")
    elif summary['scenario_success_rate'] >= 0.5 and summary['individual_success_rate'] >= 0.5:
        print("\n✅ Good UI coordination - minor improvements needed")
    else:
        print("\n⚠️ UI coordination needs attention")

def main():
    """Run UI crew coordination test"""
    try:
        report = test_ui_crew_coordination()
        summary = report['test_summary']
        
        # Determine overall success
        overall_success = (summary['scenario_success_rate'] >= 0.8 and 
                          summary['individual_success_rate'] >= 0.8 and
                          summary['crew_response_rate'] >= 0.8)
        
        return overall_success
        
    except Exception as e:
        print(f"💥 Critical error in UI coordination test: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)