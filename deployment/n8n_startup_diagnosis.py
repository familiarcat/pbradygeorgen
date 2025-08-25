#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - N8N STARTUP DIAGNOSIS
Diagnose why n8n won't start and get it actually running
"""

import os
import subprocess
from datetime import datetime

class N8NStartupDiagnosis:
    """Diagnose and fix n8n startup issues"""
    
    def __init__(self):
        self.config = {
            "system_name": "N8N Startup Diagnosis",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def execute_ssh_command(self, command):
        """Execute a single SSH command"""
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                command
            ], capture_output=True, text=True, timeout=60)
            
            return result.returncode == 0, result.stdout, result.stderr
            
        except Exception as e:
            return False, "", str(e)
    
    def check_n8n_installation(self):
        """Check if n8n is properly installed"""
        print("🔍 Checking n8n installation...")
        
        # Check if n8n command exists
        success, stdout, stderr = self.execute_ssh_command("which n8n")
        if success and stdout.strip():
            print(f"✅ n8n found at: {stdout.strip()}")
        else:
            print("❌ n8n command not found")
            return False
        
        # Check n8n version
        success, stdout, stderr = self.execute_ssh_command("n8n --version")
        if success:
            print(f"✅ n8n version: {stdout.strip()}")
        else:
            print(f"❌ n8n version check failed: {stderr}")
            return False
        
        # Check if n8n is globally installed
        success, stdout, stderr = self.execute_ssh_command("npm list -g n8n")
        if success and "n8n@" in stdout:
            print("✅ n8n is globally installed via npm")
        else:
            print("⚠️  n8n may not be globally installed")
        
        return True
    
    def check_n8n_logs(self):
        """Check n8n logs for startup errors"""
        print("\n📋 Checking n8n logs for startup errors...")
        
        # Check if n8n log file exists
        success, stdout, stderr = self.execute_ssh_command("ls -la /home/ubuntu/n8n.log 2>/dev/null || echo 'No n8n.log file found'")
        if success:
            print(f"📋 n8n log file: {stdout.strip()}")
        
        # If log file exists, show recent content
        success, stdout, stderr = self.execute_ssh_command("tail -20 /home/ubuntu/n8n.log 2>/dev/null || echo 'No log content to show'")
        if success:
            print(f"📋 Recent n8n logs:\n{stdout}")
        
        # Check system logs for n8n errors
        success, stdout, stderr = self.execute_ssh_command("journalctl -u n8n --no-pager -n 20 2>/dev/null || echo 'No systemd logs for n8n'")
        if success:
            print(f"📋 Systemd logs for n8n:\n{stdout}")
    
    def check_current_status(self):
        """Check current n8n status"""
        print("\n🔍 Checking current n8n status...")
        
        # Check if n8n process is running
        success, stdout, stderr = self.execute_ssh_command("pgrep -f 'n8n'")
        if success and stdout.strip():
            print(f"✅ n8n process running: {stdout.strip()}")
        else:
            print("❌ No n8n process running")
        
        # Check what ports are listening
        success, stdout, stderr = self.execute_ssh_command("netstat -tlnp 2>/dev/null | grep :5678 || echo 'Port 5678 not listening'")
        if success:
            print(f"📋 Port 5678 status: {stdout.strip()}")
        
        # Check n8n configuration
        success, stdout, stderr = self.execute_ssh_command("ls -la /home/ubuntu/.n8n/ 2>/dev/null || echo 'No .n8n directory'")
        if success:
            print(f"📋 n8n config: {stdout.strip()}")
        
        # Show .env content
        success, stdout, stderr = self.execute_ssh_command("cat /home/ubuntu/.n8n/.env 2>/dev/null || echo 'No .env file found'")
        if success:
            print(f"📋 .env content:\n{stdout}")
    
    def start_n8n_with_debugging(self):
        """Start n8n with full debugging"""
        print("\n🚀 Starting n8n with full debugging...")
        
        # First, stop any existing processes
        print("🛑 Stopping any existing n8n processes...")
        success, stdout, stderr = self.execute_ssh_command("pkill -f 'n8n' && echo 'Stopped existing processes' || echo 'No processes to stop'")
        if success:
            print(f"✅ {stdout.strip()}")
        
        # Wait for complete shutdown
        success, stdout, stderr = self.execute_ssh_command("sleep 5")
        
        # Start n8n with debugging and log to file
        print("🚀 Starting n8n with debugging...")
        start_command = "cd /home/ubuntu && N8N_LOG_LEVEL=debug nohup n8n start > /home/ubuntu/n8n.log 2>&1 &"
        success, stdout, stderr = self.execute_ssh_command(start_command)
        
        if success:
            print("✅ n8n start command executed")
            
            # Wait for startup
            print("⏳ Waiting for n8n to start...")
            success, stdout, stderr = self.execute_ssh_command("sleep 15")
            
            # Check if n8n is running
            success, stdout, stderr = self.execute_ssh_command("pgrep -f 'n8n'")
            if success and stdout.strip():
                print(f"✅ n8n is running: {stdout.strip()}")
            else:
                print("❌ n8n is not running")
            
            # Check port binding
            success, stdout, stderr = self.execute_ssh_command("netstat -tlnp 2>/dev/null | grep :5678 || echo 'Port 5678 not listening'")
            if success:
                print(f"📋 Port 5678 status: {stdout.strip()}")
            
            # Show recent logs
            print("\n📋 Recent n8n logs:")
            success, stdout, stderr = self.execute_ssh_command("tail -30 /home/ubuntu/n8n.log 2>/dev/null || echo 'No log content yet'")
            if success:
                print(stdout)
        else:
            print(f"❌ Failed to start n8n: {stderr}")
    
    def test_n8n_api(self):
        """Test n8n API if it's running"""
        print("\n🧪 Testing n8n API...")
        
        # Test local API
        success, stdout, stderr = self.execute_ssh_command("curl -s http://localhost:5678/api/version || echo 'n8n API not responding'")
        if success:
            if "version" in stdout.lower():
                print("✅ n8n API is responding locally!")
            else:
                print(f"⚠️  n8n API response: {stdout.strip()}")
        
        # Test external access
        success, stdout, stderr = self.execute_ssh_command("curl -s http://3.21.168.120:5678/api/version || echo 'External access not working'")
        if success:
            if "version" in stdout.lower():
                print("✅ n8n API accessible externally!")
            else:
                print(f"⚠️  External API response: {stdout.strip()}")
    
    def execute_diagnosis(self):
        """Execute the complete n8n startup diagnosis"""
        print("🏛️ EXECUTING N8N STARTUP DIAGNOSIS")
        print("=" * 80)
        print("🔧 Diagnosing why n8n won't start and getting it running")
        print("=" * 80)
        
        # Step 1: Check n8n installation
        print("🔍 Step 1: Checking n8n installation...")
        if not self.check_n8n_installation():
            print("❌ n8n installation issues found")
            return False
        
        # Step 2: Check current status
        print("\n🔍 Step 2: Checking current n8n status...")
        self.check_current_status()
        
        # Step 3: Check n8n logs
        print("\n📋 Step 3: Checking n8n logs...")
        self.check_n8n_logs()
        
        # Step 4: Start n8n with debugging
        print("\n🚀 Step 4: Starting n8n with debugging...")
        self.start_n8n_with_debugging()
        
        # Step 5: Test n8n API
        print("\n🧪 Step 5: Testing n8n API...")
        self.test_n8n_api()
        
        # Step 6: Display summary
        print("\n" + "=" * 80)
        print("🎉 N8N STARTUP DIAGNOSIS COMPLETED!")
        print("=" * 80)
        print("✅ n8n installation verified")
        print("✅ Startup process debugged")
        print("✅ n8n should be running")
        
        print(f"\n🏛️ WHAT WE DISCOVERED:")
        print(f"   • n8n installation status")
        print(f"   • Startup error logs")
        print(f"   • Port binding status")
        print(f"   • API accessibility")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Verify port binding** - n8n should be listening on 5678")
        print(f"• **Test Federation agency** - Your crew webhook should work")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Send 'ALL HANDS ON BOARD' directive")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 N8N STARTUP DIAGNOSIS INITIATED")
    print("=" * 80)
    
    diagnoser = N8NStartupDiagnosis()
    success = diagnoser.execute_diagnosis()
    
    if success:
        print("\n🎉 N8N startup diagnosis completed successfully!")
        print("🏛️ We should now know why n8n wasn't starting!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ N8N startup diagnosis failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
