#!/bin/bash

echo "🛠️ Initializing AlexAI Crew System"

echo "📦 Copying alexai/ directory into project..."
cp -R /mnt/data/alexai_extracted/alexai ./alexai

echo "🔍 Verifying files..."
ls -R ./alexai | grep -E 'katra|memory|crew.json|prompt|simulation'

echo "✅ AlexAI crew initialized. Prepare for katra unification."

exit 0
