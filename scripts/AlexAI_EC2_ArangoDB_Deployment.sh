
# 🚀 Initialize Terraform and deploy the EC2 instance with ArangoDB

cd infrastructure/arangodb/terraform

# Step 1: Initialize Terraform
terraform init

# Step 2: Review the plan to ensure it matches expectations
terraform plan -out=tfplan

# Step 3: Apply the deployment plan
terraform apply tfplan

# ✅ If successful, Terraform will output the public IP of your EC2 instance

# 💾 SSH into your instance (replace with the IP from the output)
ssh -i ~/.ssh/AlexKeyPair.pem ec2-user@<EC2_PUBLIC_IP>

# 🎯 Run Docker deployment for ArangoDB
cd /home/ec2-user
chmod +x ./scripts/deploy-arangodb.sh
./scripts/deploy-arangodb.sh

# 🌐 Access ArangoDB on: http://<EC2_PUBLIC_IP>:8529
