"use client";

export default function WorkflowIndicator() {
  const steps = [
    { label: "Rubric", icon: "▦", description: "Define criteria" },
    { label: "Evidence", icon: "⊞", description: "Upload proof" },
    { label: "Gemma", icon: "◈", description: "AI evaluation" },
    { label: "Human Review", icon: "⊙", description: "Final decision" },
  ] as const;

  return (
    <div style={styles.wrapper} aria-label="Evaluation workflow">
      {steps.map((step, i) => (
        <div key={step.label} style={styles.stepGroup}>
          <div style={{ ...styles.step, ...(i === 3 ? styles.stepHighlighted : {}) }}>
            <span style={styles.icon} aria-hidden="true">
              {step.icon}
            </span>
            <div>
              <div style={styles.label}>{step.label}</div>
              <div style={styles.description}>{step.description}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={styles.arrow} aria-hidden="true">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path
                  d="M0 5h13M10 1l4 4-4 4"
                  stroke="var(--border-emphasis)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: "12px 20px",
    flexWrap: "wrap" as const,
    rowGap: 8,
  },
  stepGroup: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 10px",
    borderRadius: "var(--radius-sm)",
  },
  stepHighlighted: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-default)",
  },
  icon: {
    fontSize: "0.9rem",
    color: "var(--accent)",
    fontFamily: "var(--font-geist-mono)",
    lineHeight: 1,
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "0.01em",
    lineHeight: 1.3,
  },
  description: {
    fontSize: "0.62rem",
    color: "var(--text-muted)",
    letterSpacing: "0.02em",
    lineHeight: 1.3,
  },
  arrow: {
    padding: "0 6px",
    opacity: 0.6,
  },
};
