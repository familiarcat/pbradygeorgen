#!/bin/bash

echo "[INIT] 🔄 Syncing EC2 Public IP to .env files using profile: AmplifyUser"

# Retrieve EC2 Public IP
EC2_PUBLIC_IP=$(aws ec2 describe-instances \
  --profile AmplifyUser \
  --filters "Name=tag:Name,Values=AlexAI-ArangoDB" \
            "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].PublicIpAddress" \
  --output text)

if [[ -z "$EC2_PUBLIC_IP" || "$EC2_PUBLIC_IP" == "None" ]]; then
  echo "[ERROR] ❌ Could not retrieve EC2 IP. Is the instance running?"
  exit 1
fi

echo "[SUCCESS] 🛰️ EC2 IP: $EC2_PUBLIC_IP"

# Update or create .env.local and .env.production files
for ENV_FILE in .env.local .env.production; do
  if [ -f "$ENV_FILE" ]; then
    sed -i '' "s|^ARANGODB_URL=.*|ARANGODB_URL=http://$EC2_PUBLIC_IP:8529|" "$ENV_FILE"
  else
    echo "ARANGODB_URL=http://$EC2_PUBLIC_IP:8529" > "$ENV_FILE"
  fi
  echo "[UPDATE] ✅ $ENV_FILE updated with ArangoDB IP"
done

# Export for current shell session
export EC2_PUBLIC_IP=$EC2_PUBLIC_IP
echo "[EXPORT] 🌐 EC2_PUBLIC_IP exported in current shell session."
