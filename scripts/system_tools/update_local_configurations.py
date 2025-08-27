#!/usr/bin/env python3
"""
Update Local Configurations Script
Updates local configuration files to use the new naming conventions from the remote n8n instance.
"""

import json
import os
from typing import Dict, List
from datetime import datetime

class LocalConfigurationUpdater:
    def __init__(self):
        self.new_naming_conventions = {
            'picard': 'Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command',
            'riker': 'Crew - Commander William Riker - Tactical Execution & Workflow Management',
            'crusher': 'Crew - Dr. Beverly Crusher - Health & Diagnostics Officer',
            'data': 'Crew - Commander Data - Analytics & Logic Operations',
            'geordi': 'Crew - Lieutenant Commander Geordi La Forge - Infrastructure & System Integration',
            'worf': 'Crew - Lieutenant Worf - Security & Compliance Operations',
            'troi': 'Crew - Counselor Deanna Troi - User Experience & Empathy Analysis',
            'uhura': 'Crew - Lieutenant Uhura - Communications & I/O Operations Officer',
            'quark': 'Crew - Quark - Business Intelligence & Budget Optimization',
            'federation': 'System - Enhanced Federation Crew - Complete Mission Control',
            'alexai': 'System - AlexAI Optimized Crew - Complete Mission Control',
            'openrouter': 'System - Federation Crew - OpenRouter Agent Coordination',
            'concise': 'System - Federation Concise Agency - OpenRouter Crew'
        }
        
        self.old_naming_conventions = {
            'picard': 'Captain Jean-Luc Picard - Strategic Leadership & Mission Command',
            'riker': 'Commander William Riker - Tactical Execution & Workflow Management',
            'crusher': 'Dr. Beverly Crusher - Health & Diagnostics Officer',
            'data': 'Commander Data - Analytics & Logic Operations',
            'geordi': 'Lieutenant Commander Geordi La Forge - Infrastructure & System Integration',
            'worf': 'Lieutenant Worf - Security & Compliance Operations',
            'troi': 'Counselor Deanna Troi - User Experience & Empathy Analysis',
            'uhura': 'Lieutenant Uhura - Communications & I/O Operations Officer',
            'quark': 'Quark - Business Intelligence & Budget Optimization',
            'federation': 'Enhanced Federation Crew - Complete Mission Control',
            'alexai': 'AlexAI Optimized Crew - Complete Mission Control',
            'openrouter': 'Federation Crew - OpenRouter Agent Coordination',
            'concise': 'Federation Concise Agency - OpenRouter Crew'
        }
    
    def update_crew_config(self):
        """Update the main crew configuration file."""
        config_file = 'config/n8n_optimized_crew_config.json'
        
        if not os.path.exists(config_file):
            print(f"❌ Configuration file not found: {config_file}")
            return False
        
        try:
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            # Update crew member names to include new prefixes
            for crew_id, crew_data in config['crew_members'].items():
                if crew_id in self.new_naming_conventions:
                    old_name = crew_data['name']
                    new_name = self.new_naming_conventions[crew_id]
                    
                    # Update the name field
                    crew_data['name'] = new_name
                    
                    # Add a new field for the n8n workflow name
                    crew_data['n8n_workflow_name'] = new_name
                    
                    print(f"✅ Updated {crew_id}: '{old_name}' → '{new_name}'")
            
            # Add naming convention metadata
            config['naming_conventions'] = {
                'version': '2.0.0',
                'implemented_date': datetime.now().isoformat(),
                'prefix_structure': {
                    'crew': 'Crew - [FUNCTION] - [IDENTIFIER]',
                    'system': 'System - [FUNCTION] - [IDENTIFIER]'
                },
                'naming_mapping': self.new_naming_conventions
            }
            
            # Save updated configuration
            with open(config_file, 'w') as f:
                json.dump(config, f, indent=2)
            
            print(f"✅ Updated crew configuration: {config_file}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to update crew configuration: {e}")
            return False
    
    def create_naming_convention_documentation(self):
        """Create comprehensive documentation of the naming conventions."""
        doc_file = 'docs/NAMING_CONVENTIONS.md'
        
        doc_content = [
            "# N8N Workflow Naming Conventions",
            "",
            f"**Documentation Created**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "**Status**: Successfully implemented on remote n8n instance",
            "",
            "## Overview",
            "",
            "This document defines the standardized naming conventions for all n8n workflows in the AlexAI Optimized Crew system.",
            "",
            "## Naming Convention Structure",
            "",
            "### Crew Workflows",
            "Format: `Crew - [FUNCTION] - [IDENTIFIER]`",
            "",
            "| Crew ID | Function | Identifier | Full Name |",
            "|---------|----------|------------|-----------|"
        ]
        
        # Add crew workflows
        for crew_id, full_name in self.new_naming_conventions.items():
            if full_name.startswith('Crew -'):
                parts = full_name.split(' - ', 2)
                if len(parts) >= 3:
                    function = parts[1]
                    identifier = parts[2]
                    doc_content.append(f"| {crew_id} | {function} | {identifier} | {full_name} |")
        
        doc_content.extend([
            "",
            "### System Workflows",
            "Format: `System - [FUNCTION] - [IDENTIFIER]`",
            "",
            "| System ID | Function | Identifier | Full Name |",
            "|-----------|----------|------------|-----------|"
        ])
        
        # Add system workflows
        for system_id, full_name in self.new_naming_conventions.items():
            if full_name.startswith('System -'):
                parts = full_name.split(' - ', 2)
                if len(parts) >= 3:
                    function = parts[1]
                    identifier = parts[2]
                    doc_content.append(f"| {system_id} | {function} | {identifier} | {full_name} |")
        
        doc_content.extend([
            "",
            "## Implementation Details",
            "",
            "### Benefits",
            "- **Clear Visual Separation**: Easy identification of workflow types in n8n UI",
            "- **Professional Appearance**: Consistent, organized interface",
            "- **Functional Grouping**: Logical categorization by purpose",
            "- **Scalability**: Easy to add new workflows following the pattern",
            "",
            "### Migration History",
            f"- **Previous Naming**: Used descriptive names without prefixes",
            f"- **New Naming**: Implemented standardized CREW/SYSTEM prefixes",
            f"- **Migration Date**: {datetime.now().strftime('%Y-%m-%d')}",
            f"- **Migration Method**: Manual renaming in n8n UI",
            "",
            "### Future Deployments",
            "",
            "When creating new workflows, follow these naming patterns:",
            "",
            "```json",
            "{",
            '  "name": "Crew - [FUNCTION] - [IDENTIFIER]",',
            '  "tags": ["crew", "[function]", "[identifier]"]',
            "}",
            "```",
            "",
            "## Maintenance",
            "",
            "1. **Consistency Check**: Ensure all new workflows follow the convention",
            "2. **Documentation Updates**: Update this document when adding new workflows",
            "3. **Local Config Sync**: Keep local configuration files updated",
            "4. **Deployment Verification**: Verify naming after each deployment",
            ""
        ])
        
        try:
            # Ensure docs directory exists
            os.makedirs('docs', exist_ok=True)
            
            with open(doc_file, 'w') as f:
                f.write('\n'.join(doc_content))
            
            print(f"✅ Created naming convention documentation: {doc_file}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to create documentation: {e}")
            return False
    
    def create_deployment_template(self):
        """Create a deployment template using the new naming conventions."""
        template_file = 'templates/n8n_workflow_template.json'
        
        template = {
            "name": "Crew - [FUNCTION] - [IDENTIFIER]",
            "active": False,
            "nodes": [
                {
                    "parameters": {},
                    "id": "webhook-trigger",
                    "name": "Webhook Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "webhookId": "{{ $json.webhookId }}"
                }
            ],
            "connections": {},
            "pinData": {},
            "settings": {
                "executionOrder": "v1"
            },
            "staticData": {},
            "tags": ["crew", "template"],
            "triggerCount": 0,
            "updatedAt": datetime.now().isoformat(),
            "versionId": "1"
        }
        
        try:
            # Ensure templates directory exists
            os.makedirs('templates', exist_ok=True)
            
            with open(template_file, 'w') as f:
                json.dump(template, f, indent=2)
            
            print(f"✅ Created deployment template: {template_file}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to create deployment template: {e}")
            return False
    
    def update_enhanced_workflow_names(self):
        """Update the enhanced workflow files to use new naming conventions."""
        enhanced_dir = 'enhanced_crew_workflows'
        
        if not os.path.exists(enhanced_dir):
            print(f"ℹ️  Enhanced workflows directory not found: {enhanced_dir}")
            return True
        
        try:
            updated_count = 0
            
            for filename in os.listdir(enhanced_dir):
                if filename.endswith('.json'):
                    filepath = os.path.join(enhanced_dir, filename)
                    
                    with open(filepath, 'r') as f:
                        workflow = json.load(f)
                    
                    old_name = workflow.get('name', '')
                    new_name = None
                    
                    # Find matching new name
                    for crew_id, new_full_name in self.new_naming_conventions.items():
                        if crew_id in filename.lower() or crew_id in old_name.lower():
                            new_name = new_full_name
                            break
                    
                    if new_name and new_name != old_name:
                        workflow['name'] = new_name
                        
                        with open(filepath, 'w') as f:
                            json.dump(workflow, f, indent=2)
                        
                        print(f"✅ Updated enhanced workflow: '{old_name}' → '{new_name}'")
                        updated_count += 1
            
            if updated_count > 0:
                print(f"✅ Updated {updated_count} enhanced workflow files")
            else:
                print("ℹ️  No enhanced workflow files needed updating")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to update enhanced workflows: {e}")
            return False
    
    def run_updates(self):
        """Run all configuration updates."""
        print("🔄 UPDATING LOCAL CONFIGURATIONS FOR NEW NAMING CONVENTIONS...")
        print("=" * 70)
        
        success_count = 0
        total_updates = 4
        
        # Update crew configuration
        print("\n📋 Step 1: Updating crew configuration...")
        if self.update_crew_config():
            success_count += 1
        
        # Create naming convention documentation
        print("\n📚 Step 2: Creating naming convention documentation...")
        if self.create_naming_convention_documentation():
            success_count += 1
        
        # Create deployment template
        print("\n📝 Step 3: Creating deployment template...")
        if self.create_deployment_template():
            success_count += 1
        
        # Update enhanced workflow names
        print("\n🔧 Step 4: Updating enhanced workflow names...")
        if self.update_enhanced_workflow_names():
            success_count += 1
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 CONFIGURATION UPDATE SUMMARY")
        print("=" * 70)
        
        print(f"✅ Successful Updates: {success_count}/{total_updates}")
        
        if success_count == total_updates:
            print("🎉 ALL CONFIGURATIONS SUCCESSFULLY UPDATED!")
            print("\n📝 Next Steps:")
            print("1. Review updated configuration files")
            print("2. Test crew system functionality")
            print("3. Commit changes to git")
            print("4. Deploy updated configurations if needed")
        else:
            print("⚠️  Some updates failed. Please review the errors above.")
        
        return success_count == total_updates

if __name__ == "__main__":
    try:
        updater = LocalConfigurationUpdater()
        updater.run_updates()
    except Exception as e:
        print(f"❌ Configuration update failed: {e}")
