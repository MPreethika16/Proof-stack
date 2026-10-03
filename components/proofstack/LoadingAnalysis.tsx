"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading reviewer rubric…",
  "Inspecting multimodal evidence…",
  "Mapping evidence to criteria…",
  "Checking unsupported claims…",
  "Building evidence matrix…",
];

export default function LoadingAnalysis() {
  const [stageIndex, setStageIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through stages slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] gap-10">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border border-indigo-500/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </div>

      {/* Stage list */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {STAGES.map((stage, i) => {
          const isDone = i < stageIndex;
          const isActive = i === stageIndex;
          return (
            <div
              key={stage}
              className="flex items-center gap-3 transition-all duration-500"
              style={{ opacity: isActive ? 1 : isDone ? 0.5 : 0.2 }}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? "border-indigo-500 bg-indigo-500"
                    : isActive
                    ? "border-indigo-500 animate-pulse"
                    : "border-white/10"
                }`}
              >
                {isDone && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm font-mono ${
                  isActive ? "text-white" : "text-white/40"
                }`}
              >
                {isActive ? `${stage}${dots}` : stage}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/30 font-mono">
        Gemma 4 is analyzing your evidence…
      </p>
    </div>
  );
}
