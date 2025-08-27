#!/usr/bin/env python3
"""
Test Crew System Functionality Script
Tests the crew system functionality with the new naming conventions.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class CrewSystemTester:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Load crew configuration
        self.crew_config = self.load_crew_config()
        
    def load_crew_config(self) -> Dict:
        """Load the updated crew configuration."""
        try:
            with open('config/n8n_optimized_crew_config.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Failed to load crew configuration: {e}")
            return {}
    
    def fetch_active_workflows(self) -> List[Dict]:
        """Fetch active workflows from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                return [w for w in data if w.get('active', False)]
            elif isinstance(data, dict) and 'data' in data:
                return [w for w in data['data'] if w.get('active', False)]
            elif isinstance(data, str):
                try:
                    workflows = json.loads(data)
                    return [w for w in workflows if w.get('active', False)]
                except json.JSONDecodeError:
                    print(f"❌ Failed to parse response as JSON: {data[:100]}...")
                    return []
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return []
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return []
    
    def test_naming_convention_compliance(self, workflows: List[Dict]) -> Dict:
        """Test if workflows follow the new naming conventions."""
        compliance_results = {
            'total_workflows': len(workflows),
            'crew_workflows': [],
            'system_workflows': [],
            'non_compliant': [],
            'compliance_rate': 0.0
        }
        
        for workflow in workflows:
            name = workflow.get('name', '')
            
            if name.startswith('Crew -'):
                compliance_results['crew_workflows'].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False)
                })
            elif name.startswith('System -'):
                compliance_results['system_workflows'].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False)
                })
            else:
                compliance_results['non_compliant'].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False)
                })
        
        # Calculate compliance rate
        compliant_count = len(compliance_results['crew_workflows']) + len(compliance_results['system_workflows'])
        compliance_results['compliance_rate'] = (compliant_count / len(workflows)) * 100 if workflows else 0
        
        return compliance_results
    
    def test_crew_webhook_functionality(self, workflows: List[Dict]) -> Dict:
        """Test crew webhook functionality."""
        webhook_results = {
            'total_crew_workflows': 0,
            'webhook_nodes_found': 0,
            'webhook_configurations': []
        }
        
        for workflow in workflows:
            if workflow.get('name', '').startswith('Crew -'):
                webhook_results['total_crew_workflows'] += 1
                
                # Check for webhook nodes
                nodes = workflow.get('nodes', [])
                for node in nodes:
                    if isinstance(node, dict) and node.get('type') == 'n8n-nodes-base.webhook':
                        webhook_results['webhook_nodes_found'] += 1
                        
                        webhook_config = {
                            'workflow_name': workflow.get('name', ''),
                            'workflow_id': workflow.get('id', ''),
                            'webhook_id': node.get('parameters', {}).get('webhookId', ''),
                            'webhook_path': node.get('parameters', {}).get('path', ''),
                            'http_method': node.get('parameters', {}).get('httpMethod', '')
                        }
                        webhook_results['webhook_configurations'].append(webhook_config)
        
        return webhook_results
    
    def test_memory_integration(self, workflows: List[Dict]) -> Dict:
        """Test memory integration across workflows."""
        memory_results = {
            'total_workflows': len(workflows),
            'memory_enabled': 0,
            'memory_disabled': 0,
            'memory_details': []
        }
        
        for workflow in workflows:
            has_memory = False
            memory_nodes = []
            
            nodes = workflow.get('nodes', [])
            for node in nodes:
                if isinstance(node, dict):
                    node_type = node.get('type', '')
                    if 'httpRequest' in node_type:
                        parameters = node.get('parameters', {})
                        url = parameters.get('url', '')
                        if 'supabase.co' in url:
                            has_memory = True
                            memory_nodes.append({
                                'node_name': node.get('name', ''),
                                'node_type': node_type,
                                'url': url
                            })
            
            if has_memory:
                memory_results['memory_enabled'] += 1
            else:
                memory_results['memory_disabled'] += 1
            
            memory_results['memory_details'].append({
                'workflow_name': workflow.get('name', ''),
                'workflow_id': workflow.get('id', ''),
                'has_memory': has_memory,
                'memory_nodes': memory_nodes
            })
        
        return memory_results
    
    def test_llm_integration(self, workflows: List[Dict]) -> Dict:
        """Test LLM integration across workflows."""
        llm_results = {
            'total_workflows': len(workflows),
            'llm_enabled': 0,
            'llm_disabled': 0,
            'llm_details': []
        }
        
        for workflow in workflows:
            has_llm = False
            llm_nodes = []
            
            nodes = workflow.get('nodes', [])
            for node in nodes:
                if isinstance(node, dict):
                    node_type = node.get('type', '')
                    if 'httpRequest' in node_type:
                        parameters = node.get('parameters', {})
                        url = parameters.get('url', '')
                        if 'openrouter.ai' in url:
                            has_llm = True
                            llm_nodes.append({
                                'node_name': node.get('name', ''),
                                'node_type': node_type,
                                'url': url
                            })
            
            if has_llm:
                llm_results['llm_enabled'] += 1
            else:
                llm_results['llm_disabled'] += 1
            
            llm_results['llm_details'].append({
                'workflow_name': workflow.get('name', ''),
                'workflow_id': workflow.get('id', ''),
                'has_llm': has_llm,
                'llm_nodes': llm_nodes
            })
        
        return llm_results
    
    def generate_test_report(self, naming_results: Dict, webhook_results: Dict, memory_results: Dict, llm_results: Dict) -> str:
        """Generate comprehensive test report."""
        report_file = f"crew_system_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        report = {
            'test_timestamp': datetime.now().isoformat(),
            'n8n_url': self.n8n_url,
            'test_summary': {
                'naming_convention_compliance': naming_results,
                'webhook_functionality': webhook_results,
                'memory_integration': memory_results,
                'llm_integration': llm_results
            },
            'overall_status': 'PASS' if naming_results['compliance_rate'] == 100 else 'PARTIAL',
            'recommendations': []
        }
        
        # Generate recommendations
        if naming_results['compliance_rate'] < 100:
            report['recommendations'].append("Some workflows do not follow naming conventions")
        
        if webhook_results['webhook_nodes_found'] < webhook_results['total_crew_workflows']:
            report['recommendations'].append("Some crew workflows may be missing webhook nodes")
        
        if memory_results['memory_disabled'] > 0:
            report['recommendations'].append("Some workflows do not have memory integration")
        
        if llm_results['llm_disabled'] > 0:
            report['recommendations'].append("Some workflows do not have LLM integration")
        
        # Save report
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report_file
    
    def run_tests(self):
        """Run all crew system tests."""
        print("🧪 TESTING CREW SYSTEM FUNCTIONALITY...")
        print("=" * 60)
        
        # Fetch active workflows
        print("📡 Fetching active workflows from deployed n8n instance...")
        workflows = self.fetch_active_workflows()
        
        if not workflows:
            print("❌ No active workflows found")
            return
        
        print(f"📋 Found {len(workflows)} active workflows")
        
        # Run tests
        print("\n🎯 Test 1: Naming Convention Compliance...")
        naming_results = self.test_naming_convention_compliance(workflows)
        
        print("\n🔗 Test 2: Webhook Functionality...")
        webhook_results = self.test_crew_webhook_functionality(workflows)
        
        print("\n🧠 Test 3: Memory Integration...")
        memory_results = self.test_memory_integration(workflows)
        
        print("\n🤖 Test 4: LLM Integration...")
        llm_results = self.test_llm_integration(workflows)
        
        # Display results
        print("\n📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"📋 Total Active Workflows: {naming_results['total_workflows']}")
        print(f"🎯 Naming Compliance: {naming_results['compliance_rate']:.1f}%")
        print(f"👥 Crew Workflows: {len(naming_results['crew_workflows'])}")
        print(f"⚙️  System Workflows: {len(naming_results['system_workflows'])}")
        print(f"🔗 Webhook Nodes Found: {webhook_results['webhook_nodes_found']}")
        print(f"🧠 Memory Integration: {memory_results['memory_enabled']}/{memory_results['total_workflows']}")
        print(f"🤖 LLM Integration: {llm_results['llm_enabled']}/{llm_results['total_workflows']}")
        
        # Check for non-compliant workflows
        if naming_results['non_compliant']:
            print(f"\n⚠️  Non-Compliant Workflows: {len(naming_results['non_compliant'])}")
            for workflow in naming_results['non_compliant']:
                print(f"   - {workflow['name']} (ID: {workflow['id']})")
        
        # Generate and save report
        print("\n📝 Generating test report...")
        report_file = self.generate_test_report(naming_results, webhook_results, memory_results, llm_results)
        
        print(f"\n✅ Test report saved: {report_file}")
        
        # Overall status
        if naming_results['compliance_rate'] == 100:
            print("\n🎉 CREW SYSTEM STATUS: FULLY OPERATIONAL!")
            print("All workflows follow naming conventions and are ready for mission deployment.")
        else:
            print("\n⚠️  CREW SYSTEM STATUS: PARTIALLY OPERATIONAL")
            print("Some workflows may need attention to meet full compliance standards.")
        
        return report_file

if __name__ == "__main__":
    try:
        tester = CrewSystemTester()
        tester.run_tests()
    except Exception as e:
        print(f"❌ Crew system testing failed: {e}")
