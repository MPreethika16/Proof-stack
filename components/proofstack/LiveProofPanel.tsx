"use client";

export default function LiveProofPanel() {
  return (
    <div
      id="panel-live-proof"
      role="tabpanel"
      aria-labelledby="tab-live-proof"
      style={styles.wrapper}
    >
      <div style={styles.icon} aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke="var(--border-emphasis)" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="20" cy="20" r="8" stroke="var(--border-emphasis)" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2.5" fill="var(--text-muted)" />
        </svg>
      </div>
      <h2 style={styles.title}>Live Proof Mode</h2>
      <p style={styles.description}>
        Provide a deployed website URL and ProofStack will gather visual evidence from your live product automatically.
      </p>
      <div style={styles.badge}>
        <span style={styles.badgeDot} aria-hidden="true" />
        Coming in the next phase
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "72px 24px",
    textAlign: "center" as const,
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    minHeight: 360,
  },
  icon: {
    opacity: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    letterSpacing: "-0.01em",
  },
  description: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    maxWidth: 380,
    lineHeight: 1.6,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-default)",
    borderRadius: 99,
    padding: "6px 14px",
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    marginTop: 8,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--text-muted)",
    opacity: 0.5,
  },
};
