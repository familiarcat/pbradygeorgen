// Autonomous collaboration interfaces that extend the existing ones

import { TaskType, CollaborationMode } from './interfaces';

// Extended interfaces for autonomous collaboration
export interface AutonomousTaskAnalysis {
  task_type: TaskType;
  complexity: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  required_capabilities: string[];
  context_analysis: {
    file_context: any[];
    workspace_context: any;
    conversation_history: any[];
  };
  autonomous_decision: boolean;
}

export interface AutonomousAISelection {
  primary_ai: 'cursor' | 'claude';
  secondary_ai: 'cursor' | 'claude';
  collaboration_mode: CollaborationMode;
  primary_responsibilities: string[];
  secondary_responsibilities: string[];
  confidence_scores: { cursor: number; claude: number };
  selection_rationale: string;
  autonomous_decision: boolean;
}

export interface AutonomousExecutionResult {
  primary_execution: any;
  secondary_execution: any;
  enhancement_opportunities: string[];
  collaboration_quality: string;
  autonomous_execution: boolean;
}

export interface AutonomousReviewResult {
  primary_review: any;
  secondary_review: any;
  cross_validation: any;
  quality_assessment: string;
  autonomous_review: boolean;
}

export interface AutonomousIntegrationResult {
  integrated_content: string;
  improved_content: string;
  final_content: string;
  quality_metrics: any;
  autonomous_integration: boolean;
}

export interface AutonomousCollaborationResult {
  task_analysis: AutonomousTaskAnalysis;
  ai_selection: AutonomousAISelection;
  execution_result: AutonomousExecutionResult;
  review_result: AutonomousReviewResult;
  final_integrated_result: AutonomousIntegrationResult;
  collaboration_mode: string;
  user_interaction_required: boolean;
}

// Extended collaboration modes
export enum ExtendedCollaborationMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel', 
  DEMOCRATIC_HANDOFF = 'democratic_handoff',
  CURSOR_LEAD = 'cursor_lead',
  CLAUDE_LEAD = 'claude_lead',
  PARALLEL_COLLABORATION = 'parallel_collaboration',
  SEQUENTIAL_WITH_REVIEW = 'sequential_with_review',
  SEQUENTIAL_COLLABORATION = 'sequential_collaboration',
  AUTONOMOUS = 'autonomous'
}

// Extended task types
export enum ExtendedTaskType {
  CODE_IMPLEMENTATION = 'code_implementation',
  DEBUGGING = 'debugging', 
  REFACTORING = 'refactoring',
  STRATEGIC_ANALYSIS = 'strategic_analysis',
  ARCHITECTURE_DESIGN = 'architecture_design',
  DOCUMENTATION = 'documentation',
  CODE_REVIEW = 'code_review',
  TESTING = 'testing',
  PERFORMANCE_OPTIMIZATION = 'performance_optimization',
  FILE_NAVIGATION = 'file_navigation',
  RESEARCH = 'research',
  AUTONOMOUS_COLLABORATION = 'autonomous_collaboration'
}
