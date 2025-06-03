#!/bin/bash
echo "[INIT] AlexAI: Syncing EC2 IP for ArangoDB (local + production)"

PROFILE="AmplifyUser" # <- FIXED PROFILE
TAG_NAME="AlexAI-ArangoDB"

export EC2_PUBLIC_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=${TAG_NAME}" \
  "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].PublicIpAddress" \
  --output text \
  --profile $PROFILE)

if [ -z "$EC2_PUBLIC_IP" ]; then
  echo "[ERROR] ❌ Could not retrieve EC2 IP."
else
  echo "[SYNC] ✅ EC2 Public IP: $EC2_PUBLIC_IP"
  echo "export EC2_PUBLIC_IP=$EC2_PUBLIC_IP" >>~/.zshrc
  source ~/.zshrc
fi
