#!/usr/bin/env python3
# 🏛️ FEDERATION N8N MONITORING SCRIPT
# Monitors real-time sync between local and n8n

import time
import json
import os
import sys
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from federation_n8n_integration_system import FederationN8NIntegrationSystem

def monitor_sync():
    print("🔍 FEDERATION N8N SYNC MONITORING")
    print("=" * 50)
    
    integration_system = FederationN8NIntegrationSystem()
    
    while True:
        try:
            # Check sync status
            status = integration_system.status_monitor.get_sync_status()
            
            print(f"\n📊 Sync Status: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   Local workflows: {status.get('local_count', 0)}")
            print(f"   Remote workflows: {status.get('remote_count', 0)}")
            print(f"   Sync status: {status.get('sync_status', 'Unknown')}")
            
            # Check for conflicts
            conflicts = status.get('conflicts', [])
            if conflicts:
                print(f"   ⚠️ Conflicts detected: {len(conflicts)}")
                for conflict in conflicts:
                    print(f"      - {conflict}")
            
            # Wait before next check
            time.sleep(30)
            
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped")
            break
        except Exception as e:
            print(f"\n❌ Monitoring error: {e}")
            time.sleep(60)

if __name__ == "__main__":
    monitor_sync()
