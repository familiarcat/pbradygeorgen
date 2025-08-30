#!/usr/bin/env python3
"""
Claude-N8N Crew Agent Alignment Test
Tests each Claude crew member against their N8N workflow counterpart
"""

import os
import sys
import json
import requests
import time
from datetime import datetime
from typing import Dict, List, Any

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

def test_crew_n8n_alignment():
    """Test alignment between Claude crew agents and N8N workflows"""
    print("🔄 Claude-N8N Crew Agent Alignment Test")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Define crew member mappings
    crew_mappings = {
        'picard': {
            'claude_name': 'Captain Jean-Luc Picard',
            'claude_role': 'Strategic Leadership & Mission Command',
            'n8n_webhook': 'crew-captain-jean-luc-picard',
            'specialization': 'strategic_leadership'
        },
        'data': {
            'claude_name': 'Commander Data',
            'claude_role': 'Scientific Analysis & Logical Reasoning',
            'n8n_webhook': 'crew-commander-data',
            'specialization': 'scientific_analysis'
        },
        'riker': {
            'claude_name': 'Commander William Riker',
            'claude_role': 'Tactical Execution & Workflow Management',
            'n8n_webhook': 'crew-commander-william-riker',
            'specialization': 'tactical_execution'
        },
        'worf': {
            'claude_name': 'Lieutenant Worf',
            'claude_role': 'Tactical Analysis & Security Operations',
            'n8n_webhook': 'crew-lieutenant-worf',
            'specialization': 'tactical_analysis'
        },
        'geordi': {
            'claude_name': 'Lieutenant Commander Geordi La Forge',
            'claude_role': 'Engineering & Technical Problem-Solving',
            'n8n_webhook': 'crew-lieutenant-commander-geordi-la-forge',
            'specialization': 'engineering'
        },
        'troi': {
            'claude_name': 'Counselor Deanna Troi',
            'claude_role': 'Psychological Analysis & Emotional Intelligence',
            'n8n_webhook': 'crew-counselor-deanna-troi',
            'specialization': 'psychological_analysis'
        },
        'uhura': {
            'claude_name': 'Lieutenant Uhura',
            'claude_role': 'Communications & Diplomatic Relations',
            'n8n_webhook': 'crew-lieutenant-uhura',
            'specialization': 'communications'
        },
        'crusher': {
            'claude_name': 'Dr. Beverly Crusher',
            'claude_role': 'Medical Analysis & Healthcare Planning',
            'n8n_webhook': 'crew-dr-beverly-crusher',
            'specialization': 'medical_analysis'
        },
        'quark': {
            'claude_name': 'Quark',
            'claude_role': 'Business Operations & Financial Analysis',
            'n8n_webhook': 'crew-quark',
            'specialization': 'business_operations'
        }
    }
    
    # Test Claude crew system
    print("🧪 Testing Claude Crew System...")
    claude_results = test_claude_crew_system()
    
    # Test N8N webhooks
    print("\n🕸️ Testing N8N Webhook Endpoints...")
    n8n_results = test_n8n_webhooks(crew_mappings)
    
    # Test integration between Claude and N8N
    print("\n🔗 Testing Claude-N8N Integration...")
    integration_results = test_integration_flow(crew_mappings)
    
    # Generate alignment report
    print("\n📊 Generating Alignment Report...")
    alignment_report = generate_alignment_report(
        crew_mappings, claude_results, n8n_results, integration_results
    )
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"crew_n8n_alignment_report_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump(alignment_report, f, indent=2)
    
    print(f"\n📁 Detailed report saved to: {report_file}")
    
    # Print summary
    print_alignment_summary(alignment_report)
    
    return alignment_report

def test_claude_crew_system():
    """Test Claude crew system functionality"""
    try:
        from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
        
        coordinator = ObservationLoungeCoordinator()
        crew_status = coordinator.get_crew_status()
        
        results = {
            'status': 'success',
            'total_crew': crew_status['total_crew'],
            'crew_members': crew_status['crew_members'],
            'operational': crew_status['total_crew'] == 8
        }
        
        print(f"   ✅ Claude crew system operational: {results['total_crew']}/8 members")
        return results
        
    except Exception as e:
        print(f"   ❌ Claude crew system error: {e}")
        return {'status': 'error', 'error': str(e)}

