#!/usr/bin/env python3
"""
Diagnose Broken Workflows
Examine the three newly created workflows to identify the cause of the "object is not iterable" error.
"""

import json
import requests
import os
from typing import Dict, List, Tuple
from datetime import datetime

class BrokenWorkflowDiagnostic:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Store diagnostic results
        self.diagnostic_results = {}
        self.riker_reference = {}
        
    def fetch_all_workflows(self) -> List[Dict]:
        """Fetch all workflows from n8n."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return []
            
            print(f"✅ Fetched {len(workflows)} total workflows from n8n")
            return workflows
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return []
    
    def identify_broken_workflows(self, workflows: List[Dict]) -> List[Dict]:
        """Identify the three newly created workflows that are broken."""
        broken_workflows = []
        target_names = [
            "Crew - Lieutenant Uhura - Communications & I/O Operations Officer",
            "Crew - Dr. Beverly Crusher - Health & Diagnostics Officer",
            "Crew - Quark - Business Intelligence & Budget Optimization"
        ]
        
        for workflow in workflows:
            name = workflow.get('name', '')
            if name in target_names:
                broken_workflows.append(workflow)
                print(f"🔍 Found broken workflow: {name}")
        
        print(f"📊 Identified {len(broken_workflows)} broken workflows to diagnose")
        return broken_workflows
    
    def fetch_riker_reference(self, workflows: List[Dict]) -> Dict:
        """Fetch Commander Riker's working workflow as a reference."""
        for workflow in workflows:
            name = workflow.get('name', '')
            if 'Commander William Riker' in name:
                print(f"✅ Found Commander Riker's reference workflow: {name}")
                return workflow
        
        print("❌ Commander Riker's workflow not found!")
        return {}
    
    def analyze_workflow_structure(self, workflow: Dict, workflow_name: str) -> Dict:
        """Analyze workflow structure for potential issues."""
        print(f"\n🔍 Analyzing workflow: {workflow_name}")
        
        analysis = {
            'workflow_name': workflow_name,
            'workflow_id': workflow.get('id', ''),
            'active': workflow.get('active', False),
            'issues': [],
            'warnings': [],
            'structure_analysis': {},
            'recommendations': []
        }
        
        # Analyze basic workflow structure
        required_fields = ['name', 'nodes', 'connections', 'settings']
        missing_fields = []
        for field in required_fields:
            if field not in workflow:
                missing_fields.append(field)
        
        if missing_fields:
            analysis['issues'].append(f"Missing required fields: {', '.join(missing_fields)}")
        else:
            analysis['structure_analysis']['required_fields'] = "✅ All required fields present"
        
        # Analyze nodes
        nodes = workflow.get('nodes', [])
        if not isinstance(nodes, list):
            analysis['issues'].append(f"Nodes field is not a list: {type(nodes)}")
        else:
            analysis['structure_analysis']['node_count'] = len(nodes)
            analysis['structure_analysis']['node_types'] = []
            
            for i, node in enumerate(nodes):
                if not isinstance(node, dict):
                    analysis['issues'].append(f"Node {i} is not a dictionary: {type(node)}")
                    continue
                
                node_name = node.get('name', 'Unknown')
                node_type = node.get('type', 'Unknown')
                analysis['structure_analysis']['node_types'].append(f"{node_name} ({node_type})")
                
                # Check node structure
                required_node_fields = ['id', 'name', 'type']
                missing_node_fields = []
                for field in required_node_fields:
                    if field not in node:
                        missing_node_fields.append(field)
                
                if missing_node_fields:
                    analysis['issues'].append(f"Node {i} ({node_name}) missing fields: {', '.join(missing_node_fields)}")
        
        # Analyze connections
        connections = workflow.get('connections', {})
        if not isinstance(connections, dict):
            analysis['issues'].append(f"Connections field is not a dictionary: {type(connections)}")
        else:
            connection_count = 0
            connection_issues = []
            
            for source_id, targets in connections.items():
                if not isinstance(targets, dict):
                    connection_issues.append(f"Source {source_id} targets is not a dictionary: {type(targets)}")
                    continue
                
                for output, connections_list in targets.items():
                    if not isinstance(connections_list, list):
                        connection_issues.append(f"Source {source_id} output {output} is not a list: {type(connections_list)}")
                        continue
                    
                    connection_count += len(connections_list)
                    
                    for j, connection in enumerate(connections_list):
                        if not isinstance(connection, dict):
                            connection_issues.append(f"Source {source_id} output {output} connection {j} is not a dictionary: {type(connection)}")
                            continue
                        
                        # Check connection structure
                        if 'node' not in connection:
                            connection_issues.append(f"Source {source_id} output {output} connection {j} missing 'node' field")
            
            analysis['structure_analysis']['connection_count'] = connection_count
            if connection_issues:
                analysis['issues'].extend(connection_issues)
        
        # Analyze settings
        settings = workflow.get('settings', {})
        if not isinstance(settings, dict):
            analysis['warnings'].append(f"Settings field is not a dictionary: {type(settings)}")
        
        # Generate recommendations
        if analysis['issues']:
            analysis['recommendations'].append("Fix structural issues before attempting to use workflow")
            analysis['recommendations'].append("Compare with working workflow structure")
        
        if not analysis['issues'] and analysis['warnings']:
            analysis['recommendations'].append("Workflow structure appears valid, check n8n-specific requirements")
        
        return analysis
    
    def compare_with_reference(self, broken_workflow: Dict, riker_workflow: Dict) -> Dict:
        """Compare broken workflow with Riker's working workflow."""
        comparison = {
            'structural_differences': [],
            'missing_elements': [],
            'format_differences': []
        }
        
        # Compare node structures
        broken_nodes = broken_workflow.get('nodes', [])
        riker_nodes = riker_workflow.get('nodes', [])
        
        if len(broken_nodes) != len(riker_nodes):
            comparison['structural_differences'].append(f"Node count mismatch: {len(broken_nodes)} vs {len(riker_nodes)}")
        
        # Compare connection structures
        broken_connections = broken_workflow.get('connections', {})
        riker_connections = riker_workflow.get('connections', {})
        
        if not isinstance(broken_connections, dict) or not isinstance(riker_connections, dict):
            comparison['structural_differences'].append("Connection structure type mismatch")
        else:
            # Check if connections follow the same pattern
            broken_connection_count = sum(len(targets) for targets in broken_connections.values() if isinstance(targets, dict))
            riker_connection_count = sum(len(targets) for targets in riker_connections.values() if isinstance(targets, dict))
            
            if broken_connection_count != riker_connection_count:
                comparison['structural_differences'].append(f"Connection count mismatch: {broken_connection_count} vs {riker_connection_count}")
        
        # Check for missing essential fields
        riker_fields = set(riker_workflow.keys())
        broken_fields = set(broken_workflow.keys())
        missing_fields = riker_fields - broken_fields
        
        if missing_fields:
            comparison['missing_elements'].extend(list(missing_fields))
        
        return comparison
    
    def generate_fix_recommendations(self, analysis: Dict, comparison: Dict) -> List[str]:
        """Generate specific fix recommendations based on analysis."""
        recommendations = []
        
        if analysis['issues']:
            recommendations.append("CRITICAL: Fix structural issues before workflow can function")
            
            for issue in analysis['issues']:
                if "not a list" in issue:
                    recommendations.append("Fix: Ensure nodes field is a proper array")
                elif "not a dictionary" in issue:
                    recommendations.append("Fix: Ensure connections field is a proper object")
                elif "missing required fields" in issue:
                    recommendations.append("Fix: Add all required workflow fields")
        
        if comparison['structural_differences']:
            recommendations.append("STRUCTURAL: Align workflow structure with working reference")
            
            for diff in comparison['structural_differences']:
                if "Node count mismatch" in diff:
                    recommendations.append("Fix: Ensure correct number of nodes")
                elif "Connection count mismatch" in diff:
                    recommendations.append("Fix: Ensure correct connection structure")
        
        if comparison['missing_elements']:
            recommendations.append("COMPLETENESS: Add missing workflow elements")
            recommendations.append(f"Missing fields: {', '.join(comparison['missing_elements'])}")
        
        # General recommendations
        recommendations.append("VALIDATION: Test workflow structure against n8n schema")
        recommendations.append("REFERENCE: Use Riker's workflow as exact template")
        recommendations.append("TESTING: Validate workflow in n8n editor before deployment")
        
        return recommendations
    
    def run_diagnosis(self):
        """Run complete diagnosis of broken workflows."""
        print("🔍 N8N WORKFLOW BREAKAGE DIAGNOSIS")
        print("=" * 80)
        
        # Step 1: Fetch all workflows
        print("📡 Step 1: Fetching all workflows from n8n...")
        all_workflows = self.fetch_all_workflows()
        
        if not all_workflows:
            print("❌ Failed to fetch workflows!")
            return False
        
        # Step 2: Identify broken workflows
        print("\n🔍 Step 2: Identifying broken workflows...")
        broken_workflows = self.identify_broken_workflows(all_workflows)
        
        if not broken_workflows:
            print("❌ No broken workflows found to diagnose!")
            return False
        
        # Step 3: Fetch Riker's reference workflow
        print("\n🔍 Step 3: Fetching reference workflow...")
        self.riker_reference = self.fetch_riker_reference(all_workflows)
        
        if not self.riker_reference:
            print("❌ Cannot proceed without reference workflow!")
            return False
        
        # Step 4: Analyze each broken workflow
        print("\n🔍 Step 4: Analyzing broken workflow structures...")
        
        for broken_workflow in broken_workflows:
            workflow_name = broken_workflow.get('name', 'Unknown')
            
            # Analyze structure
            analysis = self.analyze_workflow_structure(broken_workflow, workflow_name)
            
            # Compare with reference
            comparison = self.compare_with_reference(broken_workflow, self.riker_reference)
            
            # Generate recommendations
            recommendations = self.generate_fix_recommendations(analysis, comparison)
            
            # Store results
            self.diagnostic_results[workflow_name] = {
                'analysis': analysis,
                'comparison': comparison,
                'recommendations': recommendations
            }
        
        # Step 5: Generate diagnostic report
        print(f"\n📊 DIAGNOSTIC RESULTS:")
        print("=" * 60)
        
        for workflow_name, results in self.diagnostic_results.items():
            print(f"\n🔧 {workflow_name}:")
            
            analysis = results['analysis']
            comparison = results['comparison']
            recommendations = results['recommendations']
            
            # Show issues
            if analysis['issues']:
                print(f"   ❌ CRITICAL ISSUES ({len(analysis['issues'])}):")
                for issue in analysis['issues'][:3]:  # Show first 3
                    print(f"      - {issue}")
                if len(analysis['issues']) > 3:
                    print(f"      ... and {len(analysis['issues']) - 3} more")
            
            # Show warnings
            if analysis['warnings']:
                print(f"   ⚠️  WARNINGS ({len(analysis['warnings'])}):")
                for warning in analysis['warnings']:
                    print(f"      - {warning}")
            
            # Show structural analysis
            if analysis['structure_analysis']:
                print(f"   📊 STRUCTURE:")
                for key, value in analysis['structure_analysis'].items():
                    print(f"      {key}: {value}")
            
            # Show recommendations
            if recommendations:
                print(f"   🛠️  RECOMMENDATIONS:")
                for rec in recommendations[:3]:  # Show first 3
                    print(f"      - {rec}")
                if len(recommendations) > 3:
                    print(f"      ... and {len(recommendations) - 3} more")
        
        # Step 6: Save diagnostic report
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_filename = f"broken_workflow_diagnosis_report_{timestamp}.json"
        
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'diagnostic_results': self.diagnostic_results,
            'riker_reference_id': self.riker_reference.get('id', ''),
            'summary': {
                'total_workflows': len(all_workflows),
                'broken_workflows': len(broken_workflows),
                'critical_issues_found': sum(len(results['analysis']['issues']) for results in self.diagnostic_results.values())
            }
        }
        
        with open(report_filename, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Diagnostic report saved: {report_filename}")
        
        # Final assessment
        total_critical_issues = sum(len(results['analysis']['issues']) for results in self.diagnostic_results.values())
        
        if total_critical_issues == 0:
            print(f"\n🎉 NO CRITICAL ISSUES FOUND!")
            print(f"   Workflows may have n8n-specific compatibility issues")
        else:
            print(f"\n⚠️  {total_critical_issues} CRITICAL ISSUES IDENTIFIED!")
            print(f"   Workflows require structural fixes before they can function")
        
        return True

if __name__ == "__main__":
    try:
        diagnostic = BrokenWorkflowDiagnostic()
        success = diagnostic.run_diagnosis()
        
        if success:
            print(f"\n🎯 Workflow diagnosis complete! Check the diagnostic report for details.")
        else:
            print(f"\n❌ Workflow diagnosis failed!")
            
    except Exception as e:
        print(f"❌ Workflow diagnosis failed: {e}")
