#!/usr/bin/env python3
"""
N8N Workflow Restore Script
Restores workflows from backup created on 2025-08-26 06:30:37
"""

import os
import json
import sys
import requests
from pathlib import Path

def load_environment_variables():
    """Load environment variables from ~/.zshrc"""
    try:
        zshrc_path = os.path.expanduser("~/.zshrc")
        if os.path.exists(zshrc_path):
            with open(zshrc_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            for line in lines:
                if line.startswith('export ') and '=' in line:
                    key, value = line.replace('export ', '').split('=', 1)
                    os.environ[key] = value.strip('"')
                    
    except Exception as e:
        print(f"Warning: Could not load ~/.zshrc: {e}")

def restore_workflows():
    """Restore workflows from backup"""
    # Load environment variables
    load_environment_variables()
    
    # Configuration
    n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    headers = {
        'Content-Type': 'application/json',
        'X-N8N-API-Key': n8n_api_key or 'n8n_api_key_placeholder'
    }
    
    # Get backup directory
    backup_dir = Path(__file__).parent
    
    print("🔄 N8N WORKFLOW RESTORE")
    print("=" * 40)
    
    # Load backup summary
    summary_file = backup_dir / "backup_summary.json"
    if not summary_file.exists():
        print("❌ Backup summary not found")
        return False
    
    with open(summary_file, 'r') as f:
        summary = json.load(f)
    
    print(f"📋 Found {len(summary['workflows'])} workflows to restore")
    
    successful_restores = 0
    
    for workflow_info in summary['workflows']:
        workflow_file = backup_dir / workflow_info['backup_filename']
        
        if not workflow_file.exists():
            print(f"⚠️  Workflow file not found: {workflow_info['backup_filename']}")
            continue
        
        try:
            with open(workflow_file, 'r') as f:
                backup_data = json.load(f)
            
            workflow_data = backup_data['workflow_data']
            workflow_id = workflow_data.get('id')
            workflow_name = workflow_data.get('name')
            
            print(f"🔄 Restoring: {workflow_name}")
            
            # Prepare workflow for deployment (remove read-only fields)
            deployment_data = {
                'name': workflow_data.get('name', ''),
                'nodes': workflow_data.get('nodes', []),
                'connections': workflow_data.get('connections', {}),
                'settings': workflow_data.get('settings', {})
            }
            
            # Check if workflow exists
            response = requests.get(f"{n8n_url}/api/v1/workflows/{workflow_id}", headers=headers, timeout=10)
            
            if response.status_code == 200:
                # Update existing workflow
                response = requests.put(
                    f"{n8n_url}/api/v1/workflows/{workflow_id}",
                    headers=headers,
                    json=deployment_data,
                    timeout=30
                )
            else:
                # Create new workflow
                response = requests.post(
                    f"{n8n_url}/api/v1/workflows",
                    headers=headers,
                    json=deployment_data,
                    timeout=30
                )
            
            if response.status_code in [200, 201]:
                print(f"   ✅ Restored: {workflow_name}")
                successful_restores += 1
            else:
                print(f"   ❌ Failed to restore {workflow_name}: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error restoring {workflow_info.get('name', 'unknown')}: {e}")
    
    print(f"\n📊 Restore Results: {successful_restores}/{len(summary['workflows'])} workflows restored")
    
    if successful_restores == len(summary['workflows']):
        print("✅ All workflows restored successfully")
        return True
    else:
        print("⚠️  Some workflows failed to restore")
        return False

if __name__ == "__main__":
    success = restore_workflows()
    sys.exit(0 if success else 1)
