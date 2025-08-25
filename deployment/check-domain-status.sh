#!/bin/bash

# Script to check the status of the domain association in AWS Amplify

APP_ID="d25hjzqcr0podj"
DOMAIN_NAME="bensteinstl.com"
CHECK_INTERVAL=300  # 5 minutes

echo "Starting domain status check for $DOMAIN_NAME..."
echo "Will check every $CHECK_INTERVAL seconds until verification is complete."
echo "Press Ctrl+C to stop."
echo ""

while true; do
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
  echo "[$TIMESTAMP] Checking domain status..."
  
  # Get the domain association status
  RESULT=$(aws amplify get-domain-association --app-id $APP_ID --domain-name $DOMAIN_NAME)
  
  # Extract the domain status
  DOMAIN_STATUS=$(echo $RESULT | grep -o '"domainStatus": "[^"]*"' | cut -d'"' -f4)
  
  echo "Domain status: $DOMAIN_STATUS"
  
  # Check if the domain is verified
  if [ "$DOMAIN_STATUS" == "AVAILABLE" ]; then
    echo "[$TIMESTAMP] Domain verification complete!"
    echo "Your domain is now available at:"
    echo "  https://$DOMAIN_NAME"
    echo "  https://www.$DOMAIN_NAME"
    break
  fi
  
  # Also check DNS records directly
  echo "Checking DNS records directly..."
  
  # Check www subdomain
  WWW_RESULT=$(dig @ns-108.awsdns-13.com www.$DOMAIN_NAME | grep -A1 "ANSWER SECTION")
  echo "www.$DOMAIN_NAME: $WWW_RESULT"
  
  # Check certificate verification record
  CERT_RESULT=$(dig @ns-108.awsdns-13.com _603198935f7c60a1886895f573d2a8cf.$DOMAIN_NAME CNAME | grep -A1 "ANSWER SECTION")
  echo "Certificate verification: $CERT_RESULT"
  
  echo "Waiting $CHECK_INTERVAL seconds before next check..."
  echo "----------------------------------------------------"
  sleep $CHECK_INTERVAL
done
