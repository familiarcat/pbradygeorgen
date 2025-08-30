#!/usr/bin/env python3
"""
Specialized Crew Capability Tests
Tests each crew member's specialized capabilities against their N8N counterparts
"""

import os
import sys
import json
import requests
import time
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

def test_specialized_crew_capabilities():
    """Test specialized capabilities for each crew member"""
    print("🎯 Specialized Crew Capability Tests")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    # Define specialized test scenarios for each crew member
    test_scenarios = {
        'picard': {
            'name': 'Captain Jean-Luc Picard',
            'specialization': 'Strategic Leadership',
            'test_task': 'Develop a strategic plan for establishing diplomatic relations with a newly discovered alien civilization',
            'expected_keywords': ['diplomatic', 'strategic', 'cultural', 'protocol', 'long-term']
        },
        'data': {
            'name': 'Commander Data',
            'specialization': 'Scientific Analysis',
            'test_task': 'Analyze anomalous sensor readings from a stellar phenomenon and provide scientific conclusions',
            'expected_keywords': ['analysis', 'data', 'scientific', 'pattern', 'hypothesis']
        },
        'worf': {
            'name': 'Lieutenant Worf',
            'specialization': 'Tactical Analysis',
            'test_task': 'Assess security threats and develop defensive strategies for an upcoming peace negotiation',
            'expected_keywords': ['security', 'tactical', 'defensive', 'threat', 'protection']
        },
        'geordi': {
            'name': 'Lieutenant Commander Geordi La Forge',
            'specialization': 'Engineering',
            'test_task': 'Diagnose and solve a critical system malfunction in the warp core containment field',
            'expected_keywords': ['engineering', 'technical', 'system', 'solution', 'optimization']
        },
        'troi': {
            'name': 'Counselor Deanna Troi',
            'specialization': 'Psychological Analysis',
            'test_task': 'Analyze team dynamics and recommend strategies to improve crew morale during extended missions',
            'expected_keywords': ['psychological', 'emotional', 'team', 'morale', 'interpersonal']
        },
        'uhura': {
            'name': 'Lieutenant Uhura',
            'specialization': 'Communications',
            'test_task': 'Establish communication protocols with an alien species using unknown linguistic patterns',
            'expected_keywords': ['communication', 'diplomatic', 'linguistic', 'protocol', 'cultural']
        },
        'crusher': {
            'name': 'Dr. Beverly Crusher',
            'specialization': 'Medical Analysis',
            'test_task': 'Diagnose and treat a crew member exhibiting symptoms of an unknown alien pathogen',
            'expected_keywords': ['medical', 'diagnosis', 'treatment', 'health', 'clinical']
        },
        'quark': {
            'name': 'Quark',
            'specialization': 'Business Operations',
            'test_task': 'Evaluate the profitability and risks of establishing a trade route through hostile territory',
            'expected_keywords': ['business', 'profit', 'risk', 'trade', 'financial']
        }
    }
    
    results = {}
    
    # Test each crew member's specialized capabilities
    for crew_id, scenario in test_scenarios.items():
        print(f"🧪 Testing {scenario['name']} - {scenario['specialization']}")
        
        # Test Claude agent capability
        claude_result = test_claude_specialization(crew_id, scenario)
        
        # Test N8N webhook response
        n8n_result = test_n8n_specialization(crew_id, scenario)
        
        # Compare results
        comparison = compare_specialization_results(claude_result, n8n_result, scenario)
        
        results[crew_id] = {
            'scenario': scenario,
            'claude_result': claude_result,
            'n8n_result': n8n_result,
            'comparison': comparison
        }
        
        status_emoji = "✅" if comparison['alignment_score'] >= 0.8 else "⚠️" if comparison['alignment_score'] >= 0.5 else "❌"
        print(f"   {status_emoji} Specialization Alignment: {comparison['alignment_score']:.1%}")
        print()
    
    # Generate summary report
    generate_specialization_report(results)
    
    return results

def test_claude_specialization(crew_id: str, scenario: dict):
    """Test Claude agent's specialized capability"""
    try:
        from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
        
        coordinator = ObservationLoungeCoordinator()
        
        # Get specialized analysis based on crew member type
        specialization_map = {
            'picard': 'strategic',
            'data': 'scientific',
            'worf': 'tactical',
            'geordi': 'engineering',
            'troi': 'psychological',
            'uhura': 'communications',
            'crusher': 'medical',
            'quark': 'business'
        }
        
        analysis_type = specialization_map.get(crew_id, 'strategic')
        test_data = {'task': scenario['test_task']}
        
        result = coordinator.get_specialized_analysis(analysis_type, test_data)
        
        return {
            'status': 'success',
            'response': result.get('analysis', result.get('message', 'No response')),
            'agent': result.get('agent', 'Unknown'),
            'keywords_found': count_keywords_in_text(
                str(result.get('analysis', result.get('message', ''))), 
                scenario['expected_keywords']
            )
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e),
            'keywords_found': 0
        }

