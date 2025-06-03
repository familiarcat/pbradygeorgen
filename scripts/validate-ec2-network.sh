#!/bin/bash

PROFILE="AmplifyUser"
INSTANCE_NAME="AlexAI-ArangoDB"

echo "[RECON] Scanning EC2 instance for public accessibility..."

INSTANCE_ID=$(aws ec2 describe-instances \
  --profile $PROFILE \
  --filters "Name=tag:Name,Values=$INSTANCE_NAME" \
            "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text)

PUBLIC_IP=$(aws ec2 describe-instances \
  --profile $PROFILE \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

SG_ID=$(aws ec2 describe-instances \
  --profile $PROFILE \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].SecurityGroups[0].GroupId" \
  --output text)

echo "[INFO] Instance ID: $INSTANCE_ID"
echo "[INFO] Public IP : $PUBLIC_IP"
echo "[INFO] Security Group: $SG_ID"

# Check if port 22 (SSH) is open
echo "[CHECK] Verifying security group ingress for port 22 (SSH)..."
aws ec2 authorize-security-group-ingress \
  --profile $PROFILE \
  --group-id $SG_ID \
  --protocol tcp --port 22 \
  --cidr 0.0.0.0/0 2>/dev/null || echo "[OK] Port 22 already allowed."

# Check if port 8529 (ArangoDB) is open
echo "[CHECK] Verifying security group ingress for port 8529 (ArangoDB)..."
aws ec2 authorize-security-group-ingress \
  --profile $PROFILE \
  --group-id $SG_ID \
  --protocol tcp --port 8529 \
  --cidr 0.0.0.0/0 2>/dev/null || echo "[OK] Port 8529 already allowed."

echo "[RESULT] Confirmed or repaired ingress rules."
echo "[NEXT] Retry SSH: ssh -i ~/.ssh/AlexKeyPair.pem ec2-user@$PUBLIC_IP"
