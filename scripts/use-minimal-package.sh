#!/bin/bash
# Script to use the minimal package.json file for deployment

echo "Backing up original package.json"
cp package.json package.json.backup

echo "Using minimal package.json"
cp minimal-package.json package.json

echo "Done!"
