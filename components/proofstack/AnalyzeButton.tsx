"use client";

import { useState } from "react";

interface AnalyzeButtonProps {
  hasEvidence: boolean;
  hasCriteria: boolean;
}

export default function AnalyzeButton({ hasEvidence, hasCriteria }: AnalyzeButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  const isReady = hasEvidence && hasCriteria;

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  };

  return (
    <section style={styles.section} aria-labelledby="analyze-heading">
      <div style={styles.sectionHead}>
        <div style={styles.sectionLabel}>03</div>
        <div>
          <h2 id="analyze-heading" style={styles.heading}>
            Ready to evaluate?
          </h2>
          <p style={styles.subheading}>
            Gemma will assess each criterion against the uploaded evidence.
          </p>
        </div>
      </div>

      <div style={styles.actionRow}>
        <button
          id="analyze-evidence-button"
          type="button"
          onClick={handleClick}
          disabled={false} /* Phase 1: always enabled for demo */
          aria-label="Analyze evidence with Gemma"
          style={styles.button}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" opacity="0.4" />
            <circle cx="9" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
            <circle cx="9" cy="9" r="2" fill="currentColor" />
            <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Analyze Evidence
        </button>

        {/* Hints */}
        {!isReady && (
          <div style={styles.hints} aria-live="polite">
            {!hasCriteria && (
              <span style={styles.hint}>Add at least one criterion</span>
            )}
            {!hasEvidence && (
              <span style={styles.hint}>Upload at least one file</span>
            )}
          </div>
        )}
      </div>

      {/* Phase 2 message */}
      {showMessage && (
        <div
          role="status"
          aria-live="polite"
          style={styles.phaseMessage}
        >
          <div style={styles.phaseIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Z" stroke="var(--accent)" strokeWidth="1.2" />
              <path d="M8 5v4M8 11v.5" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <p style={styles.phaseText}>
            Gemma evaluation will be connected in Phase 2.
          </p>
        </div>
      )}

      {/* Reviewer note */}
      <div style={styles.reviewerNote}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="var(--text-muted)" strokeWidth="1" />
          <path d="M6.5 5.5v4M6.5 4v-.5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span style={styles.reviewerNoteText}>
          AI findings are advisory. The human reviewer always makes the final scoring decision.
        </span>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },
  sectionLabel: {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--accent)",
    fontFamily: "var(--font-geist-mono)",
    background: "var(--accent-dim)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "var(--radius-sm)",
    padding: "3px 7px",
    marginTop: 3,
    flexShrink: 0,
  },
  heading: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  subheading: {
    fontSize: "0.78rem",
    color: "var(--text-secondary)",
    marginTop: 2,
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap" as const,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "var(--accent)",
    border: "none",
    borderRadius: "var(--radius-md)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    padding: "13px 28px",
    transition: "all 0.15s ease",
    boxShadow: "0 0 24px var(--accent-glow)",
  },
  hints: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  hint: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  phaseMessage: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--accent-dim)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
  },
  phaseIcon: {
    flexShrink: 0,
  },
  phaseText: {
    fontSize: "0.82rem",
    color: "var(--accent)",
    fontWeight: 500,
  },
  reviewerNote: {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    borderTop: "1px solid var(--border-subtle)",
    paddingTop: 14,
  },
  reviewerNoteText: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
};
