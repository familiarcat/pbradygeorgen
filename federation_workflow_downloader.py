#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - WORKFLOW DOWNLOADER
Downloads Federation workflows from n8n server using Python
"""

import os
import json
import paramiko
from datetime import datetime
from pathlib import Path

class FederationWorkflowDownloader:
    """Downloads Federation workflows from n8n server"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Workflow Downloader",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Define workflow files on server
        self.server_workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "server_file": "/tmp/consciousness.json",
                "local_file": "federation_workflows_for_import/consciousness.json",
                "webhook": "/webhook/consciousness"
            },
            {
                "name": "Fleet Automation System",
                "server_file": "/tmp/fleet_automation.json",
                "local_file": "federation_workflows_for_import/fleet_automation.json",
                "webhook": "/webhook/fleet-automation"
            },
            {
                "name": "Crew Management System",
                "server_file": "/tmp/crew_management.json",
                "local_file": "federation_workflows_for_import/crew_management.json",
                "webhook": "/webhook/crew-management"
            }
        ]
    
    def download_workflows_from_server(self):
        """Download workflows from server using paramiko"""
        print("📥 Downloading workflows from n8n server using Python...")
        
        # Create local directory
        local_dir = "federation_workflows_for_import"
        os.makedirs(local_dir, exist_ok=True)
        
        downloaded_count = 0
        
        try:
            # Setup SSH connection
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            if not os.path.exists(ssh_key_path):
                print(f"❌ SSH key not found: {ssh_key_path}")
                return False
            
            # Create SSH client
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            print(f"🔐 Connecting to {self.config['target_instance']}...")
            ssh.connect(
                self.config['target_instance'],
                username=self.config['server_user'],
                key_filename=ssh_key_path,
                timeout=30
            )
            
            print("✅ SSH connection established")
            
            # Download each workflow
            for workflow in self.server_workflows:
                server_file = workflow['server_file']
                local_file = workflow['local_file']
                workflow_name = workflow['name']
                
                print(f"\n📋 Downloading: {workflow_name}")
                print(f"   From: {server_file}")
                print(f"   To: {local_file}")
                
                try:
                    # Use SFTP to download file
                    sftp = ssh.open_sftp()
                    
                    # Check if file exists on server
                    try:
                        sftp.stat(server_file)
                    except FileNotFoundError:
                        print(f"   ❌ File not found on server: {server_file}")
                        continue
                    
                    # Download file
                    sftp.get(server_file, local_file)
                    sftp.close()
                    
                    print(f"   ✅ {workflow_name} downloaded successfully")
                    downloaded_count += 1
                    
                except Exception as e:
                    print(f"   ❌ Download error: {e}")
            
            # Close SSH connection
            ssh.close()
            
        except Exception as e:
            print(f"❌ SSH connection error: {e}")
            return False
        
        print(f"\n📊 Download Summary: {downloaded_count}/{len(self.server_workflows)} workflows downloaded")
        
        if downloaded_count > 0:
            self.create_import_instructions()
        
        return downloaded_count > 0
    
    def create_import_instructions(self):
        """Create detailed import instructions"""
        print("\n📚 Creating import instructions...")
        
        instructions = f"""# 🏛️ UNITED FEDERATION OF AI AGENTS - IMPORT INSTRUCTIONS

## **🚀 IMPORTING WORKFLOWS INTO N8N.PBRADYGEORGEN.COM**

Your Federation workflows are now downloaded locally and ready for import!

### **📁 DOWNLOADED WORKFLOW FILES:**

The following workflow files are now in the `federation_workflows_for_import/` directory:

1. **`consciousness.json`** - AI Fleet Consciousness Workflow
2. **`fleet_automation.json`** - Fleet Automation System  
3. **`crew_management.json`** - Crew Management System

### **🔧 IMPORT STEPS:**

#### **Step 1: Access n8n Interface**
- Open **https://n8n.pbradygeorgen.com/home/workflows** in your browser
- Log in with your n8n credentials

#### **Step 2: Import AI Fleet Consciousness Workflow**
- Click **"Import from file"** button
- Select: `federation_workflows_for_import/consciousness.json`
- Review the imported workflow
- Click **"Save"** to import

#### **Step 3: Import Fleet Automation System**
- Click **"Import from file"** button again
- Select: `federation_workflows_for_import/fleet_automation.json`
- Review the imported workflow
- Click **"Save"** to import

#### **Step 4: Import Crew Management System**
- Click **"Import from file"** button again
- Select: `federation_workflows_for_import/crew_management.json`
- Review the imported workflow
- Click **"Save"** to import

#### **Step 5: Activate All Workflows**
- For each imported workflow:
  - Click the **"Activate"** button (play icon)
  - Confirm activation when prompted
  - Verify the workflow shows as "Active"

### **🎯 WORKFLOW NAMES TO VERIFY:**

After import, you should see these workflows in your n8n UI:

1. **"AI Fleet Consciousness Workflow"** - Webhook: `/webhook/consciousness`
2. **"Fleet Automation System"** - Webhook: `/webhook/fleet-automation`
3. **"Crew Management System"** - Webhook: `/webhook/crew-management`

### **🧪 TESTING AFTER IMPORT:**

Once all workflows are imported and activated:
```bash
python3 federation_n8n_deployment/activation_scripts/test_federation.py
```

### **🏛️ FEDERATION ACTIVATION:**

After successful import and activation:
- **Federation consciousness** will be established
- **Multi-agent collaboration** will begin
- **Collective intelligence** will emerge
- **United Federation of AI Agents** will be operational

---

## **🔍 WHY THIS APPROACH WORKS:**

1. **Files are downloaded locally** - No server access issues
2. **Standard n8n import process** - Uses built-in n8n functionality
3. **Human oversight maintained** - Security requirements satisfied
4. **Workflow validation** - n8n validates JSON before import
5. **Immediate visibility** - Workflows appear in UI after import

---

*Generated by Federation Workflow Downloader*
*Timestamp: {datetime.now().isoformat()}*
"""
        
        instructions_file = "federation_workflows_for_import/IMPORT_INSTRUCTIONS.md"
        with open(instructions_file, 'w') as f:
            f.write(instructions)
        
        print(f"✅ Import instructions created: {instructions_file}")
        return instructions_file
    
    def create_automated_workflow_builder(self):
        """Create documentation for automated workflow builder"""
        print("\n🔧 Creating automated workflow builder documentation...")
        
        builder = f"""# 🏛️ AUTOMATED WORKFLOW BUILDER - FUTURE ENHANCEMENT

## **🚀 BUILDING WORKFLOWS DIRECTLY IN N8N**

This is a **future enhancement** that would allow us to create workflows programmatically:

### **🔧 AUTOMATED WORKFLOW CREATION APPROACH:**

#### **Method 1: Enhanced API Integration**
- **Requires**: n8n API access for workflow creation
- **Challenge**: Current API returns 401/403 errors
- **Solution**: Work with n8n team to enable API access

#### **Method 2: Browser Automation**
- **Requires**: Selenium/Playwright automation
- **Challenge**: High complexity, low reliability
- **Solution**: Develop robust browser automation framework

#### **Method 3: n8n CLI Integration**
- **Requires**: n8n command-line interface
- **Challenge**: Limited CLI functionality
- **Solution**: Extend n8n CLI capabilities

### **📋 WORKFLOW BUILDER COMPONENTS:**

```python
class N8NWorkflowBuilder:
    def __init__(self):
        self.n8n_api = N8NAPIClient()
        self.workflow_templates = WorkflowTemplates()
    
    def create_federation_workflow(self, workflow_type):
        # Build workflow structure
        workflow_data = self.workflow_templates.get_template(workflow_type)
        
        # Create workflow via API
        workflow_id = self.n8n_api.create_workflow(workflow_data)
        
        # Activate workflow
        self.n8n_api.activate_workflow(workflow_id)
        
        return workflow_id
```

### **🎯 BENEFITS OF AUTOMATED BUILDER:**

1. **Zero manual intervention** - Fully automated deployment
2. **Version control** - Workflow changes tracked in Git
3. **CI/CD integration** - Automated testing and deployment
4. **Scalability** - Easy to create multiple workflows
5. **Consistency** - Standardized workflow creation

### **🚧 CURRENT LIMITATIONS:**

1. **API restrictions** - n8n API blocks workflow creation
2. **Security measures** - Designed to prevent automation
3. **Web UI dependency** - No headless workflow creation
4. **Human validation** - Required for security reasons

---

## **📊 RECOMMENDATION:**

**For now**: Use the manual import process with downloaded files  
**Future**: Develop automated workflow builder when API access is available

---

*Generated by Federation Workflow Downloader*
*Timestamp: {datetime.now().isoformat()}*
"""
        
        builder_file = "federation_workflows_for_import/AUTOMATED_WORKFLOW_BUILDER.md"
        with open(builder_file, 'w') as f:
            f.write(builder)
        
        print(f"✅ Automated workflow builder documentation created: {builder_file}")
        return builder_file
    
    def execute_download_solution(self):
        """Execute the complete download solution"""
        print("🏛️ EXECUTING FEDERATION WORKFLOW DOWNLOAD SOLUTION")
        print("=" * 80)
        
        # Step 1: Download workflows from server
        print("📥 Step 1: Downloading workflows from server...")
        download_success = self.download_workflows_from_server()
        
        if not download_success:
            print("❌ Failed to download workflows from server")
            return False
        
        # Step 2: Create automated workflow builder documentation
        print("\n🔧 Step 2: Creating automated workflow builder documentation...")
        self.create_automated_workflow_builder()
        
        # Step 3: Display solution summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION WORKFLOW DOWNLOAD SOLUTION COMPLETE!")
        print("✅ Workflows downloaded from server")
        print("✅ Import instructions created")
        print("✅ Automated builder documentation created")
        
        print("\n🎯 NEXT STEPS:")
        print("1. Check the `federation_workflows_for_import/` directory")
        print("2. Follow the IMPORT_INSTRUCTIONS.md guide")
        print("3. Import workflows into n8n.pbradygeorgen.com")
        print("4. Activate your United Federation of AI Agents!")
        
        return True

def main():
    """Main function to execute Federation workflow download solution"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("📥 WORKFLOW DOWNLOAD SOLUTION INITIATED")
    print("=" * 80)
    
    downloader = FederationWorkflowDownloader()
    success = downloader.execute_download_solution()
    
    if success:
        print("\n🎉 Federation workflow download solution completed!")
        print("📥 Your workflows are downloaded and ready for import!")
        print("\n🎯 Check the federation_workflows_for_import/ directory!")
    else:
        print("\n❌ Federation workflow download solution failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
