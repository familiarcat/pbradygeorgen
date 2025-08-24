#!/usr/bin/env python3
# ADD CREW TO PROJECT SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_project.py [project_name] [crew_name] [role_in_project]

import sys
import json
from pathlib import Path
from datetime import datetime

def add_crew_to_project(project_name, crew_name, role_in_project):
    """Add crew member to specific project"""
    print(f"🚀 Adding {crew_name} to project: {project_name}...")
    
    # Load project configuration
    project_file = Path(f"fleet_automation/projects/{project_name}.json")
    if not project_file.exists():
        print(f"❌ Project {project_name} not found. Creating new project...")
        project_config = {
            "project_name": project_name,
            "project_id": f"{project_name.lower().replace(' ', '-')}-{datetime.now().strftime('%Y%m%d')}",
            "created_at": "2025-08-24T05:11:33.079865",
            "crew_members": [],
            "status": "active"
        }
    else:
        with open(project_file, 'r') as f:
            project_config = json.load(f)
    
    # Check if crew member is already assigned to this project
    existing_assignment = next((member for member in project_config["crew_members"] if member["name"] == crew_name), None)
    if existing_assignment:
        print(f"⚠️ {crew_name} is already assigned to project {project_name}")
        return False
    
    # Add crew member to project
    project_member = {
        "name": crew_name,
        "role_in_project": role_in_project,
        "assigned_at": "2025-08-24T05:11:33.079866",
        "status": "active"
    }
    
    project_config["crew_members"].append(project_member)
    
    # Save updated project configuration
    with open(project_file, 'w') as f:
        json.dump(project_config, f, indent=2)
    
    print(f"✅ {crew_name} successfully added to project {project_name}!")
    print(f"   Role in Project: {role_in_project}")
    
    return True

def main():
    if len(sys.argv) != 4:
        print("Usage: python3 add_crew_to_project.py [project_name] [crew_name] [role_in_project]")
        print("Example: python3 add_crew_to_project.py 'Data Pipeline' 'Data Scientist' 'Lead Analyst'")
        sys.exit(1)
    
    project_name = sys.argv[1]
    crew_name = sys.argv[2]
    role_in_project = sys.argv[3]
    
    success = add_crew_to_project(project_name, crew_name, role_in_project)
    if success:
        print("\n🎉 Project crew updated successfully!")
        print("🚀 Crew member is now assigned to the specific project!")
    else:
        print("\n❌ Failed to add crew member to project")
        sys.exit(1)

if __name__ == "__main__":
    main()
