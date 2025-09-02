// Core interfaces for unified AI collaboration

export interface SharedContext {
  thread_id: string;
  session_id: string;
  conversation_history: AIMessage[];
  current_task?: TaskContext;
  file_context: FileContext[];
  democratic_state: DemocraticState;
  workspace_context: WorkspaceContext;
}

export interface AIMessage {
  id: string;
  timestamp: string;
  ai_source: 'cursor' | 'claude';
  message: string;
  confidence_score: number;
  references_to_other_ai: string[];
  task_handoff?: HandoffRequest;
  message_type: 'response' | 'enhancement' | 'handoff' | 'democratic_decision';
}

export interface TaskContext {
  task_id: string;
  type: TaskType;
  complexity: 'low' | 'medium' | 'high';
  description: string;
  selected_code?: string;
  active_file?: string;
  user_intent: string;
  constraints: string[];
  expected_deliverables: string[];
}

export interface FileContext {
  filename: string;
  filepath: string;
  language: string;
  content_preview: string;
  is_active: boolean;
  cursor_position?: {line: number, column: number};
  selected_text?: string;
}

export interface WorkspaceContext {
  project_type: string;
  framework?: string;
  languages: string[];
  open_files: string[];
  git_branch?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm';
}

export interface DemocraticState {
  current_leader: 'cursor' | 'claude';
  confidence_scores: {cursor: number, claude: number};
  task_type: TaskType;
  collaboration_mode: CollaborationMode;
  handoff_triggers: HandoffTrigger[];
  selection_rationale: string;
}

export interface AISelection {
  primary_ai: 'cursor' | 'claude';
  secondary_ai: 'cursor' | 'claude';
  collaboration_mode: CollaborationMode;
  confidence_scores: {cursor: number, claude: number};
  cost_estimate: number;
  selection_rationale: string;
}

export interface UnifiedResponse {
  thread_id: string;
  timestamp: string;
  primary_ai: 'cursor' | 'claude';
  secondary_ai: 'cursor' | 'claude';
  primary_response: AIResponse;
  secondary_enhancement?: AIResponse;
  democratic_decision: DemocraticDecision;
  cross_references: CrossReference[];
  total_cost: number;
}

export interface AIResponse {
  ai_source: 'cursor' | 'claude';
  content: string;
  confidence: number;
  reasoning: string;
  code_changes?: CodeChange[];
  file_suggestions?: string[];
  follow_up_questions?: string[];
}

export interface DemocraticDecision {
  selected_ai: 'cursor' | 'claude';
  confidence_gap: number;
  task_analysis: string;
  cost_comparison: {cursor: number, claude: number};
  rationale: string;
}

export interface CrossReference {
  from_ai: 'cursor' | 'claude';
  to_ai: 'cursor' | 'claude';
  reference_type: 'agreement' | 'enhancement' | 'alternative' | 'question';
  content: string;
  context: string;
}

export interface HandoffRequest {
  from_ai: 'cursor' | 'claude';
  to_ai: 'cursor' | 'claude';
  reason: HandoffReason;
  context_preservation: any;
  urgency: 'low' | 'medium' | 'high';
}

export interface CodeChange {
  file: string;
  line_start: number;
  line_end: number;
  old_code: string;
  new_code: string;
  change_type: 'addition' | 'modification' | 'deletion';
  reasoning: string;
}

// Enums
export enum TaskType {
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
  RESEARCH = 'research'
}

export enum CollaborationMode {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel', 
  DEMOCRATIC_HANDOFF = 'democratic_handoff',
  CURSOR_LEAD = 'cursor_lead',
  CLAUDE_LEAD = 'claude_lead'
}

export enum HandoffReason {
  LOW_CONFIDENCE = 'low_confidence',
  TASK_CHANGE = 'task_change',
  USER_REQUEST = 'user_request',
  BETTER_SPECIALIST = 'better_specialist',
  ERROR_RECOVERY = 'error_recovery'
}

export enum HandoffTrigger {
  CONFIDENCE_THRESHOLD = 'confidence_threshold',
  TASK_COMPLEXITY_CHANGE = 'task_complexity_change',
  USER_DISSATISFACTION = 'user_dissatisfaction',
  ERROR_RATE = 'error_rate',
  COST_THRESHOLD = 'cost_threshold'
}

// Configuration interfaces
export interface ExtensionConfig {
  autoStart: boolean;
  democraticMode: boolean;
  showConfidenceScores: boolean;
  maxCostPerQuery: number;
  claudeApiKey?: string;
  cursorApiKey?: string;
  n8nWebhookUrl?: string;
}

export interface ChatMessage {
  id: string;
  timestamp: string;
  type: 'user' | 'ai' | 'system';
  source?: 'cursor' | 'claude' | 'democratic' | 'user' | 'system';
  content: string;
  confidence?: number;
  references?: string[];
  metadata?: any;
  // Add new properties for autonomous collaboration
  ai_source?: 'cursor' | 'claude' | 'user' | 'system';
  message?: string;
  message_type?: 'response' | 'enhancement' | 'handoff' | 'democratic_decision' | 'user_input' | 'system_message' | 'autonomous_collaboration_result';
}