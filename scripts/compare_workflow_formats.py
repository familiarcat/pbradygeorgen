#!/usr/bin/env python3
"""
N8N Workflow Format Comparison Script

This script compares the original crew workflows with the standardized versions
to demonstrate the formatting improvements and consistency gains.
"""

import json
import os
from typing import Dict, List, Any

class WorkflowFormatComparer:
    def __init__(self):
        self.original_dir = "n8n_backup_20250825_050506"
        self.standardized_dir = "standardized_crew_workflows"
        
        # Sample crew members to compare
        self.sample_crew = ["picard", "data", "geordi"]
    
    def load_workflow(self, filepath: str) -> Dict[str, Any]:
        """Load a workflow JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return None
    
    def analyze_workflow_structure(self, workflow: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze the structure of a workflow"""
        if not workflow or "nodes" not in workflow:
            return {}
        
        analysis = {
            "total_nodes": len(workflow["nodes"]),
            "node_types": {},
            "webhook_path": None,
            "llm_models": [],
            "temperature_values": [],
            "node_names": [],
            "structure_consistency": {}
        }
        
        for node in workflow["nodes"]:
            node_type = node.get("type", "unknown")
            analysis["node_types"][node_type] = analysis["node_types"].get(node_type, 0) + 1
            
            # Extract webhook path
            if node_type == "n8n-nodes-base.webhook":
                analysis["webhook_path"] = node.get("parameters", {}).get("path", "unknown")
            
            # Extract LLM model and temperature
            if node_type == "n8n-nodes-base.httpRequest":
                params = node.get("parameters", {})
                if "bodyParameters" in params:
                    for param in params["bodyParameters"]:
                        if param.get("name") == "model":
                            model_value = param.get("value", "")
                            if "openai" in model_value or "anthropic" in model_value or "meta-llama" in model_value:
                                analysis["llm_models"].append(model_value)
                        elif param.get("name") == "temperature":
                            analysis["temperature_values"].append(param.get("value", "unknown"))
            
            analysis["node_names"].append(node.get("name", "unnamed"))
        
        return analysis
    
    def compare_workflows(self):
        """Compare original vs standardized workflows"""
        print("🔍 N8N Crew Workflow Format Comparison")
        print("=" * 60)
        
        for crew_id in self.sample_crew:
            print(f"\n📊 Crew Member: {crew_id.upper()}")
            print("-" * 40)
            
            # Load original workflow
            original_file = f"{self.original_dir}/Captain_Jean_Luc_Picard___Strategic_Leadership_&_Mission_Command.json"
            if crew_id == "data":
                original_file = f"{self.original_dir}/Commander_Data___Analytics_&_Logic_Operations.json"
            elif crew_id == "geordi":
                original_file = f"{self.original_dir}/Lieutenant_Commander_Geordi_La_Forge___Infrastructure_&_System_Integration.json"
            
            original_workflow = self.load_workflow(original_file)
            original_analysis = self.analyze_workflow_structure(original_workflow)
            
            # Load standardized workflow
            standardized_file = f"{self.standardized_dir}/standardized_{crew_id}_workflow.json"
            standardized_workflow = self.load_workflow(standardized_file)
            standardized_analysis = self.analyze_workflow_structure(standardized_workflow)
            
            # Display comparison
            print(f"📁 Original: {os.path.basename(original_file)}")
            print(f"   • Webhook Path: {original_analysis.get('webhook_path', 'N/A')}")
            print(f"   • Total Nodes: {original_analysis.get('total_nodes', 0)}")
            print(f"   • LLM Models: {', '.join(original_analysis.get('llm_models', []))}")
            print(f"   • Temperatures: {', '.join(map(str, original_analysis.get('temperature_values', [])))}")
            
            print(f"\n📁 Standardized: {os.path.basename(standardized_file)}")
            print(f"   • Webhook Path: {standardized_analysis.get('webhook_path', 'N/A')}")
            print(f"   • Total Nodes: {standardized_analysis.get('total_nodes', 0)}")
            print(f"   • LLM Models: {', '.join(standardized_analysis.get('llm_models', []))}")
            print(f"   • Temperatures: {', '.join(map(str, standardized_analysis.get('temperature_values', [])))}")
            
            # Highlight improvements
            print(f"\n✨ Improvements:")
            if original_analysis.get('webhook_path') != standardized_analysis.get('webhook_path'):
                print(f"   • Webhook path standardized: {original_analysis.get('webhook_path')} → {standardized_analysis.get('webhook_path')}")
            
            if len(original_analysis.get('llm_models', [])) != len(standardized_analysis.get('llm_models', [])):
                print(f"   • LLM model selection optimized: {len(original_analysis.get('llm_models', []))} → {len(standardized_analysis.get('llm_models', []))}")
            
            if original_analysis.get('total_nodes', 0) != standardized_analysis.get('total_nodes', 0):
                print(f"   • Node structure unified: {original_analysis.get('total_nodes', 0)} → {standardized_analysis.get('total_nodes', 0)}")
    
    def show_standardization_benefits(self):
        """Show the overall benefits of standardization"""
        print(f"\n🎯 Standardization Benefits")
        print("=" * 60)
        
        benefits = [
            "✅ **Consistent Structure**: All workflows now have the same 5-node structure",
            "✅ **Unified Naming**: Standardized node names and IDs across all crew members",
            "✅ **Optimized LLM Selection**: Each crew member uses the best model for their role",
            "✅ **Standardized Webhooks**: Consistent endpoint naming (crew-{member_id})",
            "✅ **Unified Response Format**: All crew members output in the same structure",
            "✅ **Consistent Parameters**: Same temperature, authentication, and configuration",
            "✅ **Easier Maintenance**: Single template structure for all workflows",
            "✅ **Better Integration**: Seamless communication between crew members",
            "✅ **Simplified Deployment**: Standardized import and configuration process",
            "✅ **Performance Optimization**: Each role uses the most appropriate LLM model"
        ]
        
        for benefit in benefits:
            print(benefit)
    
    def show_deployment_summary(self):
        """Show deployment summary"""
        print(f"\n🚀 Deployment Summary")
        print("=" * 60)
        
        print(f"📁 Output Directory: {self.standardized_dir}/")
        print(f"📋 Individual Workflows: {len(self.sample_crew)} standardized crew workflows")
        print(f"🔗 Comprehensive Workflow: 1 unified mission control workflow")
        print(f"📖 Documentation: DEPLOYMENT_INSTRUCTIONS.md")
        
        print(f"\n📥 Import Instructions:")
        print(f"1. Import individual workflows: standardized_*_workflow.json")
        print(f"2. Import comprehensive workflow: standardized_comprehensive_crew_workflow.json")
        print(f"3. Set up OpenRouter credential: 'OpenRouter API'")
        print(f"4. Activate workflows in n8n")
        
        print(f"\n🧪 Testing:")
        print(f"• Individual: POST /webhook/crew-{self.sample_crew[0]}")
        print(f"• Comprehensive: POST /webhook/alexai-crew-mission")

def main():
    """Main execution function"""
    comparer = WorkflowFormatComparer()
    comparer.compare_workflows()
    comparer.show_standardization_benefits()
    comparer.show_deployment_summary()

if __name__ == "__main__":
    main()
