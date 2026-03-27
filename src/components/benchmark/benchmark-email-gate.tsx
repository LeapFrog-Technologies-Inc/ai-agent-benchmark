"use client";

import { useState } from "react";
import type { Answers } from "@/lib/benchmark/types";

const MUTED = "#8B95A5";
const CTA = "#00E676";

interface Props {
  score: number;
  level: number;
  answers: Answers;
  onClose: () => void;
  onSuccess: () => void;
}

export function BenchmarkEmailGate({
  score,
  level,
  answers,
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async () => {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/benchmark/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), score, level, answers }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      onSuccess();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="report-title"
        className="max-w-md w-full rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: "#141B2D" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="report-title" className="text-xl font-semibold text-white">
          Your Personalized Security Report
        </h2>
        <ul className="mt-4 space-y-2 text-sm" style={{ color: MUTED }}>
          <li className="flex gap-2">
            <span className="text-[#00E676]">✓</span>
            Detailed breakdown of each answer with remediation steps
          </li>
          <li className="flex gap-2">
            <span className="text-[#00E676]">✓</span>
            Mapping to OWASP, NIST AI RMF, and EU AI Act requirements
          </li>
          <li className="flex gap-2">
            <span className="text-[#00E676]">✓</span>
            Comparison to companies at your funding stage
          </li>
          <li className="flex gap-2">
            <span className="text-[#00E676]">✓</span>
            Downloadable PDF for your security review
          </li>
        </ul>
        <label className="mt-6 block text-sm text-white/90">
          Work email
          <input
            type="email"
            autoComplete="email"
            placeholder="work@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 text-white placeholder:text-white/35 min-h-[48px]"
          />
        </label>
        {error ? (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          disabled={pending || !email.trim()}
          onClick={submit}
          className="mt-4 w-full py-3.5 rounded-xl font-semibold text-[#0A0E1A] disabled:opacity-50 min-h-[48px]"
          style={{ backgroundColor: CTA }}
        >
          {pending ? "Sending…" : "Send My Report"}
        </button>
        <p className="mt-3 text-xs" style={{ color: MUTED }}>
          We&apos;ll send your report immediately. No spam. Unsubscribe anytime.
        </p>
        <button type="button" onClick={onClose} className="mt-4 text-sm" style={{ color: MUTED }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
