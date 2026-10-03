"use client";

import { useState } from "react";
import Header from "@/components/proofstack/Header";
import RubricBuilder from "@/components/proofstack/RubricBuilder";
import EvidenceUploader from "@/components/proofstack/EvidenceUploader";
import LoadingAnalysis from "@/components/proofstack/LoadingAnalysis";
import EvaluationResults from "@/components/proofstack/EvaluationResults";
import type {
  Criterion,
  EvidenceFile,
  AppPhase,
  EvaluationResult,
} from "@/types/evaluation";

const INITIAL_CRITERIA: Criterion[] = [
  { id: "c1", requirement: "User authentication works", maxMarks: 20 },
  { id: "c2", requirement: "Core workflow completes end-to-end", maxMarks: 40 },
  { id: "c3", requirement: "Failure states are handled gracefully", maxMarks: 20 },
  { id: "c4", requirement: "Final result is clearly communicated", maxMarks: 20 },
];

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("setup");
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL_CRITERIA);
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyze = async () => {
    if (isSubmitting) return;

    // Validate
    if (criteria.length === 0) {
      setError("Please add at least one criterion to the rubric.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one evidence file.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setPhase("loading");

    try {
      const formData = new FormData();
      formData.append("criteria", JSON.stringify(criteria));
      formData.append("claim", claim);
      for (const ef of files) {
        formData.append("files", ef.file);
      }

      const res = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      setResult(data as EvaluationResult);
      setPhase("results");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
      setPhase("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPhase("setup");
    setResult(null);
    setError(null);
    setIsSubmitting(false);
  };

  const totalMarks = criteria.reduce((s, c) => s + c.maxMarks, 0);
  const isReady = criteria.length > 0 && files.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0c10]" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}>
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10 pb-20">
        {/* Workflow indicator */}
        <div className="flex items-center gap-0 mb-8 bg-[#10131a] border border-white/5 rounded-xl px-5 py-3 overflow-x-auto">
          {[
            { label: "Rubric", desc: "Define criteria" },
            { label: "Evidence", desc: "Upload proof" },
            { label: "Gemma", desc: "AI evaluation" },
            { label: "Human Review", desc: "Final decision" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${i === 3 ? "bg-white/5 border border-white/10" : ""}`}>
                <div>
                  <div className="text-xs font-semibold text-white/70 whitespace-nowrap">{step.label}</div>
                  <div className="text-[10px] text-white/25 whitespace-nowrap">{step.desc}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="px-2 text-white/15">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M0 5h13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Setup phase ─────────────────────────────────────────── */}
        {(phase === "setup" || phase === "error") && (
          <div className="flex flex-col gap-5">
            <RubricBuilder criteria={criteria} onCriteriaChange={setCriteria} />
            <EvidenceUploader
              files={files}
              onFilesChange={setFiles}
              claim={claim}
              onClaimChange={setClaim}
            />

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                  <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.2" />
                  <path d="M8 5v4M8 10.5v.5" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-red-300 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Analyze section */}
            <section className="bg-[#10131a] border border-white/6 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 mt-0.5">
                  03
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-white">Ready to evaluate?</h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    Gemma will assess each criterion against your uploaded evidence.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  id="analyze-evidence-button"
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!isReady || isSubmitting}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isReady && !isSubmitting
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                      : "bg-white/5 text-white/25 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Analyzing Evidence with Gemma 4...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                        <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
                        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      Analyze Evidence
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-1">
                  {!isReady && criteria.length === 0 && (
                    <p className="text-xs text-white/30">↑ Add at least one criterion</p>
                  )}
                  {!isReady && files.length === 0 && (
                    <p className="text-xs text-white/30">↑ Upload at least one evidence file</p>
                  )}
                  {isReady && (
                    <p className="text-xs text-white/30">
                      {files.length} file{files.length !== 1 ? "s" : ""} ·{" "}
                      {criteria.length} criteria · {totalMarks} pts
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-white/20 italic border-t border-white/5 pt-4">
                Gemma provides evidence-grounded recommendations. Final judgment remains with the reviewer.
              </p>
            </section>
          </div>
        )}

        {/* ── Loading phase ───────────────────────────────────────── */}
        {phase === "loading" && (
          <div className="bg-[#10131a] border border-white/6 rounded-xl p-8">
            <LoadingAnalysis />
          </div>
        )}

        {/* ── Results phase ───────────────────────────────────────── */}
        {phase === "results" && result && (
          <EvaluationResults result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
