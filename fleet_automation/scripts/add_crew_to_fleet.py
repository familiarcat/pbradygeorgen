#!/usr/bin/env python3
# ADD CREW TO FLEET SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_fleet.py [crew_name] [role] [specialization] [llm_preference]

import sys
import json
from pathlib import Path

def add_crew_to_fleet(crew_name, role, specialization, llm_preference):
    """Add crew member to entire fleet"""
    print(f"🚀 Adding {crew_name} to AlexAI Fleet...")
    
    # Load fleet crew configuration
    fleet_crew_file = Path("fleet_automation/crew/fleet_crew.json")
    if fleet_crew_file.exists():
        with open(fleet_crew_file, 'r') as f:
            fleet_crew = json.load(f)
    else:
        fleet_crew = {"crew_members": [], "fleet_info": {"name": "AlexAI Fleet", "created": "2025-08-24T05:11:33.079836"}}
    
    # Check if crew member already exists
    existing_member = next((member for member in fleet_crew["crew_members"] if member["name"] == crew_name), None)
    if existing_member:
        print(f"⚠️ Crew member {crew_name} already exists in fleet")
        return False
    
    # Add new crew member
    new_member = {
        "name": crew_name,
        "role": role,
        "specialization": specialization,
        "llm_preference": llm_preference,
        "added_to_fleet": "2025-08-24T05:11:33.079861",
        "status": "active",
        "assigned_projects": [],
        "assigned_missions": []
    }
    
    fleet_crew["crew_members"].append(new_member)
    
    # Save updated fleet crew
    with open(fleet_crew_file, 'w') as f:
        json.dump(fleet_crew, f, indent=2)
    
    print(f"✅ {crew_name} successfully added to AlexAI Fleet!")
    print(f"   Role: {role}")
    print(f"   Specialization: {specialization}")
    print(f"   LLM Preference: {llm_preference}")
    
    return True

def main():
    if len(sys.argv) != 5:
        print("Usage: python3 add_crew_to_fleet.py [crew_name] [role] [specialization] [llm_preference]")
        print("Example: python3 add_crew_to_fleet.py 'Data Scientist' 'analyst' 'Machine Learning' 'openai/gpt-4o'")
        sys.exit(1)
    
    crew_name = sys.argv[1]
    role = sys.argv[2]
    specialization = sys.argv[3]
    llm_preference = sys.argv[4]
    
    success = add_crew_to_fleet(crew_name, role, specialization, llm_preference)
    if success:
        print("\n🎉 Fleet crew updated successfully!")
        print("🚀 New crew member is now available across all fleet operations!")
    else:
        print("\n❌ Failed to add crew member to fleet")
        sys.exit(1)

if __name__ == "__main__":
    main()
