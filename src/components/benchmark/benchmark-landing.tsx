"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getOrCreateSessionId } from "@/lib/benchmark/session";
import { trackAssessmentStarted } from "@/lib/benchmark/analytics";

const BG = "#0A0E1A";
const MUTED = "#8B95A5";
const CTA = "#00E676";

export function BenchmarkLanding() {
  const router = useRouter();
  const [infoOpen, setInfoOpen] = useState(false);

  const start = () => {
    const sessionId = getOrCreateSessionId();
    const sp = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    trackAssessmentStarted({
      sessionId,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      utm_source: sp.get("utm_source") ?? undefined,
      utm_medium: sp.get("utm_medium") ?? undefined,
      utm_campaign: sp.get("utm_campaign") ?? undefined,
    });
    router.push("/assessment");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <header className="flex items-center justify-between px-4 sm:px-8 py-5">
        <span className="text-sm font-semibold tracking-tight text-white/90">EarlyCore</span>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="text-sm text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          What is this?
        </button>
      </header>

      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-8 text-center max-w-2xl mx-auto w-full"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          How Secure Are Your AI Agents?
        </h1>
        <p className="mt-5 text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>
          Take the 2-minute assessment used by 500+ security teams. Get your maturity score, a
          shareable badge, and a personalized remediation roadmap.
        </p>
        <p className="mt-4 text-sm max-w-md" style={{ color: MUTED }}>
          AI agents include copilots, chatbots, autonomous tools, and any LLM-powered automation in
          your stack.
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-10 px-8 py-3.5 rounded-xl font-semibold text-[#0A0E1A] min-h-[48px] min-w-[200px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: CTA }}
        >
          Start Free Assessment
        </button>

        <div
          className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-6 text-xs sm:text-sm w-full"
          style={{ color: MUTED }}
        >
          <p className="border border-white/10 rounded-lg px-3 py-3 bg-white/[0.03]">
            Based on OWASP Top 10 for LLM Applications
          </p>
          <p className="border border-white/10 rounded-lg px-3 py-3 bg-white/[0.03]">
            Aligned with NIST AI RMF
          </p>
          <p className="border border-white/10 rounded-lg px-3 py-3 bg-white/[0.03]">
            No login required
          </p>
        </div>
      </main>

      {infoOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          role="presentation"
          onClick={() => setInfoOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="benchmark-info-title"
            className="max-w-lg w-full rounded-2xl border border-white/10 p-6 shadow-xl text-left"
            style={{ backgroundColor: "#141B2D" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="benchmark-info-title" className="text-lg font-semibold text-white">
              AI Agent Security Maturity Benchmark
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
              This free benchmark measures how mature your organization&apos;s controls are across
              inventory, permissions, prompt injection, outputs, data exposure, logging, third-party
              AI, monitoring, incident response, and continuous compliance. It takes about two minutes
              and does not require an account.
            </p>
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="mt-6 text-sm font-medium"
              style={{ color: CTA }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
