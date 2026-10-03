"use client";

import type { AppMode } from "@/types/evaluation";

interface ModeTabsProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function ModeTabs({ activeMode, onModeChange }: ModeTabsProps) {
  return (
    <div style={styles.wrapper} role="tablist" aria-label="Review mode">
      {/* Evidence Upload Tab */}
      <button
        id="tab-evidence-upload"
        role="tab"
        aria-selected={activeMode === "evidence-upload"}
        aria-controls="panel-evidence-upload"
        onClick={() => onModeChange("evidence-upload")}
        style={{
          ...styles.tab,
          ...(activeMode === "evidence-upload" ? styles.tabActive : styles.tabInactive),
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="M3 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M7.5 5v5M5 7.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Evidence Upload
      </button>

      {/* Live Proof Tab */}
      <button
        id="tab-live-proof"
        role="tab"
        aria-selected={activeMode === "live-proof"}
        aria-controls="panel-live-proof"
        onClick={() => onModeChange("live-proof")}
        style={{
          ...styles.tab,
          ...(activeMode === "live-proof" ? styles.tabActive : styles.tabInactive),
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="7.5" cy="7.5" r="2" fill="currentColor" opacity="0.5" />
        </svg>
        Live Proof
        <span style={styles.comingBadge} aria-label="Coming next">
          Soon
        </span>
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "inline-flex",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: 4,
    gap: 4,
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.82rem",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s ease",
    letterSpacing: "0.005em",
    position: "relative" as const,
  },
  tabActive: {
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    border: "1px solid var(--border-default)",
  },
  tabInactive: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid transparent",
  },
  comingBadge: {
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    background: "rgba(99,102,241,0.12)",
    color: "var(--accent)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 99,
    padding: "1px 6px",
    marginLeft: 2,
  },
};
