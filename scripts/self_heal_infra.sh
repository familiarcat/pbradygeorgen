#!/bin/bash
set -e

echo "[🔧] Starting AlexAI Infrastructure Auto-Heal Sequence..."
cd infrastructure/arangodb

# Step 1: Ensure correct file structure
if [[ ! -f terraform/main.tf ]]; then
    echo "[ERROR] Missing terraform/main.tf - aborting."
    exit 1
fi

if [[ ! -f scripts/deploy-arangodb.sh ]]; then
    echo "[ERROR] Missing scripts/deploy-arangodb.sh - aborting."
    exit 1
fi

# Step 2: Ensure deploy script is executable
chmod +x scripts/deploy-arangodb.sh
echo "[✅] Marked deploy-arangodb.sh as executable."

# Step 3: Initialize Terraform
cd terraform
echo "[🚀] Initializing Terraform..."
terraform init

# Step 4: Plan & Apply Terraform
echo "[🧠] Generating execution plan..."
terraform plan -out=tfplan

echo "[🔨] Applying infrastructure changes..."
terraform apply -auto-approve tfplan

# Step 5: Extract EC2 public IP from output
EC2_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "")
if [[ -z "$EC2_IP" ]]; then
    echo "[⚠️] Could not retrieve EC2 public IP from Terraform output."
    read -p "Enter EC2 public IP manually: " EC2_IP
fi
cd ../scripts

# Step 6: Deploy ArangoDB on EC2
echo "[📡] Connecting to EC2 instance at $EC2_IP..."
ssh -o StrictHostKeyChecking=no -i ~/.ssh/AlexKeyPair.pem ec2-user@$EC2_IP 'bash -s' <deploy-arangodb.sh

echo "[✅] ArangoDB deployment complete!"
