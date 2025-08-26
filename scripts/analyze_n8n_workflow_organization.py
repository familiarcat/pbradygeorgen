#!/usr/bin/env python3
"""
N8N Workflow Organization Analysis Script
Analyzes deployed workflows for inconsistencies, loose nodes, and systemic issues
"""

import os
import json
import sys
from pathlib import Path
from typing import Dict, Any, List, Set
from collections import defaultdict, Counter

class N8NWorkflowAnalyzer:
    def __init__(self):
        self.workspace_dir = Path.cwd()
        self.backup_dir = self.workspace_dir / "n8n_deployed_backup"
        self.analysis_results = {}
        
        print("🔍 N8N WORKFLOW ORGANIZATION ANALYSIS")
        print("=" * 60)

    def find_latest_backup(self) -> Path:
        """Find the most recent backup directory"""
        if not self.backup_dir.exists():
            print("❌ No backup directory found")
            return None
        
        backup_dirs = [d for d in self.backup_dir.iterdir() if d.is_dir() and d.name.startswith("backup_")]
        if not backup_dirs:
            print("❌ No backup directories found")
            return None
        
        # Sort by timestamp and get latest
        latest_backup = sorted(backup_dirs, key=lambda x: x.name)[-1]
        print(f"📁 Using latest backup: {latest_backup.name}")
        return latest_backup

    def load_backup_summary(self, backup_dir: Path) -> Dict[str, Any]:
        """Load the backup summary file"""
        summary_file = backup_dir / "backup_summary.json"
        if not summary_file.exists():
            print(f"❌ Backup summary not found: {summary_file}")
            return {}
        
        with open(summary_file, 'r') as f:
            return json.load(f)

    def analyze_workflow_structure(self, workflow_file: Path) -> Dict[str, Any]:
        """Analyze the structure of a single workflow"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            workflow = workflow_data.get('workflow_data', {})
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            # Analyze node types and patterns
            node_types = Counter(node.get('type') for node in nodes)
            node_names = [node.get('name', 'unnamed') for node in nodes]
            
            # Analyze connections
            connection_count = sum(len(conns) for conns in connections.values())
            
            # Check for loose nodes (nodes without connections)
            connected_nodes = set()
            for conn_list in connections.values():
                for conn in conn_list:
                    for item in conn:
                        if isinstance(item, dict) and 'node' in item:
                            connected_nodes.add(item['node'])
            
            loose_nodes = [node.get('name') for node in nodes if node.get('id') not in connected_nodes]
            
            # Check for memory integration
            has_memory_nodes = any('Memory' in str(node) for node in nodes)
            memory_node_count = sum(1 for node in nodes if 'Memory' in str(node))
            
            # Check for LLM integration
            has_llm_nodes = any('httpRequest' in node.get('type', '') for node in nodes)
            llm_node_count = sum(1 for node in nodes if 'httpRequest' in node.get('type', ''))
            
            # Check for webhook triggers
            has_webhook = any('webhook' in node.get('type', '') for node in nodes)
            
            return {
                'node_count': len(nodes),
                'node_types': dict(node_types),
                'node_names': node_names,
                'connection_count': connection_count,
                'loose_nodes': loose_nodes,
                'has_memory_nodes': has_memory_nodes,
                'memory_node_count': memory_node_count,
                'has_llm_nodes': has_llm_nodes,
                'llm_node_count': llm_node_count,
                'has_webhook': has_webhook,
                'is_linear': self._is_linear_workflow(nodes, connections),
                'has_branches': self._has_branches(connections),
                'error_prone_patterns': self._identify_error_patterns(nodes, connections)
            }
            
        except Exception as e:
            print(f"   ❌ Error analyzing {workflow_file.name}: {e}")
            return {}

    def _is_linear_workflow(self, nodes: List[Dict], connections: Dict) -> bool:
        """Check if workflow is linear (no branches or loops)"""
        if len(nodes) <= 1:
            return True
        
        # Count incoming and outgoing connections per node
        node_connections = defaultdict(lambda: {'in': 0, 'out': 0})
        
        for source, conn_list in connections.items():
            for conn in conn_list:
                for item in conn:
                    if isinstance(item, dict) and 'node' in item:
                        target = item['node']
                        node_connections[source]['out'] += 1
                        node_connections[target]['in'] += 1
        
        # Linear workflow should have one start (0 in, 1 out), one end (1 in, 0 out), and rest (1 in, 1 out)
        start_nodes = sum(1 for conns in node_connections.values() if conns['in'] == 0 and conns['out'] == 1)
        end_nodes = sum(1 for conns in node_connections.values() if conns['in'] == 1 and conns['out'] == 0)
        middle_nodes = sum(1 for conns in node_connections.values() if conns['in'] == 1 and conns['out'] == 1)
        
        return start_nodes == 1 and end_nodes == 1 and middle_nodes == len(nodes) - 2

    def _has_branches(self, connections: Dict) -> bool:
        """Check if workflow has branching logic"""
        for source, conn_list in connections.items():
            if len(conn_list) > 1:
                return True
            for conn in conn_list:
                if len(conn) > 1:
                    return True
        return False

    def _identify_error_patterns(self, nodes: List[Dict], connections: Dict) -> List[str]:
        """Identify patterns that commonly cause errors"""
        patterns = []
        
        # Check for nodes without proper authentication
        for node in nodes:
            if node.get('type') == 'n8n-nodes-base.httpRequest':
                params = node.get('parameters', {})
                if not params.get('authentication'):
                    patterns.append(f"HTTP Request without authentication: {node.get('name')}")
        
        # Check for missing required parameters
        for node in nodes:
            if node.get('type') == 'n8n-nodes-base.webhook':
                params = node.get('parameters', {})
                if not params.get('path'):
                    patterns.append(f"Webhook without path: {node.get('name')}")
        
        # Check for potential infinite loops
        if len(nodes) > 0 and len(connections) == 0:
            patterns.append("Workflow with nodes but no connections")
        
        return patterns

    def analyze_crew_workflow_consistency(self, workflows: List[Dict]) -> Dict[str, Any]:
        """Analyze consistency across crew member workflows"""
        crew_workflows = [w for w in workflows if any(crew_name in w.get('name', '') for crew_name in [
            'Captain Jean-Luc Picard', 'Commander William Riker', 'Dr. Beverly Crusher',
            'Commander Data', 'Lieutenant Commander Geordi La Forge', 'Lieutenant Worf',
            'Lieutenant Uhura', 'Counselor Deanna Troi', 'Quark'
        ])]
        
        # Group by crew member
        crew_groups = defaultdict(list)
        for workflow in crew_workflows:
            for crew_name in ['Captain Jean-Luc Picard', 'Commander William Riker', 'Dr. Beverly Crusher',
                            'Commander Data', 'Lieutenant Commander Geordi La Forge', 'Lieutenant Worf',
                            'Lieutenant Uhura', 'Counselor Deanna Troi', 'Quark']:
                if crew_name in workflow.get('name', ''):
                    crew_groups[crew_name].append(workflow)
                    break
        
        consistency_analysis = {}
        for crew_name, crew_workflows in crew_groups.items():
            if len(crew_workflows) == 0:
                continue
                
            # Analyze consistency within crew member workflows
            node_counts = [w.get('node_count', 0) for w in crew_workflows]
            memory_integration = [w.get('has_memory_nodes', False) for w in crew_workflows]
            llm_integration = [w.get('has_llm_nodes', False) for w in crew_workflows]
            
            consistency_analysis[crew_name] = {
                'workflow_count': len(crew_workflows),
                'node_count_variance': max(node_counts) - min(node_counts) if node_counts else 0,
                'memory_integration_consistent': len(set(memory_integration)) == 1,
                'llm_integration_consistent': len(set(llm_integration)) == 1,
                'has_duplicates': len(crew_workflows) > 1,
                'duplicate_workflows': [w.get('id') for w in crew_workflows]
            }
        
        return consistency_analysis

    def identify_systemic_issues(self, workflows: List[Dict]) -> List[str]:
        """Identify systemic issues across all workflows"""
        issues = []
        
        # Check for common error patterns
        error_patterns = Counter()
        for workflow in workflows:
            patterns = workflow.get('error_prone_patterns', [])
            for pattern in patterns:
                error_patterns[pattern] += 1
        
        # Report common issues
        for pattern, count in error_patterns.most_common():
            if count > 1:
                issues.append(f"Systemic issue: {pattern} (affects {count} workflows)")
        
        # Check for authentication issues
        workflows_without_auth = [w for w in workflows if w.get('has_llm_nodes') and not w.get('has_webhook')]
        if len(workflows_without_auth) > 0:
            issues.append(f"Authentication issue: {len(workflows_without_auth)} workflows may lack proper authentication")
        
        # Check for memory integration inconsistencies
        workflows_with_memory = [w for w in workflows if w.get('has_memory_nodes')]
        workflows_without_memory = [w for w in workflows if not w.get('has_memory_nodes')]
        
        if len(workflows_with_memory) > 0 and len(workflows_without_memory) > 0:
            issues.append(f"Memory integration inconsistency: {len(workflows_with_memory)} workflows have memory, {len(workflows_without_memory)} don't")
        
        return issues

    def generate_analysis_report(self, backup_dir: Path, summary: Dict[str, Any]) -> None:
        """Generate comprehensive analysis report"""
        print("\n🔍 ANALYZING WORKFLOW ORGANIZATION...")
        
        workflows = summary.get('workflows', [])
        if not workflows:
            print("❌ No workflows found to analyze")
            return
        
        # Analyze each workflow
        print(f"\n📊 Analyzing {len(workflows)} workflows...")
        workflow_analyses = {}
        
        for workflow_info in workflows:
            workflow_id = workflow_info.get('id')
            workflow_name = workflow_info.get('name')
            backup_filename = workflow_info.get('backup_filename')
            
            if not backup_filename:
                continue
                
            workflow_file = backup_dir / backup_filename
            if workflow_file.exists():
                print(f"   🔍 Analyzing: {workflow_name}")
                analysis = self.analyze_workflow_structure(workflow_file)
                workflow_analyses[workflow_id] = analysis
                
                # Update workflow info with analysis
                workflow_info.update(analysis)
        
        # Analyze crew consistency
        print(f"\n👥 Analyzing crew workflow consistency...")
        crew_consistency = self.analyze_crew_workflow_consistency(workflows)
        
        # Identify systemic issues
        print(f"\n⚠️  Identifying systemic issues...")
        systemic_issues = self.identify_systemic_issues(workflows)
        
        # Generate summary statistics
        total_nodes = sum(w.get('node_count', 0) for w in workflows)
        workflows_with_memory = sum(1 for w in workflows if w.get('has_memory_nodes'))
        workflows_with_llm = sum(1 for w in workflows if w.get('has_llm_nodes'))
        workflows_with_webhooks = sum(1 for w in workflows if w.get('has_webhook'))
        loose_nodes_total = sum(len(w.get('loose_nodes', [])) for w in workflows)
        
        # Create comprehensive report
        report = {
            "analysis_metadata": {
                "total_workflows": len(workflows),
                "total_nodes": total_nodes,
                "workflows_with_memory": workflows_with_memory,
                "workflows_with_llm": workflows_with_llm,
                "workflows_with_webhooks": workflows_with_webhooks,
                "total_loose_nodes": loose_nodes_total
            },
            "workflow_analyses": workflow_analyses,
            "crew_consistency": crew_consistency,
            "systemic_issues": systemic_issues,
            "recommendations": self._generate_recommendations(workflows, crew_consistency, systemic_issues)
        }
        
        # Save report
        report_file = backup_dir / "workflow_organization_analysis.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Analysis report saved: {report_file}")
        
        # Display key findings
        self._display_key_findings(report)

    def _generate_recommendations(self, workflows: List[Dict], crew_consistency: Dict, systemic_issues: List[str]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Address systemic issues
        if systemic_issues:
            recommendations.append("CRITICAL: Address systemic issues before proceeding with any changes")
            for issue in systemic_issues:
                recommendations.append(f"  - {issue}")
        
        # Address crew consistency issues
        for crew_name, analysis in crew_consistency.items():
            if analysis.get('has_duplicates'):
                recommendations.append(f"  - {crew_name}: Remove duplicate workflows to maintain consistency")
            if not analysis.get('memory_integration_consistent'):
                recommendations.append(f"  - {crew_name}: Standardize memory integration across workflows")
            if not analysis.get('llm_integration_consistent'):
                recommendations.append(f"  - {crew_name}: Standardize LLM integration across workflows")
        
        # Address loose nodes
        loose_nodes_total = sum(len(w.get('loose_nodes', [])) for w in workflows)
        if loose_nodes_total > 0:
            recommendations.append(f"  - Remove or connect {loose_nodes_total} loose nodes across workflows")
        
        # Address authentication issues
        workflows_without_auth = [w for w in workflows if w.get('has_llm_nodes') and not w.get('has_webhook')]
        if workflows_without_auth:
            recommendations.append(f"  - Review authentication for {len(workflows_without_auth)} LLM-integrated workflows")
        
        return recommendations

    def _display_key_findings(self, report: Dict[str, Any]) -> None:
        """Display key findings from the analysis"""
        print(f"\n🎯 KEY FINDINGS")
        print("=" * 60)
        
        metadata = report.get('analysis_metadata', {})
        print(f"📊 Total Workflows: {metadata.get('total_workflows', 0)}")
        print(f"🔧 Total Nodes: {metadata.get('total_nodes', 0)}")
        print(f"🧠 Workflows with Memory: {metadata.get('workflows_with_memory', 0)}")
        print(f"🤖 Workflows with LLM: {metadata.get('workflows_with_llm', 0)}")
        print(f"🔗 Workflows with Webhooks: {metadata.get('workflows_with_webhooks', 0)}")
        print(f"⚠️  Total Loose Nodes: {metadata.get('total_loose_nodes', 0)}")
        
        # Display systemic issues
        systemic_issues = report.get('systemic_issues', [])
        if systemic_issues:
            print(f"\n🚨 SYSTEMIC ISSUES FOUND:")
            for issue in systemic_issues:
                print(f"   ❌ {issue}")
        else:
            print(f"\n✅ No systemic issues detected")
        
        # Display crew consistency issues
        crew_consistency = report.get('crew_consistency', {})
        print(f"\n👥 CREW CONSISTENCY ANALYSIS:")
        for crew_name, analysis in crew_consistency.items():
            status = "✅" if not analysis.get('has_duplicates') else "⚠️"
            print(f"   {status} {crew_name}: {analysis.get('workflow_count', 0)} workflows")
            if analysis.get('has_duplicates'):
                print(f"      ⚠️  Duplicates detected: {len(analysis.get('duplicate_workflows', []))}")
        
        # Display recommendations
        recommendations = report.get('recommendations', [])
        if recommendations:
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in recommendations:
                print(f"   {rec}")

    def run_analysis(self) -> bool:
        """Run the complete workflow organization analysis"""
        try:
            # Find latest backup
            backup_dir = self.find_latest_backup()
            if not backup_dir:
                return False
            
            # Load backup summary
            summary = self.load_backup_summary(backup_dir)
            if not summary:
                return False
            
            # Generate analysis report
            self.generate_analysis_report(backup_dir, summary)
            
            print(f"\n🎉 Workflow organization analysis completed successfully!")
            return True
            
        except Exception as e:
            print(f"\n❌ Analysis failed: {e}")
            return False

def main():
    """Main execution function"""
    analyzer = N8NWorkflowAnalyzer()
    
    success = analyzer.run_analysis()
    
    if success:
        print("   Next: Review the analysis report for workflow inconsistencies")
    else:
        print("   Check the error messages above for issues")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
