"use client";

import { useState, useCallback } from "react";
import type { Criterion } from "@/types/evaluation";

interface RubricBuilderProps {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
}

function generateId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function RubricBuilder({ criteria, onCriteriaChange }: RubricBuilderProps) {
  const total = criteria.reduce((s, c) => s + (c.maxMarks || 0), 0);

  const addCriterion = () =>
    onCriteriaChange([...criteria, { id: generateId(), requirement: "", maxMarks: 10 }]);

  const update = useCallback(
    (id: string, patch: Partial<Omit<Criterion, "id">>) =>
      onCriteriaChange(criteria.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [criteria, onCriteriaChange]
  );

  const remove = (id: string) =>
    onCriteriaChange(criteria.filter((c) => c.id !== id));

  return (
    <section className="bg-[#10131a] border border-white/6 rounded-xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 mt-0.5 flex-shrink-0">
          01
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-white">
            What should this submission prove?
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            Define evaluation criteria and allocate marks.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-3xl font-bold font-mono text-white tracking-tight leading-none">
            {total}
          </div>
          <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-0.5">
            pts total
          </div>
        </div>
      </div>

      {/* Criteria rows */}
      <ul className="flex flex-col gap-2">
        {criteria.map((c, i) => (
          <CriterionRow
            key={c.id}
            index={i}
            criterion={c}
            onChange={(patch) => update(c.id, patch)}
            onRemove={() => remove(c.id)}
            canRemove={criteria.length > 1}
          />
        ))}
      </ul>

      {/* Add button */}
      <button
        id="add-criterion-button"
        type="button"
        onClick={addCriterion}
        className="flex items-center justify-center gap-2 w-full border border-dashed border-white/10 hover:border-white/20 text-white/30 hover:text-white/50 rounded-lg py-2.5 text-xs font-medium transition-all"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add criterion
      </button>
    </section>
  );
}

function CriterionRow({
  index,
  criterion,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  criterion: Criterion;
  onChange: (patch: Partial<Omit<Criterion, "id">>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <li
      className={`flex items-center gap-3 bg-[#161b25] border rounded-lg px-3 py-2.5 transition-colors ${
        focused ? "border-white/15" : "border-white/5"
      }`}
    >
      <span className="text-[10px] font-mono text-white/25 w-5 flex-shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <input
        id={`criterion-req-${criterion.id}`}
        type="text"
        value={criterion.requirement}
        onChange={(e) => onChange({ requirement: e.target.value })}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Describe the requirement…"
        className="flex-1 bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/20 min-w-0"
      />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <input
          id={`criterion-marks-${criterion.id}`}
          type="number"
          min={1}
          max={999}
          value={criterion.maxMarks}
          onChange={(e) =>
            onChange({ maxMarks: Math.max(1, parseInt(e.target.value, 10) || 1) })
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-12 bg-[#0a0c10] border border-white/10 rounded text-xs font-mono text-white/70 text-right px-1.5 py-1 outline-none"
        />
        <span className="text-[10px] font-mono text-white/25">pts</span>
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove criterion ${index + 1}`}
          className="text-white/20 hover:text-red-400/60 transition-colors p-1 flex-shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3h8M4.5 3V2h3v1M5 5.5v3M7 5.5v3M2.5 3l.6 6.2a.5.5 0 0 0 .5.45h4.8a.5.5 0 0 0 .5-.45L9.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </li>
  );
}