def test_n8n_webhooks(crew_mappings: Dict[str, Dict[str, str]]):
    """Test N8N webhook endpoints for each crew member"""
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    results = {}
    
    for crew_id, mapping in crew_mappings.items():
        webhook_path = mapping['n8n_webhook']
        webhook_url = f"{n8n_base_url}/webhook/{webhook_path}"
        
        try:
            print(f"   🧪 Testing {mapping['claude_name']} -> {webhook_path}")
            
            # Test webhook with basic payload
            test_payload = {
                'test': True,
                'crew_member': crew_id,
                'task': f'Alignment test for {mapping["claude_name"]}',
                'timestamp': datetime.now().isoformat(),
                'source': 'crew_alignment_test'
            }
            
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )
            
            results[crew_id] = {
                'webhook_path': webhook_path,
                'status_code': response.status_code,
                'active': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'error': None
            }
            
            status_emoji = "✅" if response.status_code == 200 else "❌"
            print(f"      {status_emoji} Status: {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
            
        except Exception as e:
            results[crew_id] = {
                'webhook_path': webhook_path,
                'status_code': None,
                'active': False,
                'response_time': None,
                'error': str(e)
            }
            print(f"      ❌ Error: {e}")
    
    return results

def test_integration_flow(crew_mappings: Dict[str, Dict[str, str]]):
    """Test integration flow between Claude and N8N"""
    results = {}
    
    try:
        # Test observation lounge coordination
        print("   🏛️ Testing Observation Lounge coordination...")
        
        # Use the observation lounge API endpoint
        api_url = "http://localhost:3000/api/test-n8n/observation-lounge"
        
        test_payload = {
            'missionDirective': 'Test crew alignment and coordination capabilities',
            'selectedCrew': list(crew_mappings.keys())[:4],  # Test with 4 crew members
            'testMode': 'alignment_test',
            'complexity': 'Medium'
        }
        
        response = requests.post(
            api_url,
            json=test_payload,
            timeout=30,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            response_data = response.json()
            results['observation_lounge'] = {
                'status': 'success',
                'response_time': response.elapsed.total_seconds(),
                'crew_responses': len(response_data.get('response', {}).get('individual_crew_responses', [])),
                'failed_crew': len(response_data.get('response', {}).get('failed_crew_members', [])),
                'coordination_efficiency': response_data.get('response', {}).get('coordination_summary', {}).get('coordination_efficiency', '0%')
            }
            print(f"      ✅ Coordination successful: {results['observation_lounge']['coordination_efficiency']} efficiency")
        else:
            results['observation_lounge'] = {
                'status': 'error',
                'status_code': response.status_code,
                'error': response.text[:200] if response.text else 'Unknown error'
            }
            print(f"      ❌ Coordination failed: HTTP {response.status_code}")
            
    except Exception as e:
        results['observation_lounge'] = {
            'status': 'error',
            'error': str(e)
        }
        print(f"      ❌ Integration test error: {e}")
    
    return results

def generate_alignment_report(crew_mappings, claude_results, n8n_results, integration_results):
    """Generate comprehensive alignment report"""
    report = {
        'timestamp': datetime.now().isoformat(),
        'test_summary': {
            'total_crew_expected': len(crew_mappings),
            'claude_operational': claude_results.get('operational', False),
            'n8n_active_webhooks': sum(1 for r in n8n_results.values() if r.get('active', False)),
            'integration_working': integration_results.get('observation_lounge', {}).get('status') == 'success'
        },
        'crew_mappings': crew_mappings,
        'claude_results': claude_results,
        'n8n_results': n8n_results,
        'integration_results': integration_results,
        'alignment_analysis': {}
    }
    
    # Analyze alignment for each crew member
    for crew_id, mapping in crew_mappings.items():
        claude_active = crew_id in claude_results.get('crew_members', {})
        n8n_active = n8n_results.get(crew_id, {}).get('active', False)
        
        alignment_status = 'perfect' if claude_active and n8n_active else \
                          'partial' if claude_active or n8n_active else 'missing'
        
        report['alignment_analysis'][crew_id] = {
            'claude_name': mapping['claude_name'],
            'claude_active': claude_active,
            'n8n_webhook': mapping['n8n_webhook'],
            'n8n_active': n8n_active,
            'alignment_status': alignment_status,
            'response_time': n8n_results.get(crew_id, {}).get('response_time')
        }
    
    return report

def print_alignment_summary(report):
    """Print alignment summary"""
    print("\n🎯 CREW-N8N ALIGNMENT SUMMARY")
    print("=" * 40)
    
    summary = report['test_summary']
    print(f"📊 Total Crew Members: {summary['total_crew_expected']}")
    print(f"🤖 Claude System: {'✅ Operational' if summary['claude_operational'] else '❌ Issues'}")
    print(f"🕸️ N8N Active Webhooks: {summary['n8n_active_webhooks']}/{summary['total_crew_expected']}")
    print(f"🔗 Integration: {'✅ Working' if summary['integration_working'] else '❌ Issues'}")
    
    print("\n👥 Individual Crew Alignment:")
    for crew_id, analysis in report['alignment_analysis'].items():
        status_emoji = "✅" if analysis['alignment_status'] == 'perfect' else \
                      "⚠️" if analysis['alignment_status'] == 'partial' else "❌"
        
        claude_status = "✅" if analysis['claude_active'] else "❌"
        n8n_status = "✅" if analysis['n8n_active'] else "❌"
        
        print(f"   {status_emoji} {analysis['claude_name']}")
        print(f"      Claude: {claude_status} | N8N: {n8n_status} | Status: {analysis['alignment_status']}")
    
    # Calculate overall alignment score
    perfect_alignments = sum(1 for a in report['alignment_analysis'].values() 
                           if a['alignment_status'] == 'perfect')
    alignment_percentage = (perfect_alignments / summary['total_crew_expected']) * 100
    
    print(f"\n🎯 Overall Alignment Score: {alignment_percentage:.1f}% ({perfect_alignments}/{summary['total_crew_expected']})")
    
    if alignment_percentage == 100:
        print("🎉 PERFECT ALIGNMENT ACHIEVED!")
    elif alignment_percentage >= 80:
        print("✅ Good alignment - minor issues to resolve")
    else:
        print("⚠️ Significant alignment issues detected")

def main():
    """Run the crew alignment test"""
    try:
        report = test_crew_n8n_alignment()
        return report['test_summary']['claude_operational'] and \
               report['test_summary']['integration_working'] and \
               report['test_summary']['n8n_active_webhooks'] >= 8
    except Exception as e:
        print(f"💥 Critical error in alignment test: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)