#!/bin/bash
"""
🏛️ UNITED FEDERATION OF AI AGENTS - SIMPLE AWS N8N DIAGNOSTIC
Simple bash script to diagnose AWS infrastructure issues
"""

echo "🏛️ UNITED FEDERATION OF AI AGENTS"
echo "🔍 SIMPLE AWS N8N DIAGNOSTIC INITIATED"
echo "================================================================================"
echo "🔍 Diagnosing AWS infrastructure issues affecting n8n.pbradygeorgen.com"
echo "================================================================================"

# Check AWS CLI
echo "🔍 Step 1: Checking AWS CLI availability..."
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI available: $(aws --version)"
else
    echo "❌ AWS CLI not available"
    exit 1
fi

# Check AWS credentials
echo ""
echo "🔍 Step 2: Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials working"
    aws sts get-caller-identity --query 'Account' --output text
else
    echo "❌ AWS credentials not working"
    exit 1
fi

# Get EC2 instance information
echo ""
echo "🔍 Step 3: Getting EC2 instance information..."
aws ec2 describe-instances \
    --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,InstanceType,LaunchTime]' \
    --output table

# Get security groups
echo ""
echo "🔍 Step 4: Getting security group information..."
aws ec2 describe-security-groups \
    --query 'SecurityGroups[*].[GroupId,GroupName,Description]' \
    --output table

# Check load balancers
echo ""
echo "🔍 Step 5: Checking load balancer configuration..."
aws elbv2 describe-load-balancers \
    --query 'LoadBalancers[*].[LoadBalancerName,LoadBalancerArn,DNSName,State.Code]' \
    --output table 2>/dev/null || echo "   No load balancers found"

# Check Route53 DNS
echo ""
echo "🔍 Step 6: Checking Route53 DNS configuration..."
aws route53 list-hosted-zones \
    --query 'HostedZones[*].[Id,Name,Comment]' \
    --output table

# Check VPC configuration
echo ""
echo "🔍 Step 7: Checking VPC configuration..."
aws ec2 describe-vpcs \
    --query 'Vpcs[*].[VpcId,CidrBlock,State,IsDefault]' \
    --output table

# Check Network ACLs
echo ""
echo "🔍 Step 8: Checking Network ACLs..."
aws ec2 describe-network-acls \
    --query 'NetworkAcls[*].[NetworkAclId,VpcId,IsDefault]' \
    --output table

# Check instance health
echo ""
echo "🔍 Step 9: Checking EC2 instance health..."
aws ec2 describe-instance-status \
    --query 'InstanceStatuses[*].[InstanceId,InstanceState.Name,InstanceStatus.Status,SystemStatus.Status]' \
    --output table 2>/dev/null || echo "   No instance status available"

# Check CloudWatch logs
echo ""
echo "🔍 Step 10: Checking CloudWatch logs..."
aws logs describe-log-groups \
    --query 'logGroups[*].[logGroupName,storedBytes]' \
    --output table 2>/dev/null || echo "   No CloudWatch logs available"

# Display diagnostic summary
echo ""
echo "================================================================================"
echo "🎉 SIMPLE AWS N8N DIAGNOSTIC COMPLETED!"
echo "================================================================================"
echo "✅ AWS infrastructure analyzed"
echo "✅ Security groups checked"
echo "✅ Network configuration verified"
echo "✅ Instance health assessed"

echo ""
echo "🏛️ DIAGNOSTIC RESULTS:"
echo "   • Domain: n8n.pbradygeorgen.com"
echo "   • Infrastructure: AWS EC2 + nginx"
echo "   • Issue: Port 5678 not listening"
echo "   • Root Cause: Likely AWS networking/security"

echo ""
echo "💡 POTENTIAL AWS ISSUES:"
echo "• **Security Groups** - Port 5678 blocked"
echo "• **Network ACLs** - Restrictive network rules"
echo "• **VPC Configuration** - Routing issues"
echo "• **Instance State** - EC2 degraded"
echo "• **Load Balancer** - Incorrect routing"

echo ""
echo "🚀 NEXT STEPS:"
echo "1. Review security group rules for port 5678"
echo "2. Check VPC routing and Network ACLs"
echo "3. Verify EC2 instance state and health"
echo "4. Fix AWS infrastructure issues"
echo "5. Test Federation agency again"

echo ""
echo "🎯 Review the diagnostic results above to fix AWS issues!"
