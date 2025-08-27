#!/usr/bin/env python3
"""
Deep Commander Riker Workflow Analysis
Analyzes the backup workflow to identify all problematic fields causing API rejection.
"""

import json
import os
from typing import Dict, List

class DeepRikerAnalyzer:
    def __init__(self):
        self.backup_file = "n8n_renamed_workflows_backup_20250826_194915/workflows/4xHgewymk21FraDJ_Crew - Commander William Riker - Tactical Execution & Workflow Management.json"
    
    def load_and_analyze_backup(self):
        """Load and deeply analyze the backup workflow."""
        print("🔍 DEEP ANALYSIS OF COMMANDER RIKER BACKUP...")
        print("=" * 70)
        
        try:
            with open(self.backup_file, 'r') as f:
                workflow = json.load(f)
            
            print(f"✅ Loaded backup workflow successfully")
            print(f"📊 Workflow size: {len(json.dumps(workflow))} characters")
            
            # Analyze all top-level fields
            print(f"\n📋 TOP-LEVEL FIELDS ANALYSIS:")
            print("=" * 50)
            
            for field_name, field_value in workflow.items():
                field_type = type(field_value).__name__
                if isinstance(field_value, (dict, list)):
                    field_size = len(field_value)
                    print(f"   📁 {field_name}: {field_type} (size: {field_size})")
                else:
                    print(f"   📄 {field_name}: {field_type} = {field_value}")
            
            # Analyze nodes structure
            print(f"\n🔧 NODES ANALYSIS:")
            print("=" * 30)
            nodes = workflow.get('nodes', [])
            print(f"   📊 Total nodes: {len(nodes)}")
            
            for i, node in enumerate(nodes):
                node_name = node.get('name', 'Unknown')
                node_type = node.get('type', 'Unknown')
                node_id = node.get('id', 'Unknown')
                print(f"   {i+1}. {node_name} ({node_type}) - ID: {node_id}")
            
            # Analyze connections structure
            print(f"\n🔗 CONNECTIONS ANALYSIS:")
            print("=" * 35)
            connections = workflow.get('connections', {})
            print(f"   📊 Total connection sources: {len(connections)}")
            
            for source_name, targets in connections.items():
                if isinstance(targets, dict):
                    for output, connections_list in targets.items():
                        if isinstance(connections_list, list):
                            print(f"   📤 {source_name} → {output}: {len(connections_list)} connections")
            
            # Check for any non-standard fields
            print(f"\n🚨 POTENTIAL PROBLEMATIC FIELDS:")
            print("=" * 45)
            
            standard_fields = {
                'name', 'nodes', 'connections', 'settings', 'active'
            }
            
            non_standard_fields = set(workflow.keys()) - standard_fields
            if non_standard_fields:
                for field in non_standard_fields:
                    field_value = workflow[field]
                    field_type = type(field_value).__name__
                    print(f"   ⚠️  {field}: {field_type} = {field_value}")
            else:
                print("   ✅ All fields appear to be standard")
            
            # Create minimal test workflow
            print(f"\n🧪 CREATING MINIMAL TEST WORKFLOW:")
            print("=" * 45)
            
            minimal_workflow = {
                'name': workflow.get('name', ''),
                'nodes': workflow.get('nodes', []),
                'connections': workflow.get('connections', {}),
                'settings': {}
            }
            
            print(f"   📊 Minimal workflow fields: {list(minimal_workflow.keys())}")
            print(f"   📊 Minimal workflow size: {len(json.dumps(minimal_workflow))} characters")
            
            # Save minimal workflow for testing
            test_file = "riker_minimal_test_workflow.json"
            with open(test_file, 'w') as f:
                json.dump(minimal_workflow, f, indent=2)
            
            print(f"   💾 Minimal test workflow saved: {test_file}")
            
            return workflow, minimal_workflow
            
        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            return None, None

if __name__ == "__main__":
    analyzer = DeepRikerAnalyzer()
    workflow, minimal_workflow = analyzer.load_and_analyze_backup()
    
    if workflow:
        print(f"\n🎯 ANALYSIS COMPLETE!")
        print("The minimal test workflow has been created for API testing.")
    else:
        print(f"\n❌ ANALYSIS FAILED!")
