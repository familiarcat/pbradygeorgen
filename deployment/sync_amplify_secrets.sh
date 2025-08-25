#!/bin/bash
# This script syncs local API keys to AWS Amplify environment secrets

echo "Syncing secrets to Amplify..."
amplify env pull --yes

amplify update function   --name alexAISecrets   --env-vars "OPENAI_API_KEY=$OPENAI_API_KEY,GEMINI_API_KEY=$GEMINI_API_KEY,BITO_API_KEY=$BITO_API_KEY,CONTINUE_API_KEY=$CONTINUE_API_KEY"

echo "Secrets synced successfully."
