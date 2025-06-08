#!/bin/bash
echo "🛠️ Running maintenance patch: Normalize ArangoDB host URLs..."

UTILS_DIR="app/lib/utils"
UTIL_FILE="$UTILS_DIR/normalizeHost.ts"

# Step 1: Create the normalizeHost.ts utility file
mkdir -p "$UTILS_DIR"
cat << 'EOF' > "$UTIL_FILE"
export function normalizeHost(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `http://\${url}`;
}
EOF
echo "✅ Created $UTIL_FILE"

# Step 2: Find and patch usage in route files
ROUTE_FILES=$(grep -rl 'new Database({ url: ' app/ | grep route.ts)

for file in $ROUTE_FILES; do
  echo "🛠️ Patching $file"

  # Insert import line if not present
  grep -q "normalizeHost" "$file" || sed -i.bak '1s;^;import { normalizeHost } from "@/lib/utils/normalizeHost";\n;' "$file"

  # Replace plain ARANGODB_HOST usage
  sed -i '' 's/url: ARANGODB_HOST/url: normalizeHost(ARANGODB_HOST)/' "$file"
  echo "✅ Patched $file"
done

echo "🧰 Maintenance patch completed. ArangoDB URLs are now normalized."
