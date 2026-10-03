"use client";

import { useState } from "react";
import type {
  EvaluationResult,
  CriterionOverride,
  EvaluationStatus,
} from "@/types/evaluation";
import CriterionResult from "./CriterionResult";

const STATUS_COUNTS = (
  statuses: EvaluationStatus[]
): Record<EvaluationStatus, number> => ({
  PASS: statuses.filter((s) => s === "PASS").length,
  PARTIAL: statuses.filter((s) => s === "PARTIAL").length,
  FAIL: statuses.filter((s) => s === "FAIL").length,
  UNCERTAIN: statuses.filter((s) => s === "UNCERTAIN").length,
  NOT_DEMONSTRATED: statuses.filter((s) => s === "NOT_DEMONSTRATED").length,
});

interface EvaluationResultsProps {
  result: EvaluationResult;
  onReset: () => void;
}

export default function EvaluationResults({
  result,
  onReset,
}: EvaluationResultsProps) {
  const [overrides, setOverrides] = useState<
    Record<string, CriterionOverride>
  >({});

  const handleOverride = (criterionId: string, override: CriterionOverride) => {
    setOverrides((prev) => ({ ...prev, [criterionId]: override }));
  };

  // Compute reviewer score
  const reviewerScore = result.criteria.reduce((sum, c) => {
    const ov = overrides[c.criterionId];
    if (ov?.decision === "OVERRIDE" && ov.marks !== undefined) {
      return sum + ov.marks;
    }
    return sum + (c.suggestedMarks ?? 0);
  }, 0);

  const aiScore = result.summary.suggestedScore;
  const maxScore = result.summary.maxScore;

  const effectiveStatuses = result.criteria.map((c) => {
    const ov = overrides[c.criterionId];
    return ov?.decision === "OVERRIDE" && ov.status ? ov.status : c.status;
  });

  const counts = STATUS_COUNTS(effectiveStatuses as EvaluationStatus[]);

  const STAT_CHIPS: Array<{
    label: string;
    key: EvaluationStatus;
    color: string;
  }> = [
    { label: "PASS", key: "PASS", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { label: "PARTIAL", key: "PARTIAL", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { label: "FAIL", key: "FAIL", color: "text-red-400 border-red-500/30 bg-red-500/10" },
    { label: "UNCERTAIN", key: "UNCERTAIN", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { label: "NOT DEMONSTRATED", key: "NOT_DEMONSTRATED", color: "text-slate-400 border-slate-500/30 bg-slate-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-1">
            ProofStack Evidence Review
          </h2>
          <p className="text-[11px] text-white/30 font-mono">
            Gemma provides evidence-grounded recommendations. Final judgment remains with the reviewer.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-mono text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-md transition-all"
        >
          ← New Evaluation
        </button>
      </div>

      {/* ── Score summary ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* AI Score */}
        <div className="bg-[#10131a] border border-white/8 rounded-xl p-5">
          <p className="text-[10px] font-mono font-bold tracking-widest text-white/30 uppercase mb-2">
            AI Suggested Score
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold font-mono text-white tracking-tight">
              {aiScore}
            </span>
            <span className="text-lg font-mono text-white/30">/ {maxScore}</span>
          </div>
        </div>

        {/* Reviewer Score */}
        <div className="bg-[#10131a] border border-indigo-500/20 rounded-xl p-5">
          <p className="text-[10px] font-mono font-bold tracking-widest text-indigo-400/70 uppercase mb-2">
            Reviewer Score
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold font-mono text-indigo-300 tracking-tight">
              {reviewerScore}
            </span>
            <span className="text-lg font-mono text-white/30">/ {maxScore}</span>
          </div>
        </div>

        {/* Coverage */}
        <div className="bg-[#10131a] border border-white/8 rounded-xl p-5">
          <p className="text-[10px] font-mono font-bold tracking-widest text-white/30 uppercase mb-2">
            Evidence Coverage
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold font-mono text-white tracking-tight">
              {result.summary.evidenceCoverage}
            </span>
            <span className="text-lg font-mono text-white/30">%</span>
          </div>
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${result.summary.evidenceCoverage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Status chips ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {STAT_CHIPS.map(({ label, key, color }) => (
          <div
            key={key}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-semibold ${color}`}
          >
            <span className="text-lg leading-none font-bold">{counts[key]}</span>
            <span className="tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Criteria cards ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {result.criteria.map((c, i) => (
          <CriterionResult
            key={c.criterionId}
            result={c}
            index={i + 1}
            override={overrides[c.criterionId]}
            onOverrideChange={(ov) => handleOverride(c.criterionId, ov)}
          />
        ))}
      </div>
    </div>
  );
}
