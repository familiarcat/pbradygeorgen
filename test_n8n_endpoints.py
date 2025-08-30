#!/usr/bin/env python3
"""
N8N Endpoint Discovery Test
Find the correct webhook endpoints for our crew system
"""

import os
import requests
import json
from datetime import datetime

def test_webhook_patterns():
    """Test various webhook endpoint patterns"""
    
    n8n_base = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    # Test various webhook patterns
    webhook_patterns = [
        # Pattern 1: Direct crew names
        "crew-captain-jean-luc-picard",
        "crew-picard",
        "picard",
        
        # Pattern 2: Based on workflow names
        "crew-lieutenant-uhura",
        "uhura",
        "lieutenant-uhura",
        
        # Pattern 3: Generic patterns
        "test-n8n-crew",
        "crew-member-test",
        "observation-lounge-test",
        "mission-coordination",
        
        # Pattern 4: Based on existing endpoints you might have
        "crew-management",
        "federation-crew",
        "starfleet-crew",
    ]
    
    test_payload = {
        "test": "endpoint_discovery",
        "timestamp": datetime.now().isoformat(),
        "message": "Claude Code Integration connectivity test"
    }
    
    print(f"🔍 Testing webhook patterns on {n8n_base}")
    print("=" * 50)
    
    working_endpoints = []
    
    for pattern in webhook_patterns:
        webhook_url = f"{n8n_base}/webhook/{pattern}"
        print(f"Testing: {pattern}")
        
        try:
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print(f"  ✅ FOUND: {pattern} - Response: {len(response.text)} chars")
                working_endpoints.append({
                    'pattern': pattern,
                    'url': webhook_url,
                    'response_preview': response.text[:100] + '...' if len(response.text) > 100 else response.text
                })
            elif response.status_code == 404:
                print(f"  ❌ 404: {pattern}")
            else:
                print(f"  ⚠️  {response.status_code}: {pattern}")
                
        except Exception as e:
            print(f"  💥 ERROR: {pattern} - {e}")
    
    print("\n📊 RESULTS")
    print("=" * 30)
    
    if working_endpoints:
        print(f"✅ Found {len(working_endpoints)} working endpoints:")
        for endpoint in working_endpoints:
            print(f"  • {endpoint['pattern']}")
            print(f"    URL: {endpoint['url']}")
            print(f"    Response: {endpoint['response_preview']}")
            print()
    else:
        print("❌ No working webhook endpoints found")
        print("\n💡 Suggestions:")
        print("1. Check if N8N workflows have webhook triggers enabled")
        print("2. Verify webhook URLs in N8N workflow editor")
        print("3. Ensure workflows are active and published")
    
    return working_endpoints

if __name__ == "__main__":
    endpoints = test_webhook_patterns()