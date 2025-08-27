# N8N Workflow Backup

## Backup Information

- **Backup Date**: 2025-08-26 06:30:37
- **N8N Server**: https://n8n.pbradygeorgen.com
- **Total Workflows**: 38
- **Active Workflows**: 11
- **Crew Workflows**: 25
- **Enhanced Workflows**: 24

## Files in this Backup

- `backup_summary.json` - Complete summary of all workflows
- `restore_workflows.py` - Script to restore all workflows
- Individual workflow files (one per workflow)

## How to Restore

1. Ensure you have access to the n8n server
2. Run the restore script:
   ```bash
   python3 restore_workflows.py
   ```

## Backup Contents

This backup contains all workflows currently deployed on the n8n server, including:
- Crew member workflows with memory integration
- System coordination workflows
- All workflow configurations and connections
- Complete workflow metadata

## Important Notes

- This backup was created automatically
- All workflows are preserved in their current state
- The restore script will attempt to update existing workflows or create new ones
- Make sure to test the restore process in a safe environment first
