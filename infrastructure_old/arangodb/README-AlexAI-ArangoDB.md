# AlexAI ArangoDB Deployment

This directory contains the resources needed to deploy a persistent ArangoDB instance for the AlexAI identity and memory system using both AWS CLI and Terraform.

## 📂 Structure

- `scripts/`
  - `deploy-arangodb.sh`: Shell script to automate EC2 creation, Docker install, and ArangoDB container launch using AWS CLI.

- `terraform/`
  - `main.tf`: Terraform script to provision an EC2 instance and install Docker with ArangoDB.

---

## 🛠️ Prerequisites

### Local Setup

- AWS CLI configured with proper credentials
- Terraform installed
- Docker installed (if testing locally)
- SSH key pair created and saved to `~/.ssh/` (e.g., `AlexKeyPair.pem`)
- EC2 Key name referenced in Terraform matches the one in your AWS account

---

## 🚀 Deployment

### Option 1: Deploy via AWS CLI

Run:

```bash
./scripts/deploy-arangodb.sh
```

This script will:
1. Launch an EC2 instance using the AWS CLI
2. Connect via SSH
3. Install Docker and run ArangoDB as a container

Ensure that your PEM key path is exported in your environment:
```bash
export EC2_KEY_PATH="~/.ssh/AlexKeyPair.pem"
```

---

### Option 2: Deploy via Terraform

```bash
cd terraform
terraform init
terraform apply
```

Terraform will:
- Launch the EC2 instance
- Set up security groups
- Provision Docker
- Launch ArangoDB in a container

---

## 🔗 Next Steps

- Update your Next.js application to use the EC2's public IP as the ArangoDB endpoint
- Secure ArangoDB with authentication and firewall rules
- Consider exposing the DB through a secure reverse proxy if needed
- Visualize memory and identity graphs via the ArangoDB web interface or frontend integration

Live long and persist data. 🖖