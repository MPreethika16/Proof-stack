"use client";

import { useState } from "react";
import type {
  CriterionEvaluation,
  EvaluationStatus,
  ReviewerDecision,
  CriterionOverride,
} from "@/types/evaluation";

const STATUS_META: Record<
  EvaluationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  PASS: {
    label: "PASS",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  PARTIAL: {
    label: "PARTIAL",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  FAIL: {
    label: "FAIL",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  UNCERTAIN: {
    label: "UNCERTAIN",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  NOT_DEMONSTRATED: {
    label: "NOT DEMONSTRATED",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
  },
};

const ALL_STATUSES: EvaluationStatus[] = [
  "PASS",
  "PARTIAL",
  "FAIL",
  "UNCERTAIN",
  "NOT_DEMONSTRATED",
];

interface CriterionResultProps {
  result: CriterionEvaluation;
  index: number;
  override: CriterionOverride | undefined;
  onOverrideChange: (override: CriterionOverride) => void;
}

export default function CriterionResult({
  result,
  index,
  override,
  onOverrideChange,
}: CriterionResultProps) {
  const [expanded, setExpanded] = useState(true);
  const decision = override?.decision ?? "ACCEPT";

  const displayStatus =
    decision === "OVERRIDE" && override?.status
      ? override.status
      : result.status;

  const displayMarks =
    decision === "OVERRIDE" && override?.marks !== undefined
      ? override.marks
      : result.suggestedMarks;

  const meta = STATUS_META[displayStatus];

  const handleDecision = (d: ReviewerDecision) => {
    if (d === "ACCEPT") {
      onOverrideChange({ decision: "ACCEPT" });
    } else if (d === "OVERRIDE") {
      onOverrideChange({
        decision: "OVERRIDE",
        status: result.status,
        marks: result.suggestedMarks ?? 0,
      });
    } else {
      onOverrideChange({ decision: "REQUEST_EVIDENCE" });
    }
  };

  return (
    <div
      className={`rounded-xl border ${meta.border} bg-[#10131a] overflow-hidden transition-all`}
    >
      {/* ── Card Header ─────────────────────────────────────────── */}
      <div className="flex items-start gap-4 p-5">
        {/* Index */}
        <span className="font-mono text-xs text-white/30 pt-0.5 w-6 flex-shrink-0">
          {String(index).padStart(2, "0")}
        </span>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wider font-mono ${meta.color} ${meta.bg} border ${meta.border}`}
            >
              {meta.label}
            </span>
            <span className="text-sm text-white/40 font-mono">
              {displayMarks !== null && displayMarks !== undefined
                ? `${displayMarks} / ${result.maxMarks} marks`
                : `— / ${result.maxMarks} marks`}
              {decision === "OVERRIDE" && (
                <span className="ml-2 text-indigo-400 text-xs">★ overridden</span>
              )}
            </span>
            <span className="text-xs text-white/30 font-mono ml-auto">
              CONFIDENCE {result.confidence}%
            </span>
          </div>
          <p className="text-sm text-white/80 font-medium leading-snug">
            {result.criterion}
          </p>
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 mt-0.5"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path
              d="M3 6l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Expanded body ────────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-white/5 divide-y divide-white/5">
          {/* Evidence */}
          {result.evidence && result.evidence.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-[10px] font-mono font-bold tracking-widest text-white/30 uppercase mb-3">
                Evidence
              </p>
              <div className="flex flex-col gap-2">
                {result.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/5"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="11"
                          height="11"
                          rx="2"
                          stroke="#6366f1"
                          strokeWidth="1"
                        />
                        <path
                          d="M3 6h6M3 4h3"
                          stroke="#6366f1"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-indigo-400 truncate">
                          {ev.source}
                        </span>
                        {ev.timestamp && (
                          <span className="text-[10px] font-mono text-white/30 flex-shrink-0">
                            {ev.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed italic">
                        &ldquo;{ev.observation}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-mono font-bold tracking-widest text-white/30 uppercase mb-2">
              Reasoning
            </p>
            <p className="text-xs text-white/55 leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Missing evidence */}
          {result.missingEvidence && (
            <div
              className={`px-5 py-4 ${
                decision === "REQUEST_EVIDENCE"
                  ? "bg-amber-500/10 border-t border-amber-500/20"
                  : ""
              }`}
            >
              <p className="text-[10px] font-mono font-bold tracking-widest text-amber-400/70 uppercase mb-2">
                Missing Proof
              </p>
              <p className="text-xs text-amber-300/70 leading-relaxed">
                {result.missingEvidence}
              </p>
            </div>
          )}

          {/* Human Decision Panel */}
          <div className="px-5 py-4 bg-white/[0.02]">
            <p className="text-[10px] font-mono font-bold tracking-widest text-white/30 uppercase mb-3">
              Human Decision
            </p>
            <div className="flex flex-wrap gap-2">
              {(["ACCEPT", "OVERRIDE", "REQUEST_EVIDENCE"] as ReviewerDecision[]).map(
                (d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDecision(d)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold tracking-wide border transition-all ${
                      decision === d
                        ? d === "ACCEPT"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : d === "OVERRIDE"
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                          : "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-transparent border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                    }`}
                  >
                    {d === "REQUEST_EVIDENCE" ? "REQUEST EVIDENCE" : d}
                  </button>
                )
              )}
            </div>

            {/* Override controls */}
            {decision === "OVERRIDE" && (
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <div>
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider block mb-1.5">
                    Status
                  </label>
                  <select
                    value={override?.status ?? result.status}
                    onChange={(e) =>
                      onOverrideChange({
                        decision: "OVERRIDE",
                        status: e.target.value as EvaluationStatus,
                        marks: override?.marks ?? result.suggestedMarks ?? 0,
                      })
                    }
                    className="bg-[#161b25] border border-white/10 text-white/80 text-xs font-mono rounded-md px-2.5 py-1.5 focus:outline-none focus:border-indigo-500/50"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider block mb-1.5">
                    Marks (max {result.maxMarks})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={result.maxMarks}
                    value={override?.marks ?? result.suggestedMarks ?? 0}
                    onChange={(e) =>
                      onOverrideChange({
                        decision: "OVERRIDE",
                        status: override?.status ?? result.status,
                        marks: Math.min(
                          result.maxMarks,
                          Math.max(0, parseInt(e.target.value, 10) || 0)
                        ),
                      })
                    }
                    className="w-20 bg-[#161b25] border border-white/10 text-white/80 text-sm font-mono rounded-md px-2.5 py-1.5 text-right focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
