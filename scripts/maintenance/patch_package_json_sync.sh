#!/bin/bash
# patch_package_json_sync.sh

echo "🛠️ Adding 'prestart' sync hooks to package.json..."

PACKAGE_JSON="package.json"
BACKUP_JSON="package.json.bak"

# Backup the original
cp $PACKAGE_JSON $BACKUP_JSON

# Use jq to safely inject the prestart script
jq '.scripts.prestart = "./scripts/maintenance/pull_katras_runtime.sh && ./scripts/maintenance/sync_katras_runtime.sh"' $PACKAGE_JSON > tmp.$$.json && mv tmp.$$.json $PACKAGE_JSON

echo "✅ 'prestart' script added to package.json"
