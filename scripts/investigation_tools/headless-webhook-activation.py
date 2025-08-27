#!/usr/bin/env python3
"""
Headless Chrome Webhook Activation for Federation Crew
This script uses headless Chrome to automate webhook activation in n8n
"""

import time
import json
import os
import subprocess
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
N8N_URL = "https://n8n.pbradygeorgen.com"
N8N_USERNAME = os.getenv("N8N_USERNAME", "")
N8N_PASSWORD = os.getenv("N8N_PASSWORD", "")

# Federation Crew Workflows to activate
WORKFLOWS_TO_ACTIVATE = [
    {
        "name": "Enhanced Federation Crew - Complete Mission Control",
        "webhook_path": "federation-mission",
        "webhook_node_name": "Mission Coordinator - Picard"
    },
    {
        "name": "Captain Jean-Luc Picard - Strategic Leadership & Mission Command",
        "webhook_path": "crew-captain-jean-luc-picard",
        "webhook_node_name": "Captain Jean-Luc Picard Directive"
    },
    {
        "name": "Commander Data - Analytics & Logic Operations",
        "webhook_path": "crew-commander-data",
        "webhook_node_name": "Commander Data Directive"
    },
    {
        "name": "Lieutenant Commander Geordi La Forge - Infrastructure & System Integration",
        "webhook_path": "crew-lieutenant-commander-geordi-la-forge",
        "webhook_node_name": "Lieutenant Commander Geordi La Forge Directive"
    },
    {
        "name": "Lieutenant Worf - Security & Compliance Operations",
        "webhook_path": "crew-lieutenant-worf",
        "webhook_node_name": "Lieutenant Worf Directive"
    },
    {
        "name": "Counselor Deanna Troi - User Experience & Empathy Analysis",
        "webhook_path": "crew-counselor-deanna-troi",
        "webhook_node_name": "Counselor Deanna Troi Directive"
    },
    {
        "name": "Federation Crew - OpenRouter Agent Coordination",
        "webhook_path": "federation-directive",
        "webhook_node_name": "Federation Directive Receiver"
    }
]

