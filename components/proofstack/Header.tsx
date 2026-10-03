"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0c10]/90 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#6366f1" opacity="0.9" />
              <rect x="12" y="1" width="9" height="9" rx="2" fill="#6366f1" opacity="0.5" />
              <rect x="1" y="12" width="9" height="9" rx="2" fill="#6366f1" opacity="0.5" />
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#6366f1" opacity="0.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">
              ProofStack
            </h1>
            <p className="text-[11px] text-white/40 mt-0.5">
              Show the evidence. Keep the judgment human.
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3 py-1.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_#6366f1]" />
          <span className="text-[11px] font-mono font-semibold text-indigo-400">
            Gemma 4
          </span>
        </div>
      </div>
    </header>
  );
}
