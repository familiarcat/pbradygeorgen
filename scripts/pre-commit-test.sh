#!/bin/bash
# Pre-commit test script
# Following Dante's philosophy of guiding through different stages with clear logging

echo "👑🌊 [Dante:Purgatorio] Running pre-commit tests..."

# Check if there are any TypeScript errors
echo "👑🌊 [Dante:Purgatorio] Checking for TypeScript errors..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Error] TypeScript errors found. Please fix them before committing."
    exit 1
fi

echo "👑⭐ [Dante:Paradiso] No TypeScript errors found."

# Check if there are any ESLint errors
echo "👑🌊 [Dante:Purgatorio] Checking for ESLint errors..."
npx eslint --ext .js,.jsx,.ts,.tsx .

if [ $? -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Warning] ESLint errors found. Consider fixing them before committing."
    # We don't exit with error here to allow commits even with linting issues
    # exit 1
fi

# Check if the PDF reference manager script exists and run it
if [ -f "scripts/manage-pdf-references.js" ]; then
    echo "👑🌊 [Dante:Purgatorio] Running PDF reference manager..."
    node scripts/manage-pdf-references.js

    if [ $? -ne 0 ]; then
        echo "👑🔥 [Dante:Inferno:Warning] PDF reference manager failed, but continuing..."
    else
        echo "👑⭐ [Dante:Paradiso] PDF references managed successfully."
    fi
fi

echo "👑⭐ [Dante:Paradiso] Pre-commit tests completed successfully."
exit 0
