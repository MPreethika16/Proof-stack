"use client";

import { useState, useCallback, useRef } from "react";
import type { EvidenceFile } from "@/types/evaluation";

interface EvidenceUploaderProps {
  files: EvidenceFile[];
  onFilesChange: (files: EvidenceFile[]) => void;
  claim: string;
  onClaimChange: (claim: string) => void;
}

function getFileType(file: File): EvidenceFile["type"] {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  return "other";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EvidenceUploader({
  files,
  onFilesChange,
  claim,
  onClaimChange,
}: EvidenceUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      const newEntries: EvidenceFile[] = arr.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        type: getFileType(file),
      }));
      onFilesChange([...files, ...newEntries]);
    },
    [files, onFilesChange]
  );

  const removeFile = (id: string) => onFilesChange(files.filter((f) => f.id !== id));

  return (
    <section className="bg-[#10131a] border border-white/6 rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 mt-0.5">
          02
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white">Evidence</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Upload the proof that will be evaluated against the rubric.
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        id="evidence-drop-zone"
        aria-label="Drop files or click to select"
        className={`border-dashed border rounded-lg p-8 text-center cursor-pointer flex flex-col items-center gap-3 transition-all ${
          isDragOver
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-white/10 hover:border-white/20 bg-[#0a0c10]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,image/png,image/jpeg,image/jpg"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              addFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="opacity-40">
          <rect x="4" y="6" width="24" height="20" rx="3" stroke="white" strokeWidth="1.5" />
          <path d="M16 22V12M11 16l5-5 5 5" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-semibold text-white/70">Drop your proof here</p>
        <p className="text-xs text-white/30 max-w-xs leading-relaxed">
          Short demo video (≤45 sec recommended) and up to 3 screenshots.
        </p>
        <div className="flex gap-2 mt-1">
          {["MP4", "PNG", "JPG"].map((f) => (
            <span key={f} className="text-[10px] font-mono text-white/30 bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((ef) => (
            <li
              key={ef.id}
              className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5"
            >
              <span className="text-indigo-400 flex-shrink-0">
                {ef.type === "video" ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M11 6l4-2v8l-4-2V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="5.5" cy="5.5" r="1.5" fill="currentColor" opacity="0.6" />
                    <path d="M1.5 11l4-4 3 3 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 truncate font-medium">{ef.file.name}</p>
                <p className="text-[10px] text-white/30 font-mono flex gap-2 mt-0.5">
                  <span className="text-indigo-400/70 uppercase">{ef.type}</span>
                  <span>{formatBytes(ef.file.size)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(ef.id)}
                aria-label={`Remove ${ef.file.name}`}
                className="text-white/20 hover:text-white/60 transition-colors p-1"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Participant claim */}
      <div className="flex flex-col gap-2">
        <label htmlFor="participant-claim" className="text-xs font-semibold text-white/40 flex items-center gap-2">
          Participant Claim
          <span className="text-[10px] font-normal text-white/20 bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
            optional
          </span>
        </label>
        <textarea
          id="participant-claim"
          value={claim}
          onChange={(e) => onClaimChange(e.target.value)}
          placeholder="Briefly describe what this evidence demonstrates…"
          rows={3}
          className="bg-[#0a0c10] border border-white/10 rounded-lg text-sm text-white/70 placeholder:text-white/20 px-3 py-2.5 resize-y focus:outline-none focus:border-indigo-500/40 leading-relaxed"
        />
      </div>
    </section>
  );
}
