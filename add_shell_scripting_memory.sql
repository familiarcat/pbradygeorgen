-- Add Critical Shell Scripting Memory to Supabase
-- This memory will prevent future dquote> errors in shell commands
-- Execute this in Supabase SQL Editor

INSERT INTO crew_memories (
    crew_member, 
    mission_id, 
    memory_type, 
    content, 
    importance,
    timestamp,
    created_at
) VALUES (
    'System-Wide',
    'shell-scripting-improvement-001',
    'system_improvement',
    'CRITICAL SYSTEM MEMORY: PROPER SHELL SCRIPTING PRACTICES

🚨 PROBLEM IDENTIFIED: Repeated dquote> errors in shell commands
📅 Date Identified: 2025-09-03
🔍 Root Cause: Malformed multi-line shell commands with unclosed quotes

❌ COMMON MISTAKES TO AVOID:
1. Multi-line echo commands with unclosed quotes
2. Complex commands with mixed quote types
3. Commands that span multiple lines without proper escaping
4. Using echo with complex formatting that breaks shell parsing

✅ CORRECT APPROACHES:
1. Use single-line commands when possible
2. Escape quotes properly in multi-line commands
3. Use heredoc syntax for complex multi-line content
4. Test commands in terminal before running in scripts
5. Use printf instead of echo for complex formatting
6. Break complex commands into simpler parts

🔧 SPECIFIC EXAMPLES:

❌ WRONG - Multi-line echo with quotes:
echo "🎯 MILESTONE: Comprehensive AI System Architecture
====================================="
echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
echo "  • 8 Claude Sub-Agents (Technical Implementation)"

✅ CORRECT - Single-line commands:
echo "🎯 MILESTONE: Comprehensive AI System Architecture"
echo "====================================="
echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
echo "  • 8 Claude Sub-Agents (Technical Implementation)"

✅ CORRECT - Heredoc syntax:
cat << ''EOF''
🎯 MILESTONE: Comprehensive AI System Architecture
=====================================
✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:
  • 8 Claude Sub-Agents (Technical Implementation)
EOF

✅ CORRECT - Function approach:
print_milestone() {
    echo "🎯 MILESTONE: Comprehensive AI System Architecture"
    echo "====================================="
    echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
    echo "  • 8 Claude Sub-Agents (Technical Implementation)"
}

🎯 LEARNING OBJECTIVES:
1. Always test shell commands before running them
2. Prefer simple, single-line commands over complex multi-line ones
3. Use proper escaping and quoting techniques
4. When in doubt, break complex commands into simpler parts
5. Use functions and heredoc syntax for complex output

🚫 NEVER DO:
- Don''t create unclosed quotes in shell commands
- Don''t assume multi-line echo commands will work
- Don''t ignore dquote> prompts - they indicate syntax errors
- Don''t repeat the same shell scripting mistakes

✅ ALWAYS DO:
- Test commands in terminal first
- Use simple, clear command structures
- Break complex operations into manageable parts
- Learn from previous shell scripting errors
- Reference this memory before writing complex shell commands

This memory must be consulted before writing any shell commands to prevent dquote> errors from recurring.',
    'critical',
    NOW(),
    NOW()
);

-- Verify the memory was created
SELECT 
    id,
    crew_member,
    mission_id,
    memory_type,
    importance,
    created_at
FROM crew_memories 
WHERE mission_id = 'shell-scripting-improvement-001'
ORDER BY created_at DESC
LIMIT 1;
