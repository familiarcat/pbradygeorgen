"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationMode = exports.TaskType = void 0;
// Task Type Enum
var TaskType;
(function (TaskType) {
    TaskType["CODE_IMPLEMENTATION"] = "CODE_IMPLEMENTATION";
    TaskType["DEBUGGING"] = "DEBUGGING";
    TaskType["REFACTORING"] = "REFACTORING";
    TaskType["STRATEGIC_ANALYSIS"] = "STRATEGIC_ANALYSIS";
    TaskType["DOCUMENTATION"] = "DOCUMENTATION";
    TaskType["CODE_REVIEW"] = "CODE_REVIEW";
    TaskType["TESTING"] = "TESTING";
    TaskType["CODE_GENERATION"] = "CODE_GENERATION";
    TaskType["FILE_ANALYSIS"] = "FILE_ANALYSIS";
})(TaskType || (exports.TaskType = TaskType = {}));
// Collaboration Mode Enum
var CollaborationMode;
(function (CollaborationMode) {
    CollaborationMode["SINGLE"] = "single";
    CollaborationMode["COLLABORATIVE"] = "collaborative";
    CollaborationMode["FALLBACK"] = "fallback";
})(CollaborationMode || (exports.CollaborationMode = CollaborationMode = {}));
//# sourceMappingURL=interfaces.js.map