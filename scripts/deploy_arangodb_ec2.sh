#!/bin/bash

# =========================
# deploy_arangodb_ec2.sh
# =========================

# Description:
# Provision an EC2 instance, install Docker, and run ArangoDB container
# Exposes ArangoDB on port 8529 for remote connection

# Pre-requisites:
# - AWS CLI configured (aws configure)
# - Necessary IAM permissions to create EC2, VPC, SG
# - Key pair available for SSH

set -e

echo "[1/6] Creating security group..."
GROUP_ID=$(aws ec2 create-security-group --group-name arangodb-sg --description "Allow ArangoDB access" --output text)
aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 8529 --cidr 0.0.0.0/0

echo "[2/6] Finding Amazon Linux 2 AMI..."
AMI_ID=$(aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" "Name=state,Values=available" --query 'Images[*].[ImageId,CreationDate]' --output text | sort -k2 -r | head -n1 | cut -f1)

echo "[3/6] Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id $AMI_ID \
  --count 1 \
  --instance-type t2.medium \
  --key-name YOUR_KEY_PAIR_NAME \
  --security-group-ids $GROUP_ID \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "[4/6] Waiting for instance to be in running state..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "[INFO] EC2 instance is running at: $PUBLIC_IP"

echo "[5/6] Installing Docker & launching ArangoDB..."
ssh -o StrictHostKeyChecking=no -i ~/.ssh/YOUR_KEY_PAIR_NAME.pem ec2-user@$PUBLIC_IP << 'EOF'
  sudo yum update -y
  sudo amazon-linux-extras install docker -y
  sudo service docker start
  sudo usermod -a -G docker ec2-user
  docker run -d --name arangodb -e ARANGO_ROOT_PASSWORD=openSesame -p 8529:8529 arangodb
EOF

echo "[6/6] ArangoDB is now accessible at http://$PUBLIC_IP:8529"
echo "[COMPLETE] Username: root  Password: openSesame"
