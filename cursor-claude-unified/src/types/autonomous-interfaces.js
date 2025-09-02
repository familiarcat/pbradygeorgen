"use strict";
// Autonomous collaboration interfaces that extend the existing ones
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedTaskType = exports.ExtendedCollaborationMode = void 0;
// Extended collaboration modes
var ExtendedCollaborationMode;
(function (ExtendedCollaborationMode) {
    ExtendedCollaborationMode["SEQUENTIAL"] = "sequential";
    ExtendedCollaborationMode["PARALLEL"] = "parallel";
    ExtendedCollaborationMode["DEMOCRATIC_HANDOFF"] = "democratic_handoff";
    ExtendedCollaborationMode["CURSOR_LEAD"] = "cursor_lead";
    ExtendedCollaborationMode["CLAUDE_LEAD"] = "claude_lead";
    ExtendedCollaborationMode["PARALLEL_COLLABORATION"] = "parallel_collaboration";
    ExtendedCollaborationMode["SEQUENTIAL_WITH_REVIEW"] = "sequential_with_review";
    ExtendedCollaborationMode["SEQUENTIAL_COLLABORATION"] = "sequential_collaboration";
    ExtendedCollaborationMode["AUTONOMOUS"] = "autonomous";
})(ExtendedCollaborationMode || (exports.ExtendedCollaborationMode = ExtendedCollaborationMode = {}));
// Extended task types
var ExtendedTaskType;
(function (ExtendedTaskType) {
    ExtendedTaskType["CODE_IMPLEMENTATION"] = "code_implementation";
    ExtendedTaskType["DEBUGGING"] = "debugging";
    ExtendedTaskType["REFACTORING"] = "refactoring";
    ExtendedTaskType["STRATEGIC_ANALYSIS"] = "strategic_analysis";
    ExtendedTaskType["ARCHITECTURE_DESIGN"] = "architecture_design";
    ExtendedTaskType["DOCUMENTATION"] = "documentation";
    ExtendedTaskType["CODE_REVIEW"] = "code_review";
    ExtendedTaskType["TESTING"] = "testing";
    ExtendedTaskType["PERFORMANCE_OPTIMIZATION"] = "performance_optimization";
    ExtendedTaskType["FILE_NAVIGATION"] = "file_navigation";
    ExtendedTaskType["RESEARCH"] = "research";
    ExtendedTaskType["AUTONOMOUS_COLLABORATION"] = "autonomous_collaboration";
})(ExtendedTaskType || (exports.ExtendedTaskType = ExtendedTaskType = {}));
//# sourceMappingURL=autonomous-interfaces.js.map