import { z } from "zod";

export const EvaluationStatusSchema = z.enum([
  "PASS",
  "PARTIAL",
  "FAIL",
  "UNCERTAIN",
  "NOT_DEMONSTRATED",
]);

export const EvidenceReferenceSchema = z.object({
  source: z.string(),
  timestamp: z.string().optional(),
  observation: z.string(),
});

export const CriterionEvaluationSchema = z.object({
  criterionId: z.string(),
  criterion: z.string(),
  status: EvaluationStatusSchema,
  suggestedMarks: z.number().nullable(),
  maxMarks: z.number(),
  confidence: z.number().min(0).max(100),
  evidence: z.array(EvidenceReferenceSchema),
  reasoning: z.string(),
  missingEvidence: z.string().optional(),
});

export const EvaluationResultSchema = z.object({
  summary: z.object({
    suggestedScore: z.number(),
    maxScore: z.number(),
    evidenceCoverage: z.number().min(0).max(100),
  }),
  criteria: z.array(CriterionEvaluationSchema),
});

export type EvaluationResultSchema = z.infer<typeof EvaluationResultSchema>;
