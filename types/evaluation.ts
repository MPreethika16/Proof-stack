// ─── Rubric ──────────────────────────────────────────────────────────────────

export interface Criterion {
  id: string;
  requirement: string;
  maxMarks: number;
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export type EvidenceFileType = "video" | "image" | "other";

export interface EvidenceFile {
  id: string;
  file: File;
  type: EvidenceFileType;
}

// ─── Evaluation Statuses ─────────────────────────────────────────────────────

export type EvaluationStatus =
  | "PASS"
  | "PARTIAL"
  | "FAIL"
  | "UNCERTAIN"
  | "NOT_DEMONSTRATED";

// ─── Evidence Reference ───────────────────────────────────────────────────────

export interface EvidenceReference {
  source: string;
  timestamp?: string;
  observation: string;
}

// ─── Per-Criterion Result ─────────────────────────────────────────────────────

export interface CriterionEvaluation {
  criterionId: string;
  criterion: string;
  status: EvaluationStatus;
  suggestedMarks: number | null;
  maxMarks: number;
  confidence: number; // 0-100
  evidence: EvidenceReference[];
  reasoning: string;
  missingEvidence?: string;
}

// ─── Full Evaluation Result ───────────────────────────────────────────────────

export interface EvaluationResult {
  summary: {
    suggestedScore: number;
    maxScore: number;
    evidenceCoverage: number; // 0-100
  };
  criteria: CriterionEvaluation[];
}

// ─── Human Override ───────────────────────────────────────────────────────────

export type ReviewerDecision = "ACCEPT" | "OVERRIDE" | "REQUEST_EVIDENCE";

export interface CriterionOverride {
  decision: ReviewerDecision;
  status?: EvaluationStatus;
  marks?: number;
}

// ─── App Mode ─────────────────────────────────────────────────────────────────

export type AppMode = "evidence-upload" | "live-proof";

// ─── App State ────────────────────────────────────────────────────────────────

export type AppPhase = "setup" | "loading" | "results" | "error";
