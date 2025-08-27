#!/usr/bin/env python3
"""
Cleanup Duplicate Workflows Script
Removes older duplicate workflows to maintain clean n8n environment
"""

import requests
import json
import sys
from typing import Dict, List, Tuple
from datetime import datetime

class DuplicateWorkflowCleaner:
    def __init__(self):
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
        self.headers = {
            "X-N8N-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }

    def get_all_workflows(self) -> List[Dict]:
        """Get all workflows from n8n"""
        try:
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json().get("data", [])
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []

    def find_duplicates(self, workflows: List[Dict]) -> Dict[str, List[Dict]]:
        """Find duplicate workflows by name"""
        duplicates = {}
        
        for workflow in workflows:
            name = workflow.get("name", "")
            if name in duplicates:
                duplicates[name].append(workflow)
            else:
                duplicates[name] = [workflow]
        
        # Filter to only names with duplicates
        return {name: workflows for name, workflows in duplicates.items() if len(workflows) > 1}

    def identify_workflows_to_remove(self, duplicates: Dict[str, List[Dict]]) -> List[Tuple[str, str]]:
        """Identify which workflows to remove (keep newest, remove older)"""
        to_remove = []
        
        for name, workflows in duplicates.items():
            # Sort by creation date (oldest first)
            sorted_workflows = sorted(workflows, key=lambda w: w.get("createdAt", ""))
            
            # Keep the newest one, remove the older ones
            for workflow in sorted_workflows[:-1]:  # All except the last (newest)
                workflow_id = workflow.get("id")
                created_at = workflow.get("createdAt", "")
                to_remove.append((workflow_id, name, created_at))
        
        return to_remove

    def delete_workflow(self, workflow_id: str, name: str) -> bool:
        """Delete a specific workflow"""
        try:
            response = requests.delete(
                f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"   ✅ Deleted: {name} (ID: {workflow_id})")
                return True
            else:
                print(f"   ❌ Failed to delete {name}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error deleting {name}: {e}")
            return False

    def cleanup_duplicates(self) -> bool:
        """Main cleanup function"""
        print("🧹 CLEANING UP DUPLICATE WORKFLOWS")
        print("=" * 50)
        
        # Get all workflows
        print("📋 Fetching all workflows...")
        workflows = self.get_all_workflows()
        
        if not workflows:
            print("❌ No workflows found")
            return False
        
        print(f"   Found {len(workflows)} total workflows")
        
        # Find duplicates
        print("\n🔍 Identifying duplicates...")
        duplicates = self.find_duplicates(workflows)
        
        if not duplicates:
            print("✅ No duplicates found - n8n environment is clean!")
            return True
        
        print(f"   Found {len(duplicates)} workflows with duplicates:")
        for name, workflow_list in duplicates.items():
            print(f"   - {name}: {len(workflow_list)} instances")
        
        # Identify which to remove
        print("\n🗑️  Identifying workflows to remove...")
        to_remove = self.identify_workflows_to_remove(duplicates)
        
        if not to_remove:
            print("✅ No workflows need to be removed")
            return True
        
        print(f"   Will remove {len(to_remove)} duplicate workflows:")
        for workflow_id, name, created_at in to_remove:
            created_time = datetime.fromisoformat(created_at.replace('Z', '+00:00')).strftime('%H:%M:%S')
            print(f"   - {name} (Created: {created_time}, ID: {workflow_id})")
        
        # Confirm deletion
        print(f"\n⚠️  About to delete {len(to_remove)} duplicate workflows.")
        print("   This action cannot be undone!")
        
        # For safety, we'll proceed with deletion but log it
        print("\n🚀 Proceeding with cleanup...")
        
        success_count = 0
        for workflow_id, name, created_at in to_remove:
            if self.delete_workflow(workflow_id, name):
                success_count += 1
        
        # Summary
        print(f"\n📊 Cleanup Results: {success_count}/{len(to_remove)} duplicates removed")
        
        if success_count == len(to_remove):
            print("🎉 All duplicates successfully removed!")
            print("   n8n environment is now clean and organized.")
        else:
            print("⚠️  Some duplicates may need manual removal.")
        
        return success_count > 0

    def verify_cleanup(self) -> bool:
        """Verify that cleanup was successful"""
        print("\n🔍 Verifying cleanup...")
        
        workflows = self.get_all_workflows()
        duplicates = self.find_duplicates(workflows)
        
        if not duplicates:
            print("✅ Verification successful - no duplicates remain!")
            return True
        else:
            print("❌ Verification failed - duplicates still exist:")
            for name, workflow_list in duplicates.items():
                print(f"   - {name}: {len(workflow_list)} instances")
            return False

def main():
    """Main cleanup function"""
    cleaner = DuplicateWorkflowCleaner()
    
    # Perform cleanup
    success = cleaner.cleanup_duplicates()
    
    if success:
        # Verify cleanup
        verification_success = cleaner.verify_cleanup()
        
        if verification_success:
            print("\n🎉 DUPLICATE CLEANUP COMPLETED SUCCESSFULLY!")
            print("   The Federation crew workflows are now properly organized.")
        else:
            print("\n⚠️  Cleanup completed but verification failed.")
            print("   Some duplicates may remain and need manual attention.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
