#!/usr/bin/env python3
# 🏛️ FEDERATION N8N AUTO-SYNC SCRIPT
# Automatically syncs local changes to n8n

import time
import json
import os
import sys
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from federation_n8n_integration_system import FederationN8NIntegrationSystem

def auto_sync():
    print("🔄 FEDERATION N8N AUTO-SYNC")
    print("=" * 50)
    
    integration_system = FederationN8NIntegrationSystem()
    
    while True:
        try:
            print(f"\n🔄 Auto-sync cycle: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Sync all workflows
            results = integration_system.sync_all_federation_workflows()
            
            # Check results
            success_count = sum(1 for r in results.values() if r.get('success'))
            total_count = len(results)
            
            if success_count == total_count:
                print(f"✅ All workflows synced successfully ({success_count}/{total_count})")
            else:
                print(f"⚠️ Some workflows failed to sync ({success_count}/{total_count})")
            
            # Wait before next sync
            print("   💤 Waiting 5 minutes before next sync...")
            time.sleep(300)
            
        except KeyboardInterrupt:
            print("\n🛑 Auto-sync stopped")
            break
        except Exception as e:
            print(f"\n❌ Auto-sync error: {e}")
            time.sleep(60)

if __name__ == "__main__":
    auto_sync()
