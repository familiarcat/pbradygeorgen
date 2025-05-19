# Legacy Scripts

This directory contains scripts that have been replaced by the new unified script system. They are kept here for reference and backward compatibility.

## Replaced By New Unified System

| Legacy Script | Replaced By |
|---------------|-------------|
| `extract-pdf-all.sh` | `scripts/cli/pdf-manager.js extract` |
| `extract-pdf-colors.js` | `scripts/pdf/colors.js` |
| `extract-pdf-fonts.js` | `scripts/pdf/fonts.js` |
| `extract-pdf-text-improved.js` | `scripts/pdf/text.js` |
| `extract-pdf-text-simple.js` | `scripts/pdf/text.js` |
| `extract-pdf-text-with-pdf-parse.js` | `scripts/pdf/text.js` |
| `extract-pdf-text.js` | `scripts/pdf/text.js` |
| `extract-pdf-worker.js` | `scripts/pdf/extractor.js` |
| `generate-improved-markdown.js` | `scripts/pdf/text.js` (generateImprovedMarkdown function) |
| `prebuild-pdf-extraction.js` | `scripts/build/prebuild.js` |
| `select-pdf.sh` | `scripts/cli/pdf-manager.js list` and `scripts/cli/pdf-manager.js set-default` |
| `set-default-pdf.sh` | `scripts/cli/pdf-manager.js set-default` |
| `test-pdf-extraction.sh` | `scripts/cli/pdf-manager.js extract` |

## Migration Guide

If you were using any of these legacy scripts, please update your workflow to use the new unified system:

1. For PDF extraction, use `npm run pdf:extract <pdf-path>` or `node scripts/cli/pdf-manager.js extract <pdf-path>`
2. For setting a default PDF, use `npm run pdf:set-default <pdf-path>` or `node scripts/cli/pdf-manager.js set-default <pdf-path>`
3. For listing available PDFs, use `npm run pdf:list` or `node scripts/cli/pdf-manager.js list`

## Benefits of the New System

The new unified script system offers several advantages:

1. **Modularity**: Each component is modular and can be used independently
2. **Consistency**: All scripts follow the same coding style and patterns
3. **Configuration**: All settings are centralized in `alexai.config.js`
4. **Logging**: Consistent logging with the Dante philosophy
5. **Error Handling**: Better error handling and reporting
6. **Documentation**: Better documentation and code comments

## When to Use Legacy Scripts

These legacy scripts should not be used in new code. They are kept only for reference and to understand the history of the codebase.