class HeadlessWebhookAutomation:
    def __init__(self):
        """Initialize the headless automation"""
        self.driver = None
        self.wait = None
        
    def setup_headless_chrome(self):
        """Setup headless Chrome WebDriver"""
        print("🔧 Setting up Headless Chrome...")
        
        chrome_options = Options()
        
        # Headless configuration
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-plugins")
        chrome_options.add_argument("--disable-images")
        chrome_options.add_argument("--disable-javascript")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        try:
            # Use webdriver-manager to automatically download and manage ChromeDriver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.wait = WebDriverWait(self.driver, 30)  # Increased timeout for headless
            print("   ✅ Headless Chrome initialized")
            return True
        except Exception as e:
            print(f"   ❌ Failed to initialize Headless Chrome: {e}")
            return False
    
    def check_n8n_accessibility(self):
        """Check if n8n is accessible"""
        try:
            print("🔍 Checking n8n accessibility...")
            self.driver.get(N8N_URL)
            
            # Wait for page to load
            time.sleep(5)
            
            # Check if we can access the page
            if "n8n" in self.driver.title.lower() or "workflow" in self.driver.page_source.lower():
                print("   ✅ n8n is accessible")
                return True
            else:
                print("   ❌ n8n not accessible")
                return False
                
        except Exception as e:
            print(f"   ❌ Failed to access n8n: {e}")
            return False
    
    def navigate_to_workflows(self):
        """Navigate to the workflows page"""
        try:
            print("📋 Navigating to workflows...")
            self.driver.get(f"{N8N_URL}/workflow")
            
            # Wait for page to load
            time.sleep(5)
            
            # Check if workflows page loaded
            if "workflow" in self.driver.current_url:
                print("   ✅ Workflows page loaded")
                return True
            else:
                print("   ❌ Failed to load workflows page")
                return False
                
        except Exception as e:
            print(f"   ❌ Failed to navigate to workflows: {e}")
            return False
    
    def find_workflow_by_name(self, workflow_name):
        """Find a workflow by name in the list"""
        try:
            # Look for workflow with matching name in page source
            page_source = self.driver.page_source
            
            if workflow_name.lower() in page_source.lower():
                print(f"   ✅ Found workflow: {workflow_name}")
                return True
            else:
                print(f"   ❌ Workflow not found: {workflow_name}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error finding workflow {workflow_name}: {e}")
            return False
    
    def activate_workflow_webhook_api(self, workflow_info):
        """Activate webhook using API approach"""
        workflow_name = workflow_info["name"]
        webhook_path = workflow_info["webhook_path"]
        
        print(f"🚀 Activating webhook for: {workflow_name}")
        print(f"   📍 Webhook Path: {webhook_path}")
        
        try:
            # First, test if webhook is currently accessible
            test_response = requests.post(
                f"{N8N_URL}/webhook/{webhook_path}",
                headers={"Content-Type": "application/json"},
                json={"test": "pre-activation"},
                timeout=10
            )
            
            if test_response.status_code == 404:
                print(f"   ℹ️  Webhook {webhook_path} is not currently active")
            else:
                print(f"   ℹ️  Webhook {webhook_path} is already active")
                return True
            
            # Try to activate via API (this may not work due to n8n limitations)
            print(f"   🔧 Attempting API activation for {webhook_path}...")
            
            # Get workflow list to find the workflow ID
            api_response = requests.get(
                f"{N8N_URL}/api/v1/workflows",
                headers={"X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"},
                timeout=10
            )
            
            if api_response.status_code == 200:
                workflows = api_response.json().get("data", [])
                
                # Find the specific workflow
                target_workflow = None
                for workflow in workflows:
                    if workflow.get("name") == workflow_name:
                        target_workflow = workflow
                        break
                
                if target_workflow:
                    workflow_id = target_workflow.get("id")
                    print(f"   📍 Found workflow ID: {workflow_id}")
                    
                    # Try to activate the workflow (this may not activate webhooks)
                    activate_response = requests.patch(
                        f"{N8N_URL}/api/v1/workflows/{workflow_id}",
                        headers={
                            "X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw",
                            "Content-Type": "application/json"
                        },
                        json={"active": True},
                        timeout=10
                    )
                    
                    if activate_response.status_code == 200:
                        print(f"   ✅ Workflow activated via API")
                        
                        # Wait a moment and test the webhook
                        time.sleep(3)
                        
                        test_response = requests.post(
                            f"{N8N_URL}/webhook/{webhook_path}",
                            headers={"Content-Type": "application/json"},
                            json={"test": "post-activation"},
                            timeout=10
                        )
                        
                        if test_response.status_code != 404:
                            print(f"   ✅ Webhook {webhook_path} is now accessible!")
                            return True
                        else:
                            print(f"   ⚠️  Workflow activated but webhook still not accessible")
                            return False
                    else:
                        print(f"   ❌ Failed to activate workflow via API")
                        return False
                else:
                    print(f"   ❌ Workflow not found in API response")
                    return False
            else:
                print(f"   ❌ Failed to get workflows via API")
                return False
                
        except Exception as e:
            print(f"   ❌ Error activating webhook for {workflow_name}: {e}")
            return False
    
    def run_automation(self):
        """Run the complete automation process"""
        print("🎖️ CAPTAIN PICARD - HEADLESS WEBHOOK ACTIVATION")
        print("=================================================")
        print(f"Target: {N8N_URL}")
        print(f"Workflows to activate: {len(WORKFLOWS_TO_ACTIVATE)}")
        print("")
        
        # Setup headless Chrome
        if not self.setup_headless_chrome():
            return False
        
        try:
            # Check n8n accessibility
            if not self.check_n8n_accessibility():
                print("❌ Cannot access n8n. Please check the URL and network connectivity.")
                return False
            
            # Navigate to workflows
            if not self.navigate_to_workflows():
                print("❌ Cannot access workflows page.")
                return False
            
            # Activate each workflow using API approach
            success_count = 0
            
            for workflow_info in WORKFLOWS_TO_ACTIVATE:
                if self.activate_workflow_webhook_api(workflow_info):
                    success_count += 1
                
                # Small delay between workflows
                time.sleep(2)
            
            # Summary
            print("")
            print("🎖️ CAPTAIN PICARD - AUTOMATION SUMMARY")
            print("======================================")
            print(f"✅ Successfully activated: {success_count}/{len(WORKFLOWS_TO_ACTIVATE)} workflows")
            
            if success_count == len(WORKFLOWS_TO_ACTIVATE):
                print("🎉 ALL FEDERATION CREW WEBHOOKS ACTIVATED!")
                print("   The crew is now ready for external communications.")
            else:
                print("⚠️  Some workflows may need manual activation.")
                print("   Please use the manual guide: docs/MANUAL_WEBHOOK_ACTIVATION_GUIDE.md")
            
            return success_count > 0
            
        finally:
            # Cleanup
            if self.driver:
                self.driver.quit()
                print("   🧹 Headless Chrome closed")

def main():
    """Main function"""
    # Create automation instance
    automation = HeadlessWebhookAutomation()
    
    # Run automation
    success = automation.run_automation()
    
    exit(0 if success else 1)

if __name__ == "__main__":
    main()
