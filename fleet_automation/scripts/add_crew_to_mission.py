#!/usr/bin/env python3
# ADD CREW TO MISSION SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_mission.py [mission_id] [crew_name] [mission_role]

import sys
import json
from pathlib import Path

def add_crew_to_mission(mission_id, crew_name, mission_role):
    """Add crew member to specific mission"""
    print(f"🚀 Adding {crew_name} to mission: {mission_id}...")
    
    # Load mission configuration
    mission_file = Path(f"fleet_automation/missions/{mission_id}.json")
    if not mission_file.exists():
        print(f"❌ Mission {mission_id} not found. Creating new mission...")
        mission_config = {
            "mission_id": mission_id,
            "mission_name": f"Mission {mission_id}",
            "created_at": "2025-08-24T05:11:33.079869",
            "crew_members": [],
            "status": "active",
            "mission_type": "crew_assignment"
        }
    else:
        with open(mission_file, 'r') as f:
            mission_config = json.load(f)
    
    # Check if crew member is already assigned to this mission
    existing_assignment = next((member for member in mission_config["crew_members"] if member["name"] == crew_name), None)
    if existing_assignment:
        print(f"⚠️ {crew_name} is already assigned to mission {mission_id}")
        return False
    
    # Add crew member to mission
    mission_member = {
        "name": crew_name,
        "mission_role": mission_role,
        "assigned_at": "2025-08-24T05:11:33.079870",
        "status": "active"
    }
    
    mission_config["crew_members"].append(mission_member)
    
    # Save updated mission configuration
    with open(mission_file, 'w') as f:
        json.dump(mission_config, f, indent=2)
    
    print(f"✅ {crew_name} successfully added to mission {mission_id}!")
    print(f"   Mission Role: {mission_role}")
    
    return True

def main():
    if len(sys.argv) != 4:
        print("Usage: python3 add_crew_to_mission.py [mission_id] [crew_name] [mission_role]")
        print("Example: python3 add_crew_to_mission.py 'mission-001' 'Data Scientist' 'Mission Specialist'")
        sys.exit(1)
    
    mission_id = sys.argv[1]
    crew_name = sys.argv[2]
    mission_role = sys.argv[3]
    
    success = add_crew_to_mission(mission_id, crew_name, mission_role)
    if success:
        print("\n🎉 Mission crew updated successfully!")
        print("🚀 Crew member is now assigned to the specific mission!")
    else:
        print("\n❌ Failed to add crew member to mission")
        sys.exit(1)

if __name__ == "__main__":
    main()
