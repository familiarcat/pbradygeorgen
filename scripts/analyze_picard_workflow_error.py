#!/usr/bin/env python3
"""
Focused Analysis: Captain Jean-Luc Picard Workflow Error
Analyzes the specific error in the Picard workflow to identify systemic issues
"""

import os
import json
import sys
from pathlib import Path
from typing import Dict, Any, List

class PicardWorkflowErrorAnalyzer:
    def __init__(self):
        self.workspace_dir = Path.cwd()
        self.backup_dir = self.workspace_dir / "n8n_deployed_backup"
        
        print("🔍 CAPTAIN JEAN-LUC PICARD WORKFLOW ERROR ANALYSIS")
        print("=" * 70)

    def find_latest_backup(self) -> Path:
        """Find the most recent backup directory"""
        if not self.backup_dir.exists():
            print("❌ No backup directory found")
            return None
        
        backup_dirs = [d for d in self.backup_dir.iterdir() if d.is_dir() and d.name.startswith("backup_")]
        if not backup_dirs:
            print("❌ No backup directories found")
            return None
        
        latest_backup = sorted(backup_dirs, key=lambda x: x.name)[-1]
        print(f"📁 Using latest backup: {latest_backup.name}")
        return latest_backup

    def analyze_picard_workflows(self, backup_dir: Path) -> Dict[str, Any]:
        """Analyze all Captain Jean-Luc Picard workflows"""
        print("\n🔍 ANALYZING CAPTAIN JEAN-LUC PICARD WORKFLOWS...")
        
        # Find all Picard workflow files
        picard_files = []
        for file_path in backup_dir.glob("*Captain_Jean-Luc_Picard*.json"):
            picard_files.append(file_path)
        
        print(f"📋 Found {len(picard_files)} Picard workflow files:")
        for file_path in picard_files:
            print(f"   📄 {file_path.name}")
        
        # Analyze each workflow
        workflow_analyses = {}
        for file_path in picard_files:
            print(f"\n🔍 Analyzing: {file_path.name}")
            analysis = self._analyze_single_picard_workflow(file_path)
            workflow_analyses[file_path.name] = analysis
        
        return workflow_analyses

    def _analyze_single_picard_workflow(self, workflow_file: Path) -> Dict[str, Any]:
        """Analyze a single Picard workflow for errors and inconsistencies"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            workflow = workflow_data.get('workflow_data', {})
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            # Extract workflow metadata
            workflow_id = workflow.get('id')
            workflow_name = workflow.get('name')
            is_active = workflow.get('active', False)
            
            # Analyze nodes in detail
            node_analysis = []
            for node in nodes:
                node_info = {
                    'id': node.get('id'),
                    'name': node.get('name'),
                    'type': node.get('type'),
                    'typeVersion': node.get('typeVersion'),
                    'parameters': node.get('parameters', {}),
                    'position': node.get('position', []),
                    'webhookId': node.get('webhookId'),
                    'error_analysis': self._analyze_node_for_errors(node)
                }
                node_analysis.append(node_info)
            
            # Analyze connections
            connection_analysis = self._analyze_connections(nodes, connections)
            
            # Check for specific error patterns
            error_patterns = self._identify_picard_specific_errors(nodes, connections)
            
            return {
                'workflow_id': workflow_id,
                'workflow_name': workflow_name,
                'is_active': is_active,
                'node_count': len(nodes),
                'node_analysis': node_analysis,
                'connection_analysis': connection_analysis,
                'error_patterns': error_patterns,
                'systemic_issues': self._identify_systemic_issues(nodes, connections),
                'recommendations': self._generate_picard_recommendations(nodes, connections, error_patterns)
            }
            
        except Exception as e:
            print(f"   ❌ Error analyzing {workflow_file.name}: {e}")
            return {'error': str(e)}

    def _analyze_node_for_errors(self, node: Dict[str, Any]) -> List[str]:
        """Analyze a single node for potential errors"""
        errors = []
        node_type = node.get('type', '')
        parameters = node.get('parameters', {})
        
        # Check HTTP Request nodes (LLM integration)
        if 'httpRequest' in node_type:
            # Check for authentication issues
            if not parameters.get('authentication'):
                errors.append("Missing authentication for HTTP Request")
            
            # Check for URL issues
            url = parameters.get('url', '')
            if 'api.openrouter.ai' in url:
                if not parameters.get('authentication'):
                    errors.append("OpenRouter API call without authentication")
                
                # Check for proper HTTP method
                method = parameters.get('method', 'GET')
                if method not in ['GET', 'POST']:
                    errors.append(f"Unexpected HTTP method for OpenRouter: {method}")
        
        # Check webhook nodes
        elif 'webhook' in node_type:
            path = parameters.get('path', '')
            if not path:
                errors.append("Webhook missing path parameter")
            
            # Check for proper webhook configuration
            if not parameters.get('responseMode'):
                errors.append("Webhook missing response mode")
        
        # Check for missing required parameters
        if not parameters and node_type != 'n8n-nodes-base.respondToWebhook':
            errors.append("Node missing parameters")
        
        return errors

    def _analyze_connections(self, nodes: List[Dict], connections: Dict) -> Dict[str, Any]:
        """Analyze workflow connections for issues"""
        connection_analysis = {
            'total_connections': 0,
            'missing_connections': [],
            'loose_nodes': [],
            'connection_flow': []
        }
        
        # Count total connections
        for source, conn_list in connections.items():
            for conn in conn_list:
                for item in conn:
                    if isinstance(item, dict) and 'node' in item:
                        connection_analysis['total_connections'] += 1
        
        # Find loose nodes (nodes without connections)
        connected_nodes = set()
        for source, conn_list in connections.items():
            for conn in conn_list:
                for item in conn:
                    if isinstance(item, dict) and 'node' in item:
                        target = item['node']
                        connected_nodes.add(target)
                        connected_nodes.add(source)
        
        # Find nodes that should be connected but aren't
        for node in nodes:
            node_id = node.get('id')
            if node_id not in connected_nodes:
                connection_analysis['loose_nodes'].append({
                    'id': node_id,
                    'name': node.get('name', 'unnamed'),
                    'type': node.get('type', 'unknown')
                })
        
        # Analyze connection flow
        if connections:
            # Find start node (webhook)
            webhook_nodes = [n for n in nodes if 'webhook' in n.get('type', '')]
            if webhook_nodes:
                start_node = webhook_nodes[0]
                connection_analysis['connection_flow'] = self._trace_connection_flow(start_node, connections)
        
        return connection_analysis

    def _trace_connection_flow(self, start_node: Dict, connections: Dict) -> List[str]:
        """Trace the connection flow from start to end"""
        flow = [start_node.get('name', 'start')]
        current_node = start_node.get('id')
        
        visited = set()
        max_iterations = 20  # Prevent infinite loops
        
        for _ in range(max_iterations):
            if current_node not in connections or current_node in visited:
                break
            
            visited.add(current_node)
            conn_list = connections[current_node]
            
            if not conn_list:
                break
            
            # Follow first connection
            for conn in conn_list:
                for item in conn:
                    if isinstance(item, dict) and 'node' in item:
                        next_node = item['node']
                        # Find node name
                        flow.append(f"-> {next_node}")
                        current_node = next_node
                        break
                break
        
        return flow

    def _identify_picard_specific_errors(self, nodes: List[Dict], connections: Dict) -> List[str]:
        """Identify errors specific to Picard workflows"""
        errors = []
        
        # Check for proper Picard workflow structure
        webhook_nodes = [n for n in nodes if 'webhook' in n.get('type', '')]
        llm_nodes = [n for n in nodes if 'httpRequest' in n.get('type', '')]
        response_nodes = [n for n in nodes if 'respondToWebhook' in n.get('type', '')]
        
        # Check workflow structure
        if len(webhook_nodes) != 1:
            errors.append(f"Expected 1 webhook node, found {len(webhook_nodes)}")
        
        if len(llm_nodes) < 1:
            errors.append("Missing LLM integration nodes")
        
        if len(response_nodes) != 1:
            errors.append(f"Expected 1 response node, found {len(response_nodes)}")
        
        # Check for memory integration
        memory_nodes = [n for n in nodes if 'Memory' in n.get('name', '')]
        if not memory_nodes:
            errors.append("Missing memory integration nodes")
        
        # Check for proper authentication in LLM nodes
        for node in llm_nodes:
            params = node.get('parameters', {})
            if not params.get('authentication'):
                errors.append(f"LLM node '{node.get('name')}' missing authentication")
        
        return errors

    def _identify_systemic_issues(self, nodes: List[Dict], connections: Dict) -> List[str]:
        """Identify systemic issues that could affect all workflows"""
        issues = []
        
        # Check for OpenRouter API configuration issues
        openrouter_nodes = [n for n in nodes if 'httpRequest' in n.get('type', '') and 
                           'api.openrouter.ai' in n.get('parameters', {}).get('url', '')]
        
        for node in openrouter_nodes:
            params = node.get('parameters', {})
            if not params.get('authentication'):
                issues.append(f"OpenRouter API call without authentication: {node.get('name')}")
            
            # Check for proper HTTP method
            method = params.get('method', 'GET')
            if method not in ['GET', 'POST']:
                issues.append(f"OpenRouter API with unexpected method {method}: {node.get('name')}")
        
        # Check for webhook configuration issues
        webhook_nodes = [n for n in nodes if 'webhook' in n.get('type', '')]
        for node in webhook_nodes:
            params = node.get('parameters', {})
            if not params.get('path'):
                issues.append(f"Webhook without path: {node.get('name')}")
        
        return issues

    def _generate_picard_recommendations(self, nodes: List[Dict], connections: Dict, errors: List[str]) -> List[str]:
        """Generate specific recommendations for Picard workflows"""
        recommendations = []
        
        if errors:
            recommendations.append("CRITICAL: Fix identified errors before proceeding")
            for error in errors:
                recommendations.append(f"  - {error}")
        
        # Check for authentication issues
        llm_nodes = [n for n in nodes if 'httpRequest' in n.get('type', '')]
        for node in llm_nodes:
            params = node.get('parameters', {})
            if not params.get('authentication'):
                recommendations.append(f"  - Add authentication to LLM node: {node.get('name')}")
        
        # Check for memory integration
        memory_nodes = [n for n in nodes if 'Memory' in n.get('name', '')]
        if not memory_nodes:
            recommendations.append("  - Add memory integration nodes for character consistency")
        
        # Check for proper webhook configuration
        webhook_nodes = [n for n in nodes if 'webhook' in n.get('type', '')]
        for node in webhook_nodes:
            params = node.get('parameters', {})
            if not params.get('path'):
                recommendations.append(f"  - Add path to webhook: {node.get('name')}")
        
        return recommendations

    def generate_error_report(self, workflow_analyses: Dict[str, Any]) -> None:
        """Generate comprehensive error report"""
        print(f"\n📊 PICARD WORKFLOW ERROR ANALYSIS REPORT")
        print("=" * 70)
        
        for filename, analysis in workflow_analyses.items():
            if 'error' in analysis:
                print(f"\n❌ {filename}: Analysis failed - {analysis['error']}")
                continue
            
            print(f"\n🔍 {filename}")
            print(f"   Workflow ID: {analysis.get('workflow_id', 'unknown')}")
            print(f"   Active: {'✅ Yes' if analysis.get('is_active') else '❌ No'}")
            print(f"   Node Count: {analysis.get('node_count', 0)}")
            
            # Display errors
            errors = analysis.get('error_patterns', [])
            if errors:
                print(f"   🚨 Errors Found: {len(errors)}")
                for error in errors:
                    print(f"      ❌ {error}")
            else:
                print(f"   ✅ No errors detected")
            
            # Display systemic issues
            systemic_issues = analysis.get('systemic_issues', [])
            if systemic_issues:
                print(f"   ⚠️  Systemic Issues: {len(systemic_issues)}")
                for issue in systemic_issues:
                    print(f"      ⚠️  {issue}")
            
            # Display recommendations
            recommendations = analysis.get('recommendations', [])
            if recommendations:
                print(f"   💡 Recommendations: {len(recommendations)}")
                for rec in recommendations:
                    print(f"      💡 {rec}")
        
        # Summary
        print(f"\n🎯 SUMMARY")
        print("=" * 70)
        
        total_workflows = len(workflow_analyses)
        workflows_with_errors = sum(1 for a in workflow_analyses.values() if 'error' not in a and a.get('error_patterns'))
        workflows_with_systemic_issues = sum(1 for a in workflow_analyses.values() if 'error' not in a and a.get('systemic_issues'))
        
        print(f"📊 Total Picard Workflows Analyzed: {total_workflows}")
        print(f"🚨 Workflows with Errors: {workflows_with_errors}")
        print(f"⚠️  Workflows with Systemic Issues: {workflows_with_systemic_issues}")
        
        if workflows_with_errors > 0 or workflows_with_systemic_issues > 0:
            print(f"\n🚨 CRITICAL: {workflows_with_errors + workflows_with_systemic_issues} workflows have issues that need immediate attention")
        else:
            print(f"\n✅ All Picard workflows are functioning correctly")

    def run_analysis(self) -> bool:
        """Run the complete Picard workflow error analysis"""
        try:
            # Find latest backup
            backup_dir = self.find_latest_backup()
            if not backup_dir:
                return False
            
            # Analyze Picard workflows
            workflow_analyses = self.analyze_picard_workflows(backup_dir)
            
            # Generate error report
            self.generate_error_report(workflow_analyses)
            
            print(f"\n🎉 Picard workflow error analysis completed successfully!")
            return True
            
        except Exception as e:
            print(f"\n❌ Analysis failed: {e}")
            return False

def main():
    """Main execution function"""
    analyzer = PicardWorkflowErrorAnalyzer()
    
    success = analyzer.run_analysis()
    
    if success:
        print("   Next: Review the error report and address identified issues")
    else:
        print("   Check the error messages above for issues")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
