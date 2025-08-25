#!/bin/zsh

echo "[INIT] AlexAI: Syncing EC2 IP for ArangoDB (local + production)"

# Fetch the public IP of the EC2 instance tagged for AlexAI DB
export EC2_PUBLIC_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=AlexAI-Database" \
            "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].PublicIpAddress" \
  --output text)

if [[ -z "$EC2_PUBLIC_IP" ]]; then
  echo "[ERROR] No running EC2 instance found with tag 'AlexAI-Database'"
  exit 1
fi

echo "[INFO] EC2_PUBLIC_IP set to $EC2_PUBLIC_IP"

# Update .env.local and .env.production
for ENV_FILE in ".env.local" ".env.production"; do
  if [[ -f "$ENV_FILE" ]]; then
    sed -i '' '/^NEXT_PUBLIC_ARANGODB_ENDPOINT=/d' $ENV_FILE
  fi
  echo "NEXT_PUBLIC_ARANGODB_ENDPOINT=http://$EC2_PUBLIC_IP:8529" >> $ENV_FILE
  echo "[SYNCED] Updated $ENV_FILE with new ArangoDB endpoint"
done

echo "[COMPLETE] ArangoDB endpoint is now synced across environments."
