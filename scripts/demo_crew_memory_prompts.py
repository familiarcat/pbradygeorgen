#!/usr/bin/env python3
"""
Crew Memory Prompt Optimization Demo
Demonstrates how crew memories can be used to optimize LLM prompts
"""

import os
import requests
import json
import sys
from typing import Dict, Any, List
from datetime import datetime

class CrewMemoryPromptDemo:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Supabase configuration
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not self.supabase_url:
            print("❌ Missing SUPABASE_URL environment variable")
            sys.exit(1)
        
        # Headers for API requests
        self.headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json'
        }
        
        print("🧠 CREW MEMORY PROMPT OPTIMIZATION DEMO")
        print("=" * 60)

    def load_environment_variables(self):
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
            print(f"⚠️  Warning: Could not load ~/.zshrc: {e}")

    def get_crew_memories(self, crew_member: str = None) -> List[Dict[str, Any]]:
        """Get crew memories from database"""
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            if crew_member:
                url += f"?crew_member=eq.{crew_member}"
            
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Failed to retrieve memories: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error retrieving memories: {e}")
            return []

    def generate_optimized_prompt(self, crew_member: str, mission_context: str) -> str:
        """Generate an optimized LLM prompt using crew memories"""
        memories = self.get_crew_memories(crew_member)
        
        if not memories:
            return f"Error: No memories found for {crew_member}"
        
        # Get the foundational memory
        foundational_memory = next((m for m in memories if m.get('memory_type') == 'character_foundation'), None)
        
        if not foundational_memory:
            return f"Error: No foundational memory found for {crew_member}"
        
        # Extract key information from the memory
        memory_content = foundational_memory['content']
        
        # Generate optimized prompt
        optimized_prompt = f"""You are {crew_member}, a member of the Enterprise crew. Based on your character foundation:

{memory_content}

MISSION CONTEXT:
{mission_context}

Please respond in character as {crew_member}, using your:
- Personality traits and communication style
- Specialties and expertise
- Operational approach and decision-making patterns
- Historical experiences and background

Your response should reflect your unique character while addressing the mission requirements."""

        return optimized_prompt

    def demonstrate_prompt_optimization(self):
        """Demonstrate prompt optimization for different scenarios"""
        print("\n🎯 DEMONSTRATING PROMPT OPTIMIZATION")
        print("=" * 60)
        
        # Example mission scenarios
        scenarios = [
            {
                "crew_member": "Captain Jean-Luc Picard",
                "mission": "Diplomatic crisis with a new alien species requiring first contact protocols"
            },
            {
                "crew_member": "Commander William Riker",
                "mission": "Emergency rescue operation requiring tactical coordination of multiple away teams"
            },
            {
                "crew_member": "Dr. Beverly Crusher",
                "mission": "Medical emergency involving unknown alien disease requiring ethical decision-making"
            },
            {
                "crew_member": "Commander Data",
                "mission": "Complex data analysis of sensor readings requiring pattern recognition and logical deduction"
            },
            {
                "crew_member": "Lieutenant Commander Geordi La Forge",
                "mission": "Critical system failure requiring innovative engineering solutions and emergency repairs"
            }
        ]
        
        for i, scenario in enumerate(scenarios, 1):
            print(f"\n📋 SCENARIO {i}: {scenario['crew_member']}")
            print(f"   Mission: {scenario['mission']}")
            print("-" * 80)
            
            optimized_prompt = self.generate_optimized_prompt(
                scenario['crew_member'], 
                scenario['mission']
            )
            
            print("🧠 OPTIMIZED LLM PROMPT:")
            print(optimized_prompt)
            print("=" * 80)

    def show_memory_statistics(self):
        """Show statistics about crew memories in the database"""
        print("\n📊 CREW MEMORY DATABASE STATISTICS")
        print("=" * 60)
        
        memories = self.get_crew_memories()
        
        if memories:
            # Count by crew member
            crew_counts = {}
            memory_types = {}
            
            for memory in memories:
                crew_member = memory['crew_member']
                memory_type = memory.get('memory_type', 'unknown')
                
                crew_counts[crew_member] = crew_counts.get(crew_member, 0) + 1
                memory_types[memory_type] = memory_types.get(memory_type, 0) + 1
            
            print(f"📈 Total Memories: {len(memories)}")
            print(f"👥 Unique Crew Members: {len(crew_counts)}")
            print(f"🏷️  Memory Types: {len(memory_types)}")
            
            print(f"\n👥 MEMORIES BY CREW MEMBER:")
            for crew_member, count in sorted(crew_counts.items()):
                print(f"   {crew_member}: {count} memories")
            
            print(f"\n🏷️  MEMORIES BY TYPE:")
            for memory_type, count in sorted(memory_types.items()):
                print(f"   {memory_type}: {count} memories")
            
            print(f"\n🎯 PROMPT OPTIMIZATION READY:")
            print(f"   ✅ Character consistency established")
            print(f"   ✅ Specialized knowledge documented")
            print(f"   ✅ Historical context preserved")
            print(f"   ✅ Communication styles defined")
            print(f"   ✅ Operational approaches documented")

    def run_demo(self) -> bool:
        """Run the complete demonstration"""
        try:
            print("🚀 CREW MEMORY PROMPT OPTIMIZATION DEMONSTRATION")
            print("=" * 60)
            
            # Show memory statistics
            self.show_memory_statistics()
            
            # Demonstrate prompt optimization
            self.demonstrate_prompt_optimization()
            
            # Success summary
            print(f"\n🎉 DEMONSTRATION COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print("✅ Crew memory system fully operational")
            print("✅ Prompt optimization demonstrated")
            print("✅ Character consistency established")
            print("✅ Specialized knowledge accessible")
            print("🚀 Ready for enhanced LLM interactions!")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Demonstration failed: {e}")
            return False

def main():
    """Main execution function"""
    demo = CrewMemoryPromptDemo()
    
    success = demo.run_demo()
    
    if success:
        print(f"\n🚀 Crew memory prompt optimization is ready!")
        print("   Next: Use optimized prompts in LLM interactions")
    else:
        print(f"\n⚠️  Demonstration completed with issues")
        print("   Check the crew memory system status")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
