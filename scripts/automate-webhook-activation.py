#!/usr/bin/env python3
"""
Automated Webhook Activation for Federation Crew
This script automates the process of switching webhooks from Test URL to Production URL in n8n
"""

import time
import json
import os
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

class N8nWebhookAutomation:
    def __init__(self, headless=False):
        """Initialize the automation"""
        self.driver = None
        self.wait = None
        self.headless = headless
        
    def setup_driver(self):
        """Setup Chrome WebDriver"""
        print("🔧 Setting up Chrome WebDriver...")
        
        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless")
        
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            # Use webdriver-manager to automatically download and manage ChromeDriver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.wait = WebDriverWait(self.driver, 20)
            print("   ✅ Chrome WebDriver initialized")
            return True
        except Exception as e:
            print(f"   ❌ Failed to initialize Chrome WebDriver: {e}")
            return False
    
    def login_to_n8n(self):
        """Login to n8n if credentials are provided"""
        if not N8N_USERNAME or not N8N_PASSWORD:
            print("   ⚠️  No credentials provided, skipping login")
            return True
        
        try:
            print("🔐 Logging into n8n...")
            self.driver.get(f"{N8N_URL}/login")
            
            # Wait for login form
            username_field = self.wait.until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            password_field = self.driver.find_element(By.NAME, "password")
            
            # Enter credentials
            username_field.send_keys(N8N_USERNAME)
            password_field.send_keys(N8N_PASSWORD)
            
            # Submit login
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Wait for successful login
            self.wait.until(EC.url_contains("/workflow"))
            print("   ✅ Successfully logged into n8n")
            return True
            
        except Exception as e:
            print(f"   ❌ Login failed: {e}")
            return False
    
    def navigate_to_workflows(self):
        """Navigate to the workflows page"""
        try:
            print("📋 Navigating to workflows...")
            self.driver.get(f"{N8N_URL}/workflow")
            
            # Wait for workflows to load
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'workflow')]"))
            )
            print("   ✅ Workflows page loaded")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to navigate to workflows: {e}")
            return False
    
    def find_workflow_by_name(self, workflow_name):
        """Find a workflow by name in the list"""
        try:
            # Look for workflow with matching name
            workflow_xpath = f"//div[contains(text(), '{workflow_name}')]"
            workflow_element = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, workflow_xpath))
            )
            return workflow_element
        except TimeoutException:
            print(f"   ❌ Workflow not found: {workflow_name}")
            return None
    
    def open_workflow(self, workflow_element):
        """Open a workflow in the editor"""
        try:
            workflow_element.click()
            
            # Wait for workflow editor to load
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'workflow-editor')]"))
            )
            
            # Wait a bit more for nodes to load
            time.sleep(2)
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to open workflow: {e}")
            return False
    
    def find_webhook_node(self, webhook_node_name):
        """Find the webhook node in the workflow"""
        try:
            # Look for webhook node by name
            webhook_xpath = f"//div[contains(@class, 'node') and contains(text(), '{webhook_node_name}')]"
            webhook_element = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, webhook_xpath))
            )
            return webhook_element
        except TimeoutException:
            print(f"   ❌ Webhook node not found: {webhook_node_name}")
            return None
    
    def click_webhook_node(self, webhook_element):
        """Click on the webhook node to open its configuration"""
        try:
            webhook_element.click()
            
            # Wait for webhook configuration panel to appear
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'webhook-config')]"))
            )
            
            time.sleep(1)
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to click webhook node: {e}")
            return False
    
    def switch_to_production_url(self):
        """Switch webhook from Test URL to Production URL"""
        try:
            # Look for the Production URL button
            production_button_xpath = "//button[contains(text(), 'Production URL')]"
            production_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, production_button_xpath))
            )
            
            # Check if it's already selected
            if "selected" in production_button.get_attribute("class"):
                print("   ℹ️  Already using Production URL")
                return True
            
            # Click Production URL button
            production_button.click()
            time.sleep(1)
            
            # Verify URL changed
            url_field = self.driver.find_element(By.XPATH, "//input[contains(@value, 'n8n.pbradygeorgen.com')]")
            if url_field:
                print("   ✅ Switched to Production URL")
                return True
            else:
                print("   ❌ URL did not change to production")
                return False
                
        except Exception as e:
            print(f"   ❌ Failed to switch to Production URL: {e}")
            return False
    
    def save_workflow(self):
        """Save the workflow"""
        try:
            # Look for save button
            save_button_xpath = "//button[contains(text(), 'Save') or contains(@class, 'save')]"
            save_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, save_button_xpath))
            )
            
            save_button.click()
            
            # Wait for save confirmation
            time.sleep(2)
            print("   ✅ Workflow saved")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to save workflow: {e}")
            return False
    
    def activate_workflow_webhook(self, workflow_info):
        """Activate webhook for a single workflow"""
        workflow_name = workflow_info["name"]
        webhook_node_name = workflow_info["webhook_node_name"]
        
        print(f"🚀 Activating webhook for: {workflow_name}")
        print(f"   📍 Webhook Node: {webhook_node_name}")
        
        try:
            # Step 1: Find and click workflow
            workflow_element = self.find_workflow_by_name(workflow_name)
            if not workflow_element:
                return False
            
            # Step 2: Open workflow
            if not self.open_workflow(workflow_element):
                return False
            
            # Step 3: Find webhook node
            webhook_element = self.find_webhook_node(webhook_node_name)
            if not webhook_element:
                return False
            
            # Step 4: Click webhook node
            if not self.click_webhook_node(webhook_element):
                return False
            
            # Step 5: Switch to Production URL
            if not self.switch_to_production_url():
                return False
            
            # Step 6: Save workflow
            if not self.save_workflow():
                return False
            
            print(f"   ✅ Successfully activated webhook for: {workflow_name}")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to activate webhook for {workflow_name}: {e}")
            return False
    
    def run_automation(self):
        """Run the complete automation process"""
        print("🎖️ CAPTAIN PICARD - AUTOMATED WEBHOOK ACTIVATION")
        print("=================================================")
        print(f"Target: {N8N_URL}")
        print(f"Workflows to activate: {len(WORKFLOWS_TO_ACTIVATE)}")
        print("")
        
        # Setup driver
        if not self.setup_driver():
            return False
        
        try:
            # Navigate to n8n
            self.driver.get(N8N_URL)
            
            # Login if credentials provided
            if not self.login_to_n8n():
                return False
            
            # Navigate to workflows
            if not self.navigate_to_workflows():
                return False
            
            # Activate each workflow
            success_count = 0
            
            for workflow_info in WORKFLOWS_TO_ACTIVATE:
                if self.activate_workflow_webhook(workflow_info):
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
            
            return success_count == len(WORKFLOWS_TO_ACTIVATE)
            
        finally:
            # Cleanup
            if self.driver:
                self.driver.quit()
                print("   🧹 Browser closed")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Automate n8n webhook activation")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode")
    args = parser.parse_args()
    
    # Create automation instance
    automation = N8nWebhookAutomation(headless=args.headless)
    
    # Run automation
    success = automation.run_automation()
    
    exit(0 if success else 1)

if __name__ == "__main__":
    main()
