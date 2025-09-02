// Core AI Response Interface
export interface AIResponse {
  content: string;
  ai_system?: string;
  model_id?: string;
  confidence: number;
  cost_estimate: number;
  timestamp: string;
  enhancedContext?: any;
  optimization_metadata?: any;
}

// Code Change Interface
export interface CodeChange {
  filePath: string;
  lineNumber: number;
  oldCode: string;
  newCode: string;
  description: string;
}

// File Analysis Interface
export interface FileAnalysis {
  filePath: string;
  fileName: string;
  language: string;
  lineCount: number;
  content: string;
  structure: any;
  dependencies: string[];
  complexity: number;
  suggestions: string[];
  timestamp: string;
}

// Code Context Interface
export interface CodeContext {
  filePath?: string;
  language?: string;
  selection?: any;
  workspace?: string;
  taskType?: string;
  fileContext?: any;
}

// Generated Code Interface
export interface GeneratedCode {
  code: string;
  prompt: string;
  context: CodeContext;
  suggestions: string[];
  timestamp: string;
  llmOptimization?: any;
}

// Shared Context Interface
export interface SharedContext {
  file_context: FileContext[];
  workspace_context: WorkspaceContext;
  aiContext: AIContext;
}

// File Context Interface
export interface FileContext {
  path: string;
  language: string;
  is_active: boolean;
  selection?: any;
  content?: string;
}

// Workspace Context Interface
export interface WorkspaceContext {
  name: string;
  files: string[];
}

// AI Context Interface
export interface AIContext {
  crewMembers: string[];
  systemCapabilities: string[];
  supabaseMemories: any[];
  n8nConfigurations: any[];
}

// Task Type Enum
export enum TaskType {
  CODE_IMPLEMENTATION = 'CODE_IMPLEMENTATION',
  DEBUGGING = 'DEBUGGING',
  REFACTORING = 'REFACTORING',
  STRATEGIC_ANALYSIS = 'STRATEGIC_ANALYSIS',
  DOCUMENTATION = 'DOCUMENTATION',
  CODE_REVIEW = 'CODE_REVIEW',
  TESTING = 'TESTING',
  CODE_GENERATION = 'CODE_GENERATION',
  FILE_ANALYSIS = 'FILE_ANALYSIS'
}

// AI Selection Interface
export interface AISelection {
  primary_ai: string;
  secondary_ai: string;
  collaboration_mode: string;
  confidence_scores: {
    cursor: number;
    claude: number;
  };
  cost_estimate: number;
  selection_rationale: string;
}

// Collaboration Mode Enum
export enum CollaborationMode {
  SINGLE = 'single',
  COLLABORATIVE = 'collaborative',
  FALLBACK = 'fallback'
}