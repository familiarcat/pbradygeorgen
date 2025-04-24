#!/bin/bash
# Script to switch between different amplify.yml configurations

if [ "$1" == "ssr" ]; then
  echo "Switching to SSR configuration"
  cp amplify-ssr.yml amplify.yml
  echo "Done!"
elif [ "$1" == "apps" ]; then
  echo "Switching to applications configuration"
  cp amplify-apps.yml amplify.yml
  echo "Done!"
else
  echo "Usage: ./switch-amplify-config.sh [ssr|apps]"
  exit 1
fi
