"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BENCHMARK_QUESTIONS } from "@/lib/benchmark/questions";
import {
  computeFinalScore,
  getIndustryHigherThanPercent,
  getLevelForScore,
  getThreeKeyGaps,
} from "@/lib/benchmark/scoring";
import type { Answers } from "@/lib/benchmark/types";
import { loadBenchmarkPayload } from "@/lib/benchmark/session";
import {
  trackAssessmentCompleted,
  trackBadgeDownloaded,
  trackBadgeLinkCopied,
  trackBadgeSharedLinkedIn,
  trackEmailSubmitted,
  trackResultsViewed,
} from "@/lib/benchmark/analytics";
import { encodeShareToken } from "@/lib/benchmark/share-token";
import { BADGE_DIMENSIONS, drawBadgeCanvas, renderBadgePngBlob } from "@/lib/benchmark/badge-canvas";
import { BenchmarkEmailGate } from "@/components/benchmark/benchmark-email-gate";

const BG = "#0A0E1A";
const MUTED = "#8B95A5";
const CTA = "#00E676";

const R = 42;
const C = 2 * Math.PI * R;

export function BenchmarkResults() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [phase, setPhase] = useState<"gauge" | "content">("gauge");
  const [gaugeScore, setGaugeScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const analyticsRef = useRef(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const payload = loadBenchmarkPayload();
    if (!payload?.answers) {
      router.replace("/");
      return;
    }
    const all = BENCHMARK_QUESTIONS.every((q) => payload.answers[q.id]);
    if (!all) {
      router.replace("/assessment");
      return;
    }
    setAnswers(payload.answers);
  }, [router]);

  const score = answers ? computeFinalScore(answers) : 0;
  const level = getLevelForScore(score);
  const gaps = answers ? getThreeKeyGaps(answers) : [];
  const higherThan = getIndustryHigherThanPercent(score);
  const percentileLabel = `Top ${Math.max(1, 100 - higherThan)}% of assessed companies`;

  useEffect(() => {
    if (!answers || phase !== "gauge") return;
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 2;
      const s = Math.round(score * eased);
      setGaugeScore(s);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setPhase("content");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [answers, score, phase]);

  useEffect(() => {
    if (phase !== "content" || !answers || analyticsRef.current) return;
    analyticsRef.current = true;
    trackAssessmentCompleted({ score, level: level.level });
    trackResultsViewed({ score, level: level.level });

    const sp = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    void fetch("/api/benchmark/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: loadBenchmarkPayload()?.sessionId ?? "unknown",
        answers,
        score,
        level: level.level,
        utm_source: sp.get("utm_source") ?? undefined,
        utm_medium: sp.get("utm_medium") ?? undefined,
        utm_campaign: sp.get("utm_campaign") ?? undefined,
      }),
    }).catch(() => {});
  }, [phase, answers, score, level.level]);

  useEffect(() => {
    if (phase !== "content") return;
    let raf = 0;
    const start = performance.now();
    const duration = 600;
    const from = 0;
    const to = score;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 2;
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, score]);

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = 0.35;
    canvas.width = BADGE_DIMENSIONS.width * scale;
    canvas.height = BADGE_DIMENSIONS.height * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
    drawBadgeCanvas(ctx, score, level, percentileLabel);
  }, [score, level, percentileLabel]);

  useEffect(() => {
    if (badgeOpen) {
      window.requestAnimationFrame(drawPreview);
    }
  }, [badgeOpen, drawPreview]);

  const shareUrl = () => {
    if (typeof window === "undefined") return "";
    const token = encodeShareToken({
      v: 1,
      score,
      level: level.level,
      levelName: level.shortName,
      percentileLabel,
    });
    return `${window.location.origin}/r/${token}`;
  };

  const downloadPng = async () => {
    const blob = await renderBadgePngBlob(score, level, percentileLabel);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-security-score-${score}.png`;
    a.click();
    URL.revokeObjectURL(url);
    trackBadgeDownloaded();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      trackBadgeLinkCopied();
    } catch {
      // ignore
    }
  };

  const shareLinkedIn = () => {
    const u = encodeURIComponent(shareUrl());
    trackBadgeSharedLinkedIn();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!answers) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <p style={{ color: MUTED }}>Loading results…</p>
      </div>
    );
  }

  const strokeOffset = C * (1 - gaugeScore / 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <header className="px-4 sm:px-8 py-4 flex justify-between items-center">
        <span className="text-sm font-semibold text-white/90">EarlyCore</span>
        <Link href="/" className="text-xs" style={{ color: MUTED }}>
          Home
        </Link>
      </header>

      <main className="flex-1 px-4 sm:px-6 max-w-xl mx-auto w-full pb-16">
        {phase === "gauge" ? (
          <div className="flex flex-col items-center justify-center min-h-[55vh] gap-6">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={level.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={strokeOffset}
                  style={{ transition: "stroke-dashoffset 50ms linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white tabular-nums">{gaugeScore}</span>
              </div>
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              Your AI agent security score
            </p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="text-center pt-4">
              <motion.p
                className="text-6xl sm:text-7xl font-bold text-white tabular-nums"
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                {displayScore}
              </motion.p>
              <p className="mt-3 text-xl font-semibold" style={{ color: level.color }}>
                {level.name}
              </p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed px-2" style={{ color: MUTED }}>
                {level.summaryLine}
              </p>
            </div>

            <div
              className="rounded-xl border border-white/10 px-4 py-3"
              style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <p className="text-sm" style={{ color: MUTED }}>
                You scored higher than{" "}
                <span className="text-white font-medium">{higherThan}%</span> of companies in this
                benchmark sample at a similar maturity stage.
              </p>
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${higherThan}%`, backgroundColor: CTA }}
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white mb-2">Three key gaps</h2>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: MUTED }}>
                {gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setEmailOpen(true)}
                className="flex-1 py-3.5 rounded-xl font-semibold text-[#0A0E1A] min-h-[48px]"
                style={{ backgroundColor: CTA }}
              >
                Get Your Full Report
              </button>
              <button
                type="button"
                onClick={() => setBadgeOpen(true)}
                className="flex-1 py-3.5 rounded-xl font-semibold border-2 border-white/25 text-white min-h-[48px] hover:bg-white/5"
              >
                Share Your Badge
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {emailOpen ? (
        <BenchmarkEmailGate
          score={score}
          level={level.level}
          answers={answers}
          onClose={() => setEmailOpen(false)}
          onSuccess={() => {
            setEmailSuccess(true);
            setEmailOpen(false);
            trackEmailSubmitted();
          }}
        />
      ) : null}

      {emailSuccess ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60"
          role="alert"
        >
          <div
            className="max-w-md w-full rounded-2xl border border-white/10 p-6"
            style={{ backgroundColor: "#141B2D" }}
          >
            <p className="text-white font-medium">Check your inbox — your report is on the way.</p>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>
              Connect Resend/SendGrid and a PDF template in production for real delivery.
            </p>
            <button
              type="button"
              onClick={() => setEmailSuccess(false)}
              className="mt-4 text-sm font-medium"
              style={{ color: CTA }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {badgeOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
          role="presentation"
          onClick={() => setBadgeOpen(false)}
        >
          <div
            role="dialog"
            aria-labelledby="badge-title"
            className="max-w-lg w-full rounded-2xl border border-white/10 p-5 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#141B2D" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="badge-title" className="text-lg font-semibold text-white">
              Share your badge
            </h2>
            <p className="mt-2 text-xs" style={{ color: MUTED }}>
              1 in 4 security leaders who share their score start conversations with peers facing the
              same challenges.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/40">
              <canvas ref={previewRef} className="w-full h-auto block" />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={downloadPng}
                className="flex-1 py-2.5 rounded-lg font-medium text-[#0A0E1A] min-h-[44px]"
                style={{ backgroundColor: CTA }}
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="flex-1 py-2.5 rounded-lg font-medium border border-white/20 text-white min-h-[44px] hover:bg-white/5"
              >
                Copy link
              </button>
              <button
                type="button"
                onClick={shareLinkedIn}
                className="flex-1 py-2.5 rounded-lg font-medium border border-white/20 text-white min-h-[44px] hover:bg-white/5"
              >
                Share to LinkedIn
              </button>
            </div>
            <button
              type="button"
              onClick={() => setBadgeOpen(false)}
              className="mt-3 text-sm"
              style={{ color: MUTED }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
