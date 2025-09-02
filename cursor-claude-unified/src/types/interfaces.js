"use strict";
// Core interfaces for unified AI collaboration
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandoffTrigger = exports.HandoffReason = exports.CollaborationMode = exports.TaskType = void 0;
// Enums
var TaskType;
(function (TaskType) {
    TaskType["CODE_IMPLEMENTATION"] = "code_implementation";
    TaskType["DEBUGGING"] = "debugging";
    TaskType["REFACTORING"] = "refactoring";
    TaskType["STRATEGIC_ANALYSIS"] = "strategic_analysis";
    TaskType["ARCHITECTURE_DESIGN"] = "architecture_design";
    TaskType["DOCUMENTATION"] = "documentation";
    TaskType["CODE_REVIEW"] = "code_review";
    TaskType["TESTING"] = "testing";
    TaskType["PERFORMANCE_OPTIMIZATION"] = "performance_optimization";
    TaskType["FILE_NAVIGATION"] = "file_navigation";
    TaskType["RESEARCH"] = "research";
})(TaskType || (exports.TaskType = TaskType = {}));
var CollaborationMode;
(function (CollaborationMode) {
    CollaborationMode["SEQUENTIAL"] = "sequential";
    CollaborationMode["PARALLEL"] = "parallel";
    CollaborationMode["DEMOCRATIC_HANDOFF"] = "democratic_handoff";
    CollaborationMode["CURSOR_LEAD"] = "cursor_lead";
    CollaborationMode["CLAUDE_LEAD"] = "claude_lead";
})(CollaborationMode || (exports.CollaborationMode = CollaborationMode = {}));
var HandoffReason;
(function (HandoffReason) {
    HandoffReason["LOW_CONFIDENCE"] = "low_confidence";
    HandoffReason["TASK_CHANGE"] = "task_change";
    HandoffReason["USER_REQUEST"] = "user_request";
    HandoffReason["BETTER_SPECIALIST"] = "better_specialist";
    HandoffReason["ERROR_RECOVERY"] = "error_recovery";
})(HandoffReason || (exports.HandoffReason = HandoffReason = {}));
var HandoffTrigger;
(function (HandoffTrigger) {
    HandoffTrigger["CONFIDENCE_THRESHOLD"] = "confidence_threshold";
    HandoffTrigger["TASK_COMPLEXITY_CHANGE"] = "task_complexity_change";
    HandoffTrigger["USER_DISSATISFACTION"] = "user_dissatisfaction";
    HandoffTrigger["ERROR_RATE"] = "error_rate";
    HandoffTrigger["COST_THRESHOLD"] = "cost_threshold";
})(HandoffTrigger || (exports.HandoffTrigger = HandoffTrigger = {}));
//# sourceMappingURL=interfaces.js.map