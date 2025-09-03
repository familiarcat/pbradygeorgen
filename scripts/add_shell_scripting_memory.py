#!/usr/bin/env python3
"""
Add Shell Scripting Memory Script
Adds a critical memory about proper shell scripting practices to prevent dquote> errors
"""

import os
import requests
import json
import sys
from typing import Dict, Any
from datetime import datetime

class ShellScriptingMemoryAdder:
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
        
        print("🧠 ADDING SHELL SCRIPTING MEMORY TO SUPABASE")
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

    def get_shell_scripting_memory(self) -> Dict[str, Any]:
        """Get the shell scripting memory content"""
        return {
            "crew_member": "System-Wide",
            "mission_id": "shell-scripting-improvement-001",
            "memory_type": "system_improvement",
            "content": """CRITICAL SYSTEM MEMORY: PROPER SHELL SCRIPTING PRACTICES

🚨 PROBLEM IDENTIFIED: Repeated dquote> errors in shell commands
📅 Date Identified: 2025-09-03
🔍 Root Cause: Malformed multi-line shell commands with unclosed quotes

❌ COMMON MISTAKES TO AVOID:
1. Multi-line echo commands with unclosed quotes
2. Complex commands with mixed quote types
3. Commands that span multiple lines without proper escaping
4. Using echo with complex formatting that breaks shell parsing

✅ CORRECT APPROACHES:
1. Use single-line commands when possible
2. Escape quotes properly in multi-line commands
3. Use heredoc syntax for complex multi-line content
4. Test commands in terminal before running in scripts
5. Use printf instead of echo for complex formatting
6. Break complex commands into simpler parts

🔧 SPECIFIC EXAMPLES:

❌ WRONG - Multi-line echo with quotes:
echo "🎯 MILESTONE: Comprehensive AI System Architecture
====================================="
echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
echo "  • 8 Claude Sub-Agents (Technical Implementation)"

✅ CORRECT - Single-line commands:
echo "🎯 MILESTONE: Comprehensive AI System Architecture"
echo "====================================="
echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
echo "  • 8 Claude Sub-Agents (Technical Implementation)"

✅ CORRECT - Heredoc syntax:
cat << 'EOF'
🎯 MILESTONE: Comprehensive AI System Architecture
=====================================
✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:
  • 8 Claude Sub-Agents (Technical Implementation)
EOF

✅ CORRECT - Function approach:
print_milestone() {
    echo "🎯 MILESTONE: Comprehensive AI System Architecture"
    echo "====================================="
    echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
    echo "  • 8 Claude Sub-Agents (Technical Implementation)"
}

🎯 LEARNING OBJECTIVES:
1. Always test shell commands before running them
2. Prefer simple, single-line commands over complex multi-line ones
3. Use proper escaping and quoting techniques
4. When in doubt, break complex commands into simpler parts
5. Use functions and heredoc syntax for complex output

🚫 NEVER DO:
- Don't create unclosed quotes in shell commands
- Don't assume multi-line echo commands will work
- Don't ignore dquote> prompts - they indicate syntax errors
- Don't repeat the same shell scripting mistakes

✅ ALWAYS DO:
- Test commands in terminal first
- Use simple, clear command structures
- Break complex operations into manageable parts
- Learn from previous shell scripting errors
- Reference this memory before writing complex shell commands

This memory must be consulted before writing any shell commands to prevent dquote> errors from recurring.""",
            "importance": "critical"
        }

    def insert_shell_scripting_memory(self) -> bool:
        """Insert the shell scripting memory into the database"""
        try:
            memory = self.get_shell_scripting_memory()
            
            print(f"\n🧠 Inserting shell scripting memory...")
            
            response = requests.post(
                f"{self.supabase_url}/rest/v1/crew_memories",
                headers=self.headers,
                json=memory,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print(f"   ✅ Shell scripting memory inserted successfully")
                print(f"   📝 Memory ID: {response.json().get('id', 'N/A')}")
                return True
            else:
                print(f"   ❌ Memory insertion failed: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"   ❌ Memory insertion error: {e}")
            return False

    def verify_memory_created(self) -> bool:
        """Verify that the shell scripting memory was created successfully"""
        try:
            print(f"\n🔍 Verifying memory creation...")
            
            response = requests.get(
                f"{self.supabase_url}/rest/v1/crew_memories?memory_type=eq.system_improvement&crew_member=eq.System-Wide",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                memories = response.json()
                if memories:
                    print(f"   ✅ Found {len(memories)} system improvement memories")
                    for memory in memories:
                        if "shell-scripting" in memory.get('mission_id', ''):
                            print(f"   🎯 Shell scripting memory verified: {memory['id']}")
                            return True
                else:
                    print(f"   ❌ No system improvement memories found")
                    return False
            else:
                print(f"   ❌ Memory verification failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Memory verification error: {e}")
            return False

    def run(self) -> bool:
        """Run the complete memory addition process"""
        print("🚀 Starting shell scripting memory addition process...")
        
        # Step 1: Insert the memory
        if not self.insert_shell_scripting_memory():
            print("❌ Failed to insert shell scripting memory")
            return False
        
        # Step 2: Verify the memory was created
        if not self.verify_memory_created():
            print("❌ Failed to verify shell scripting memory")
            return False
        
        print("\n🎉 SHELL SCRIPTING MEMORY SUCCESSFULLY ADDED!")
        print("=" * 60)
        print("✅ Memory stored in Supabase database")
        print("✅ Available for all crew members and AI agents")
        print("✅ Will prevent future dquote> errors")
        print("✅ System learning and improvement enabled")
        
        return True

def main():
    """Main execution function"""
    print("🧠 SHELL SCRIPTING MEMORY ADDITION SYSTEM")
    print("=" * 60)
    
    adder = ShellScriptingMemoryAdder()
    success = adder.run()
    
    if success:
        print("\n🎯 NEXT STEPS:")
        print("1. This memory is now available to all AI agents")
        print("2. Consult this memory before writing shell commands")
        print("3. Use proper shell scripting practices going forward")
        print("4. No more dquote> errors should occur")
        sys.exit(0)
    else:
        print("\n❌ FAILED TO ADD SHELL SCRIPTING MEMORY")
        print("Please check your Supabase configuration and try again")
        sys.exit(1)

if __name__ == "__main__":
    main()
