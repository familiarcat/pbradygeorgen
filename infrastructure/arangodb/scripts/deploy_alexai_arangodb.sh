#!/bin/bash

set -e

echo "[INIT] 🚀 Starting AlexAI ArangoDB Terraform + Docker Deployment"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TF_DIR="$PROJECT_ROOT/infrastructure/arangodb/terraform"
KEYPAIR_PATH="$HOME/.ssh/AlexKeyPair.pub"

# Verify SSH key exists
echo "[CHECK] 🔐 Verifying SSH public key at $KEYPAIR_PATH"
if [ ! -f "$KEYPAIR_PATH" ]; then
  echo "[ERROR] ❌ Public key not found at $KEYPAIR_PATH"
  exit 1
fi

# Navigate to terraform directory
echo "[TERRAFORM] 📁 Initializing in $TF_DIR"
cd "$TF_DIR"
terraform init

# Apply Terraform with path to public key
echo "[TERRAFORM] 🚀 Applying infrastructure with AmplifyUser profile"
terraform apply -var="public_key_path=$KEYPAIR_PATH" -auto-approve

echo "[COMPLETE] ✅ Terraform apply completed."
