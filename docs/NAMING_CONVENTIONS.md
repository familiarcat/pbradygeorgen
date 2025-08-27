# N8N Workflow Naming Conventions

**Documentation Created**: 2025-08-26 19:52:36
**Status**: Successfully implemented on remote n8n instance

## Overview

This document defines the standardized naming conventions for all n8n workflows in the AlexAI Optimized Crew system.

## Naming Convention Structure

### Crew Workflows
Format: `Crew - [FUNCTION] - [IDENTIFIER]`

| Crew ID | Function | Identifier | Full Name |
|---------|----------|------------|-----------|
| picard | Captain Jean-Luc Picard | Strategic Leadership & Mission Command | Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command |
| riker | Commander William Riker | Tactical Execution & Workflow Management | Crew - Commander William Riker - Tactical Execution & Workflow Management |
| crusher | Dr. Beverly Crusher | Health & Diagnostics Officer | Crew - Dr. Beverly Crusher - Health & Diagnostics Officer |
| data | Commander Data | Analytics & Logic Operations | Crew - Commander Data - Analytics & Logic Operations |
| geordi | Lieutenant Commander Geordi La Forge | Infrastructure & System Integration | Crew - Lieutenant Commander Geordi La Forge - Infrastructure & System Integration |
| worf | Lieutenant Worf | Security & Compliance Operations | Crew - Lieutenant Worf - Security & Compliance Operations |
| troi | Counselor Deanna Troi | User Experience & Empathy Analysis | Crew - Counselor Deanna Troi - User Experience & Empathy Analysis |
| uhura | Lieutenant Uhura | Communications & I/O Operations Officer | Crew - Lieutenant Uhura - Communications & I/O Operations Officer |
| quark | Quark | Business Intelligence & Budget Optimization | Crew - Quark - Business Intelligence & Budget Optimization |

### System Workflows
Format: `System - [FUNCTION] - [IDENTIFIER]`

| System ID | Function | Identifier | Full Name |
|-----------|----------|------------|-----------|
| federation | Enhanced Federation Crew | Complete Mission Control | System - Enhanced Federation Crew - Complete Mission Control |
| alexai | AlexAI Optimized Crew | Complete Mission Control | System - AlexAI Optimized Crew - Complete Mission Control |
| openrouter | Federation Crew | OpenRouter Agent Coordination | System - Federation Crew - OpenRouter Agent Coordination |
| concise | Federation Concise Agency | OpenRouter Crew | System - Federation Concise Agency - OpenRouter Crew |

## Implementation Details

### Benefits
- **Clear Visual Separation**: Easy identification of workflow types in n8n UI
- **Professional Appearance**: Consistent, organized interface
- **Functional Grouping**: Logical categorization by purpose
- **Scalability**: Easy to add new workflows following the pattern

### Migration History
- **Previous Naming**: Used descriptive names without prefixes
- **New Naming**: Implemented standardized CREW/SYSTEM prefixes
- **Migration Date**: 2025-08-26
- **Migration Method**: Manual renaming in n8n UI

### Future Deployments

When creating new workflows, follow these naming patterns:

```json
{
  "name": "Crew - [FUNCTION] - [IDENTIFIER]",
  "tags": ["crew", "[function]", "[identifier]"]
}
```

## Maintenance

1. **Consistency Check**: Ensure all new workflows follow the convention
2. **Documentation Updates**: Update this document when adding new workflows
3. **Local Config Sync**: Keep local configuration files updated
4. **Deployment Verification**: Verify naming after each deployment