def test_n8n_specialization(crew_id: str, scenario: dict):
    """Test N8N webhook's specialized response"""
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    webhook_paths = {
        'picard': 'crew-captain-jean-luc-picard',
        'data': 'crew-commander-data',
        'worf': 'crew-lieutenant-worf',
        'geordi': 'crew-lieutenant-commander-geordi-la-forge',
        'troi': 'crew-counselor-deanna-troi',
        'uhura': 'crew-lieutenant-uhura',
        'crusher': 'crew-dr-beverly-crusher',
        'quark': 'crew-quark'
    }
    
    webhook_path = webhook_paths.get(crew_id)
    if not webhook_path:
        return {'status': 'error', 'error': 'Unknown crew member'}
    
    webhook_url = f"{n8n_base_url}/webhook/{webhook_path}"
    
    try:
        payload = {
            'specialization_test': True,
            'crew_member': crew_id,
            'task': scenario['test_task'],
            'specialization': scenario['specialization'],
            'timestamp': datetime.now().isoformat(),
            'source': 'specialized_capability_test'
        }
        
        response = requests.post(
            webhook_url,
            json=payload,
            timeout=15,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            try:
                response_data = response.json() if response.text else {}
            except:
                response_data = {'message': 'Response received'}
            
            response_text = str(response_data.get('message', response_data))
            
            return {
                'status': 'success',
                'response': response_data,
                'response_time': response.elapsed.total_seconds(),
                'keywords_found': count_keywords_in_text(response_text, scenario['expected_keywords'])
            }
        else:
            return {
                'status': 'error',
                'status_code': response.status_code,
                'error': f"HTTP {response.status_code}",
                'keywords_found': 0
            }
            
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e),
            'keywords_found': 0
        }

def count_keywords_in_text(text: str, keywords: list) -> int:
    """Count how many expected keywords appear in the text"""
    text_lower = text.lower()
    return sum(1 for keyword in keywords if keyword.lower() in text_lower)

def compare_specialization_results(claude_result: dict, n8n_result: dict, scenario: dict):
    """Compare Claude and N8N specialization results"""
    claude_success = claude_result.get('status') == 'success'
    n8n_success = n8n_result.get('status') == 'success'
    
    # Calculate keyword alignment
    expected_keyword_count = len(scenario['expected_keywords'])
    claude_keywords = claude_result.get('keywords_found', 0)
    n8n_keywords = n8n_result.get('keywords_found', 0)
    
    # Calculate alignment score
    success_score = (claude_success + n8n_success) / 2
    keyword_score = min(claude_keywords, n8n_keywords) / expected_keyword_count if expected_keyword_count > 0 else 0
    alignment_score = (success_score + keyword_score) / 2
    
    return {
        'claude_success': claude_success,
        'n8n_success': n8n_success,
        'claude_keywords': claude_keywords,
        'n8n_keywords': n8n_keywords,
        'expected_keywords': expected_keyword_count,
        'alignment_score': alignment_score,
        'status': 'excellent' if alignment_score >= 0.8 else 'good' if alignment_score >= 0.5 else 'poor'
    }

def generate_specialization_report(results: dict):
    """Generate and save specialization test report"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"crew_specialization_report_{timestamp}.json"
    
    # Calculate overall statistics
    total_tests = len(results)
    successful_alignments = sum(1 for r in results.values() if r['comparison']['alignment_score'] >= 0.8)
    average_alignment = sum(r['comparison']['alignment_score'] for r in results.values()) / total_tests
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'total_crew_tested': total_tests,
            'successful_alignments': successful_alignments,
            'success_rate': successful_alignments / total_tests,
            'average_alignment_score': average_alignment
        },
        'detailed_results': results
    }
    
    # Save report
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"📁 Detailed specialization report saved to: {report_file}")
    
    # Print summary
    print("🎯 SPECIALIZATION TEST SUMMARY")
    print("=" * 40)
    print(f"📊 Total Crew Tested: {total_tests}")
    print(f"✅ Successful Alignments: {successful_alignments}/{total_tests} ({successful_alignments/total_tests:.1%})")
    print(f"📈 Average Alignment Score: {average_alignment:.1%}")
    print()
    
    print("👥 Individual Specialization Results:")
    for crew_id, result in results.items():
        comparison = result['comparison']
        status_emoji = "✅" if comparison['alignment_score'] >= 0.8 else "⚠️" if comparison['alignment_score'] >= 0.5 else "❌"
        
        print(f"   {status_emoji} {result['scenario']['name']}")
        print(f"      Specialization: {result['scenario']['specialization']}")
        print(f"      Claude: {'✅' if comparison['claude_success'] else '❌'} | N8N: {'✅' if comparison['n8n_success'] else '❌'}")
        print(f"      Keywords: {comparison['claude_keywords']}/{comparison['expected_keywords']} (Claude), {comparison['n8n_keywords']}/{comparison['expected_keywords']} (N8N)")
        print(f"      Alignment: {comparison['alignment_score']:.1%} ({comparison['status']})")
        print()

def main():
    """Run specialized crew capability tests"""
    try:
        results = test_specialized_crew_capabilities()
        
        # Calculate success rate
        total_tests = len(results)
        successful_tests = sum(1 for r in results.values() if r['comparison']['alignment_score'] >= 0.8)
        success_rate = successful_tests / total_tests if total_tests > 0 else 0
        
        if success_rate >= 0.8:
            print("🎉 EXCELLENT SPECIALIZATION ALIGNMENT!")
            return True
        elif success_rate >= 0.5:
            print("✅ Good specialization alignment - minor improvements needed")
            return True
        else:
            print("⚠️ Specialization alignment needs improvement")
            return False
            
    except Exception as e:
        print(f"💥 Critical error in specialization test: {e}")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)