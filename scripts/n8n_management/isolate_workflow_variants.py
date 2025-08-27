#!/usr/bin/env python3
"""
Workflow Variant Isolator
Comprehensive analysis of all n8n workflow variants to identify patterns and issues
before applying systematic fixes.
"""

import json
import requests
import os
from typing import Dict, List, Tuple, Any
from datetime import datetime
from collections import defaultdict

class WorkflowVariantIsolator:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Store analysis results
        self.all_workflows = []
        self.variant_categories = defaultdict(list)
        self.variant_analysis = {}
        self.priority_ranking = []
        
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
    
    def categorize_workflows(self, workflows: List[Dict]):
        """Categorize workflows by type and structure."""
        print("\n🔍 CATEGORIZING WORKFLOW VARIANTS...")
        print("=" * 60)
        
        for workflow in workflows:
            name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            active = workflow.get('active', False)
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            # Basic workflow info
            workflow_info = {
                'id': workflow_id,
                'name': name,
                'active': active,
                'node_count': len(nodes),
                'connection_count': len(connections) if isinstance(connections, dict) else 0,
                'workflow': workflow
            }
            
            # Categorize by name prefix
            if name.startswith('Crew -'):
                self.variant_categories['crew_workflows'].append(workflow_info)
            elif name.startswith('System -'):
                self.variant_categories['system_workflows'].append(workflow_info)
            else:
                self.variant_categories['other_workflows'].append(workflow_info)
        
        # Print categorization results
        for category, workflows in self.variant_categories.items():
            print(f"   📁 {category.replace('_', ' ').title()}: {len(workflows)} workflows")
            
            # Show active/inactive breakdown
            active_count = sum(1 for w in workflows if w['active'])
            inactive_count = len(workflows) - active_count
            print(f"      Active: {active_count}, Inactive: {inactive_count}")
    
    def analyze_crew_workflow_variants(self):
        """Analyze crew workflow variants in detail."""
        print(f"\n🔬 ANALYZING CREW WORKFLOW VARIANTS...")
        print("=" * 60)
        
        crew_workflows = self.variant_categories['crew_workflows']
        
        if not crew_workflows:
            print("   ⚠️  No crew workflows found!")
            return
        
        # Group by node count
        node_count_groups = defaultdict(list)
        for workflow in crew_workflows:
            node_count = workflow['node_count']
            node_count_groups[node_count].append(workflow)
        
        print(f"   📊 Node count distribution:")
        for node_count in sorted(node_count_groups.keys()):
            workflows = node_count_groups[node_count]
            print(f"      {node_count} nodes: {len(workflows)} workflows")
            
            # Show workflow names in each group
            for workflow in workflows:
                status = "🟢 ACTIVE" if workflow['active'] else "🔴 INACTIVE"
                print(f"         - {workflow['name']} ({status})")
        
        # Analyze each variant group
        for node_count, workflows in node_count_groups.items():
            print(f"\n   🔍 Analyzing {node_count}-node workflows:")
            
            for workflow in workflows:
                variant_analysis = self.analyze_single_workflow(workflow)
                self.variant_analysis[workflow['id']] = variant_analysis
                
                # Print summary
                print(f"      📋 {workflow['name']}:")
                print(f"         Status: {'🟢 ACTIVE' if workflow['active'] else '🔴 INACTIVE'}")
                print(f"         Connections: {workflow['connection_count']}")
                print(f"         Issues: {len(variant_analysis['issues'])}")
                
                if variant_analysis['issues']:
                    for issue in variant_analysis['issues'][:3]:  # Show first 3 issues
                        print(f"            - {issue}")
    
    def analyze_single_workflow(self, workflow_info: Dict) -> Dict:
        """Analyze a single workflow for issues and patterns."""
        workflow = workflow_info['workflow']
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        analysis = {
            'workflow_id': workflow_info['id'],
            'workflow_name': workflow_info['name'],
            'node_count': workflow_info['node_count'],
            'connection_count': workflow_info['connection_count'],
            'active': workflow_info['active'],
            'issues': [],
            'strengths': [],
            'node_analysis': [],
            'connection_analysis': {},
            'fix_priority': 'LOW',
            'fix_complexity': 'SIMPLE'
        }
        
        # Analyze nodes
        for i, node in enumerate(nodes):
            node_analysis = {
                'index': i + 1,
                'name': node.get('name', ''),
                'type': node.get('type', ''),
                'role': self.determine_node_role(node.get('name', ''), node.get('type', '')),
                'has_parameters': bool(node.get('parameters', {})),
                'webhook_id': node.get('webhookId', ''),
                'position': node.get('position', {})
            }
            analysis['node_analysis'].append(node_analysis)
        
        # Analyze connections
        if isinstance(connections, dict):
            connection_count = 0
            for source_id, targets in connections.items():
                if isinstance(targets, dict):
                    for output, connections_list in targets.items():
                        if isinstance(connections_list, list):
                            connection_count += len(connections_list)
            
            analysis['connection_analysis'] = {
                'total_connections': connection_count,
                'connection_structure': 'VALID' if connection_count > 0 else 'EMPTY'
            }
        else:
            analysis['connection_analysis'] = {
                'total_connections': 0,
                'connection_structure': 'INVALID'
            }
        
        # Identify issues
        issues = []
        strengths = []
        
        # Check node count
        if workflow_info['node_count'] != 7:
            issues.append(f"Node count mismatch: {workflow_info['node_count']} nodes (expected 7)")
        else:
            strengths.append("Correct node count (7 nodes)")
        
        # Check connections
        if workflow_info['connection_count'] == 0:
            issues.append("No connections detected - workflow may be broken")
        else:
            strengths.append(f"Has {workflow_info['connection_count']} connections")
        
        # Check for essential node types
        node_types = [node.get('type', '') for node in nodes]
        essential_types = ['n8n-nodes-base.webhook', 'n8n-nodes-base.httpRequest', 'n8n-nodes-base.respondToWebhook']
        
        missing_types = []
        for essential_type in essential_types:
            if essential_type not in node_types:
                missing_types.append(essential_type)
        
        if missing_types:
            issues.append(f"Missing essential node types: {', '.join(missing_types)}")
        else:
            strengths.append("All essential node types present")
        
        # Check for memory integration
        has_memory_nodes = any('memory' in node.get('name', '').lower() for node in nodes)
        if not has_memory_nodes:
            issues.append("No memory integration nodes detected")
        else:
            strengths.append("Memory integration nodes present")
        
        # Check for LLM integration
        has_llm_nodes = any('llm' in node.get('name', '').lower() for node in nodes)
        if not has_llm_nodes:
            issues.append("No LLM integration nodes detected")
        else:
            strengths.append("LLM integration nodes present")
        
        # Determine fix priority and complexity
        if len(issues) >= 5:
            analysis['fix_priority'] = 'HIGH'
            analysis['fix_complexity'] = 'COMPLEX'
        elif len(issues) >= 3:
            analysis['fix_priority'] = 'MEDIUM'
            analysis['fix_complexity'] = 'MODERATE'
        else:
            analysis['fix_priority'] = 'LOW'
            analysis['fix_complexity'] = 'SIMPLE'
        
        analysis['issues'] = issues
        analysis['strengths'] = strengths
        
        return analysis
    
    def determine_node_role(self, node_name: str, node_type: str) -> str:
        """Determine the role of a node based on its name and type."""
        if 'webhook' in node_type.lower():
            return "🚀 INPUT TRIGGER"
        elif 'memory' in node_name.lower() and 'retrieval' in node_name.lower():
            return "📚 MEMORY RETRIEVAL"
        elif 'llm' in node_name.lower() and 'selection' in node_name.lower():
            return "🤖 LLM SELECTION"
        elif 'ai agent' in node_name.lower():
            return "🧠 AI PROCESSING"
        elif 'communication' in node_name.lower():
            return "💬 COMMUNICATION"
        elif 'memory' in node_name.lower() and 'storage' in node_name.lower():
            return "💾 MEMORY STORAGE"
        elif 'response' in node_name.lower():
            return "📤 FINAL OUTPUT"
        else:
            return "🔧 UNKNOWN"
    
    def generate_priority_ranking(self):
        """Generate priority ranking for fixing workflows."""
        print(f"\n📊 GENERATING PRIORITY RANKING...")
        print("=" * 50)
        
        crew_workflows = self.variant_categories['crew_workflows']
        
        # Sort by priority and complexity
        priority_order = {'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
        complexity_order = {'COMPLEX': 3, 'MODERATE': 2, 'SIMPLE': 1}
        
        ranked_workflows = []
        for workflow in crew_workflows:
            analysis = self.variant_analysis.get(workflow['id'], {})
            priority_score = priority_order.get(analysis.get('fix_priority', 'LOW'), 1)
            complexity_score = complexity_order.get(analysis.get('fix_complexity', 'SIMPLE'), 1)
            
            # Calculate overall score (priority * complexity)
            overall_score = priority_score * complexity_score
            
            ranked_workflows.append({
                'workflow': workflow,
                'analysis': analysis,
                'priority_score': priority_score,
                'complexity_score': complexity_score,
                'overall_score': overall_score
            })
        
        # Sort by overall score (highest first)
        ranked_workflows.sort(key=lambda x: x['overall_score'], reverse=True)
        
        print(f"   🎯 Priority ranking (highest to lowest):")
        for i, ranked in enumerate(ranked_workflows, 1):
            workflow = ranked['workflow']
            analysis = ranked['analysis']
            
            priority_emoji = {'HIGH': '🔴', 'MEDIUM': '🟡', 'LOW': '🟢'}
            complexity_emoji = {'COMPLEX': '🔴', 'MODERATE': '🟡', 'SIMPLE': '🟢'}
            
            print(f"      {i}. {workflow['name']}")
            print(f"         Priority: {priority_emoji.get(analysis.get('fix_priority', 'LOW'))} {analysis.get('fix_priority', 'LOW')}")
            print(f"         Complexity: {complexity_emoji.get(analysis.get('fix_complexity', 'SIMPLE'))} {analysis.get('fix_complexity', 'SIMPLE')}")
            print(f"         Issues: {len(analysis.get('issues', []))}")
            print(f"         Score: {ranked['overall_score']}")
        
        self.priority_ranking = ranked_workflows
        return ranked_workflows
    
    def generate_detailed_fix_plan(self):
        """Generate detailed fix plan for each workflow variant."""
        print(f"\n📋 GENERATING DETAILED FIX PLAN...")
        print("=" * 55)
        
        if not self.priority_ranking:
            print("   ⚠️  No priority ranking available. Run priority ranking first.")
            return
        
        fix_plan = {}
        
        for ranked in self.priority_ranking:
            workflow = ranked['workflow']
            analysis = ranked['analysis']
            
            workflow_id = workflow['id']
            workflow_name = workflow['name']
            
            print(f"\n   🔧 {workflow_name} (Priority: {analysis.get('fix_priority', 'LOW')}):")
            
            # Generate specific fix steps
            fix_steps = []
            
            # Fix node count issues
            if analysis.get('node_count', 0) != 7:
                fix_steps.append(f"Restore to 7-node structure (currently {analysis.get('node_count', 0)} nodes)")
            
            # Fix connection issues
            if analysis.get('connection_count', 0) == 0:
                fix_steps.append("Restore node connections following optimal pattern")
            
            # Fix missing node types
            node_types = [node.get('type', '') for node in analysis.get('node_analysis', [])]
            essential_types = ['n8n-nodes-base.webhook', 'n8n-nodes-base.httpRequest', 'n8n-nodes-base.respondToWebhook']
            
            missing_types = [t for t in essential_types if t not in node_types]
            if missing_types:
                fix_steps.append(f"Add missing node types: {', '.join(missing_types)}")
            
            # Fix memory integration
            if not any('memory' in node.get('name', '').lower() for node in analysis.get('node_analysis', [])):
                fix_steps.append("Add memory integration nodes (retrieval and storage)")
            
            # Fix LLM integration
            if not any('llm' in node.get('name', '').lower() for node in analysis.get('node_analysis', [])):
                fix_steps.append("Add LLM integration nodes")
            
            # Add general fixes
            fix_steps.append("Update webhook path to be crew-specific")
            fix_steps.append("Verify all node parameters match optimal template")
            fix_steps.append("Test workflow functionality after fixes")
            
            # Print fix steps
            for i, step in enumerate(fix_steps, 1):
                print(f"         {i}. {step}")
            
            fix_plan[workflow_id] = {
                'workflow_name': workflow_name,
                'priority': analysis.get('fix_priority', 'LOW'),
                'complexity': analysis.get('fix_complexity', 'SIMPLE'),
                'issues': analysis.get('issues', []),
                'fix_steps': fix_steps
            }
        
        return fix_plan
    
    def save_analysis_report(self):
        """Save comprehensive analysis report to file."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_filename = f"workflow_variant_analysis_report_{timestamp}.json"
        
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_workflows': len(self.all_workflows),
                'crew_workflows': len(self.variant_categories['crew_workflows']),
                'system_workflows': len(self.variant_categories['system_workflows']),
                'other_workflows': len(self.variant_categories['other_workflows'])
            },
            'variant_categories': dict(self.variant_categories),
            'variant_analysis': self.variant_analysis,
            'priority_ranking': [
                {
                    'workflow_id': ranked['workflow']['id'],
                    'workflow_name': ranked['workflow']['name'],
                    'priority_score': ranked['priority_score'],
                    'complexity_score': ranked['complexity_score'],
                    'overall_score': ranked['overall_score']
                }
                for ranked in self.priority_ranking
            ]
        }
        
        with open(report_filename, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Analysis report saved: {report_filename}")
        return report_filename
    
    def run_complete_analysis(self):
        """Run the complete workflow variant isolation and analysis."""
        print("🔍 WORKFLOW VARIANT ISOLATION AND ANALYSIS")
        print("=" * 80)
        
        # Step 1: Fetch all workflows
        print("📡 Step 1: Fetching all workflows from n8n...")
        self.all_workflows = self.fetch_all_workflows()
        
        if not self.all_workflows:
            print("❌ Failed to fetch workflows!")
            return False
        
        # Step 2: Categorize workflows
        print("\n🔍 Step 2: Categorizing workflow variants...")
        self.categorize_workflows(self.all_workflows)
        
        # Step 3: Analyze crew workflow variants
        print("\n🔍 Step 3: Analyzing crew workflow variants...")
        self.analyze_crew_workflow_variants()
        
        # Step 4: Generate priority ranking
        print("\n🔍 Step 4: Generating priority ranking...")
        self.generate_priority_ranking()
        
        # Step 5: Generate detailed fix plan
        print("\n🔍 Step 5: Generating detailed fix plan...")
        fix_plan = self.generate_detailed_fix_plan()
        
        # Step 6: Save analysis report
        print("\n🔍 Step 6: Saving analysis report...")
        report_filename = self.save_analysis_report()
        
        # Final summary
        print(f"\n📊 WORKFLOW VARIANT ANALYSIS COMPLETE!")
        print("=" * 60)
        
        crew_workflows = self.variant_categories['crew_workflows']
        high_priority = sum(1 for ranked in self.priority_ranking if ranked['analysis'].get('fix_priority') == 'HIGH')
        medium_priority = sum(1 for ranked in self.priority_ranking if ranked['analysis'].get('fix_priority') == 'MEDIUM')
        low_priority = sum(1 for ranked in self.priority_ranking if ranked['analysis'].get('fix_priority') == 'LOW')
        
        print(f"   📁 Total workflows analyzed: {len(self.all_workflows)}")
        print(f"   👥 Crew workflows: {len(crew_workflows)}")
        print(f"   🔴 High priority fixes needed: {high_priority}")
        print(f"   🟡 Medium priority fixes needed: {medium_priority}")
        print(f"   🟢 Low priority fixes needed: {low_priority}")
        print(f"   📄 Detailed report: {report_filename}")
        
        return True

if __name__ == "__main__":
    try:
        isolator = WorkflowVariantIsolator()
        success = isolator.run_complete_analysis()
        
        if success:
            print(f"\n🎯 Workflow variant isolation complete! Check the generated report for details.")
        else:
            print(f"\n❌ Workflow variant isolation failed!")
            
    except Exception as e:
        print(f"❌ Workflow variant isolation failed: {e}")
