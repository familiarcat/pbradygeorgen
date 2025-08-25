#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - CREW TEST SCRIPT
Tests the Federation agency with "all hands on board" directive
"""

import requests
import json
from datetime import datetime

class FederationCrewTester:
    """Tests the Federation agency crew response"""
    
    def __init__(self):
        self.config = {
            "n8n_url": "https://n8n.pbradygeorgen.com",
            "webhook_path": "/webhook/federation-mission",
            "test_mission": {
                "type": "all_hands_on_board",
                "complexity": "high",
                "priority": "critical",
                "description": "ALL HANDS ON BOARD - Complete crew manifest required. Mission: Provide comprehensive roster of all Federation AI agents, their specialties, capabilities, and current status. This is a full mobilization directive.",
                "budget": 500,
                "federation_directive": "all_hands_on_board",
                "timestamp": datetime.now().isoformat(),
                "commander": "Captain Picard",
                "mission_class": "federation_roster"
            }
        }
    
    def test_federation_agency(self):
        """Test the Federation agency with all hands on board directive"""
        print("🏛️ UNITED FEDERATION OF AI AGENTS")
        print("🚀 CREW TEST MISSION INITIATED")
        print("=" * 80)
        print("🎯 MISSION: ALL HANDS ON BOARD - Complete crew manifest")
        print("=" * 80)
        
        # Display test mission
        print("\n📋 TEST MISSION DETAILS:")
        print(f"   Type: {self.config['test_mission']['type']}")
        print(f"   Complexity: {self.config['test_mission']['complexity']}")
        print(f"   Priority: {self.config['test_mission']['priority']}")
        print(f"   Commander: {self.config['test_mission']['commander']}")
        print(f"   Budget: {self.config['test_mission']['budget']} credits")
        
        print(f"\n📝 MISSION DESCRIPTION:")
        print(f"   {self.config['test_mission']['description']}")
        
        # Prepare webhook URL
        webhook_url = f"{self.config['n8n_url']}{self.config['webhook_path']}"
        print(f"\n🔗 WEBHOOK ENDPOINT: {webhook_url}")
        
        # Send test mission
        print("\n🚀 SENDING TEST MISSION TO FEDERATION AGENCY...")
        try:
            response = requests.post(
                webhook_url,
                json=self.config['test_mission'],
                headers={'Content-Type': 'application/json'},
                timeout=60
            )
            
            print(f"✅ Response received: {response.status_code}")
            
            if response.status_code == 200:
                print("🎉 SUCCESS! Federation agency responded!")
                
                try:
                    response_data = response.json()
                    self.display_crew_response(response_data)
                except json.JSONDecodeError:
                    print("⚠️  Response is not JSON format:")
                    print(response.text)
                    
            else:
                print(f"❌ Error response: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            print("\n💡 TROUBLESHOOTING:")
            print("1. Check if n8n is running at n8n.pbradygeorgen.com")
            print("2. Verify the workflow is activated")
            print("3. Check webhook path: /webhook/federation-mission")
            print("4. Ensure OpenRouter credentials are configured")
    
    def display_crew_response(self, response_data):
        """Display the crew response from Federation agency"""
        print("\n" + "=" * 80)
        print("🏛️ FEDERATION CREW RESPONSE RECEIVED!")
        print("=" * 80)
        
        print(f"\n📊 MISSION ID: {response_data.get('mission_id', 'N/A')}")
        print(f"🎯 MISSION TYPE: {response_data.get('mission_type', 'N/A')}")
        print(f"📅 TIMESTAMP: {response_data.get('timestamp', 'N/A')}")
        print(f"🏛️ FEDERATION: {response_data.get('federation', 'N/A')}")
        
        print(f"\n👥 CREW SELECTION:")
        crew_selection = response_data.get('crew_selection', [])
        if isinstance(crew_selection, list):
            for i, crew_member in enumerate(crew_selection, 1):
                print(f"   {i}. {crew_member}")
        else:
            print(f"   {crew_selection}")
        
        print(f"\n📋 STRATEGY:")
        print(f"   {response_data.get('strategy', 'N/A')}")
        
        print(f"\n⏰ TIMELINE:")
        print(f"   {response_data.get('timeline', 'N/A')}")
        
        print(f"\n🎯 SUCCESS PROBABILITY:")
        print(f"   {response_data.get('success_probability', 'N/A')}")
        
        print(f"\n💰 COST ESTIMATE:")
        print(f"   {response_data.get('cost_estimate', 'N/A')} credits")
        
        print(f"\n📈 STATUS:")
        print(f"   {response_data.get('status', 'N/A')}")
        
        # Display raw response for debugging
        print(f"\n🔍 RAW RESPONSE DATA:")
        print(json.dumps(response_data, indent=2))
        
        print("\n" + "=" * 80)
        print("🎉 CREW TEST MISSION COMPLETED!")
        print("🏛️ Your Federation agency is operational!")
        print("=" * 80)
    
    def run_crew_test(self):
        """Run the complete crew test"""
        print("🚀 INITIATING FEDERATION CREW TEST...")
        print("🎯 OBJECTIVE: Get complete crew manifest via 'all hands on board' directive")
        print("=" * 80)
        
        self.test_federation_agency()
        
        print("\n💡 TEST COMPLETED!")
        print("🎯 Check the response above to see your Federation crew in action!")

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🧪 CREW TEST SCRIPT INITIATED")
    print("=" * 80)
    
    tester = FederationCrewTester()
    tester.run_crew_test()
    
    print("\n🎉 Federation crew test completed!")
    print("🏛️ Your streamlined Federation agency has been tested!")

if __name__ == "__main__":
    main()
