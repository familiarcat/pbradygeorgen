#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - SETUP SSH AGENT
Setup ssh-agent to avoid password prompts for SSH key
"""

import os
import subprocess
import time
from datetime import datetime

class SetupSSHAgent:
    """Setup ssh-agent to avoid password prompts"""
    
    def __init__(self):
        self.config = {
            "system_name": "Setup SSH Agent",
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "created_at": datetime.now().isoformat()
        }
    
    def check_ssh_agent_status(self):
        """Check if ssh-agent is running and has our key"""
        print("🔍 Checking ssh-agent status...")
        
        try:
            # Check if ssh-agent is running
            agent_check = subprocess.run([
                'ssh-add', '-l'
            ], capture_output=True, text=True, timeout=30)
            
            if agent_check.returncode == 0:
                if "no identities" in agent_check.stdout.lower():
                    print("⚠️  ssh-agent is running but has no keys")
                    return False
                else:
                    print("✅ ssh-agent is running and has keys:")
                    print(agent_check.stdout)
                    return True
            else:
                print("❌ ssh-agent is not running")
                return False
                
        except Exception as e:
            print(f"❌ ssh-agent check error: {e}")
            return False
    
    def start_ssh_agent(self):
        """Start ssh-agent if not running"""
        print("🚀 Starting ssh-agent...")
        
        try:
            # Start ssh-agent
            start_result = subprocess.run([
                'eval', '$(ssh-agent)'
            ], capture_output=True, text=True, timeout=30)
            
            if start_result.returncode == 0:
                print("✅ ssh-agent started")
                return True
            else:
                print(f"⚠️  ssh-agent start: {start_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ ssh-agent start error: {e}")
            return False
    
    def add_ssh_key_to_agent(self):
        """Add SSH key to ssh-agent"""
        print(f"🔑 Adding SSH key to ssh-agent...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Add key to ssh-agent
            add_result = subprocess.run([
                'ssh-add', ssh_key_path
            ], capture_output=True, text=True, timeout=60)
            
            if add_result.returncode == 0:
                print("✅ SSH key added to ssh-agent")
                return True
            else:
                print(f"❌ SSH key add failed: {add_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ SSH key add error: {e}")
            return False
    
    def test_ssh_without_password(self):
        """Test SSH connection without password prompt"""
        print(f"🧪 Testing SSH without password prompt...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Test SSH to the correct instance
            test_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                'ubuntu@3.144.205.118',
                'echo "SSH test successful - no password prompt!"'
            ], capture_output=True, text=True, timeout=30)
            
            if test_result.returncode == 0:
                print("✅ SSH test successful - no password prompt!")
                print(test_result.stdout)
                return True
            else:
                print(f"❌ SSH test failed: {test_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ SSH test error: {e}")
            return False
    
    def create_ssh_agent_script(self):
        """Create a script to easily start ssh-agent and add key"""
        print(f"📝 Creating ssh-agent setup script...")
        
        script_content = """#!/bin/bash
# SSH Agent Setup Script for Federation Agency
echo "🏛️ Setting up SSH agent for Federation agency..."

# Start ssh-agent
eval $(ssh-agent)

# Add SSH key
ssh-add ~/.ssh/AlexKeyPair.pem

# Show status
ssh-add -l

echo "✅ SSH agent setup complete!"
echo "🎯 You can now run SSH commands without password prompts!"
"""
        
        script_path = "setup_ssh_agent.sh"
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        # Make executable
        subprocess.run(['chmod', '+x', script_path])
        
        print(f"✅ Created {script_path}")
        return script_path
    
    def execute_ssh_agent_setup(self):
        """Execute the complete ssh-agent setup process"""
        print("🏛️ EXECUTING SSH AGENT SETUP")
        print("=" * 80)
        print("🔑 Setting up ssh-agent to avoid password prompts")
        print("=" * 80)
        
        # Step 1: Check current status
        print("🔍 Step 1: Checking current ssh-agent status...")
        if self.check_ssh_agent_status():
            print("✅ ssh-agent is already set up with keys!")
            return True
        
        # Step 2: Start ssh-agent if needed
        print(f"\n🚀 Step 2: Starting ssh-agent...")
        if not self.start_ssh_agent():
            print("❌ ssh-agent start failed")
            return False
        
        # Step 3: Add SSH key to agent
        print(f"\n🔑 Step 3: Adding SSH key to ssh-agent...")
        if not self.add_ssh_key_to_agent():
            print("❌ SSH key add failed")
            return False
        
        # Step 4: Test SSH without password
        print(f"\n🧪 Step 4: Testing SSH without password prompt...")
        if not self.test_ssh_without_password():
            print("❌ SSH test failed")
            return False
        
        # Step 5: Create setup script
        print(f"\n📝 Step 5: Creating ssh-agent setup script...")
        script_path = self.create_ssh_agent_script()
        
        # Step 6: Display success summary
        print("\n" + "=" * 80)
        print("🎉 SSH AGENT SETUP COMPLETED!")
        print("=" * 80)
        print(f"✅ ssh-agent is running")
        print(f"✅ SSH key added to agent")
        print(f"✅ SSH works without password prompts")
        print(f"✅ Setup script created: {script_path}")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Started ssh-agent")
        print(f"   • Added AlexKeyPair.pem to agent")
        print(f"   • Tested SSH without password")
        print(f"   • Created setup script for future use")
        
        print(f"\n💡 HOW TO USE:")
        print(f"• **Current session** - SSH commands won't prompt for password")
        print(f"• **Future sessions** - Run: ./{script_path}")
        print(f"• **Manual setup** - Run: eval $(ssh-agent) && ssh-add ~/.ssh/AlexKeyPair.pem")
        
        print(f"\n🔑 SSH AGENT STATUS:")
        print(f"• ssh-agent: Running")
        print(f"• Keys loaded: AlexKeyPair.pem")
        print(f"• Password prompts: Disabled")
        
        print(f"\n🚀 READY FOR AUTOMATION:")
        print(f"1. SSH commands won't prompt for password")
        print(f"2. Federation agency scripts will run faster")
        print(f"3. No more manual password entry")
        print(f"4. Enjoy automated Federation agency deployment!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔑 SETUP SSH AGENT")
    print("=" * 80)
    
    setup = SetupSSHAgent()
    success = setup.execute_ssh_agent_setup()
    
    if success:
        print("\n🎉 SSH agent setup completed successfully!")
        print("🏛️ You can now run SSH commands without password prompts!")
        print("\n🎯 Try running your Federation agency scripts again!")
    else:
        print("\n❌ SSH agent setup failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
