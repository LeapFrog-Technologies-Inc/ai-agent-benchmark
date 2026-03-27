"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { BENCHMARK_QUESTIONS } from "@/lib/benchmark/questions";
import type { AnswerLetter, Answers, QuestionId } from "@/lib/benchmark/types";
import { loadBenchmarkPayload, saveAnswersPartial } from "@/lib/benchmark/session";
import { trackQuestionAnswered } from "@/lib/benchmark/analytics";

const BG = "#0A0E1A";
const MUTED = "#8B95A5";
const CTA = "#00E676";

export function BenchmarkAssessment() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [startedAt] = useState(() => new Date().toISOString());
  const questionStarted = useRef<number>(Date.now());

  useEffect(() => {
    const existing = loadBenchmarkPayload();
    if (existing?.answers && Object.keys(existing.answers).length > 0) {
      const allDone = BENCHMARK_QUESTIONS.every((q) => existing.answers[q.id]);
      if (allDone) {
        router.replace("/results");
        return;
      }
      setAnswers(existing.answers);
      const answered = BENCHMARK_QUESTIONS.filter((q) => existing.answers[q.id]).length;
      setIndex(Math.min(answered, BENCHMARK_QUESTIONS.length - 1));
    }
    questionStarted.current = Date.now();
  }, [router]);

  useEffect(() => {
    questionStarted.current = Date.now();
  }, [index]);

  const current = BENCHMARK_QUESTIONS[index];
  const progress = ((index + 1) / BENCHMARK_QUESTIONS.length) * 100;

  const goBack = () => {
    if (index <= 0) {
      router.push("/");
      return;
    }
    setIndex((i) => i - 1);
  };

  const selectAnswer = useCallback(
    (letter: AnswerLetter) => {
      const qid = current.id as QuestionId;
      const ms = Date.now() - questionStarted.current;
      trackQuestionAnswered({
        questionId: qid,
        answer: letter,
        msOnQuestion: ms,
      });

      const next: Answers = { ...answers, [qid]: letter };
      setAnswers(next);
      saveAnswersPartial(next, startedAt);

      window.setTimeout(() => {
        if (index >= BENCHMARK_QUESTIONS.length - 1) {
          router.push("/results");
          return;
        }
        setIndex((i) => i + 1);
      }, 400);
    },
    [answers, current.id, index, router, startedAt],
  );

  if (!current) return null;

  const selected = answers[current.id];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <header className="flex items-center gap-3 px-4 sm:px-8 py-4">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white min-h-[48px] min-w-[48px] justify-center rounded-lg hover:bg-white/5"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs sm:text-sm" style={{ color: MUTED }}>
          Question {index + 1} of {BENCHMARK_QUESTIONS.length}
        </span>
      </header>

      <div className="px-4 sm:px-8 max-w-2xl mx-auto w-full pb-8">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: CTA }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-10"
          >
            <h1 className="text-xl font-semibold text-white leading-snug">{current.text}</h1>

            <ul className="mt-8 space-y-3" role="list">
              {current.options.map((opt) => {
                const isSelected = selected === opt.letter;
                return (
                  <li key={opt.letter}>
                    <button
                      type="button"
                      onClick={() => selectAnswer(opt.letter)}
                      className={[
                        "w-full text-left rounded-xl border-2 px-4 py-4 transition-all min-h-[48px]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A] focus-visible:ring-[#00E676]",
                        isSelected
                          ? "border-[#00E676] scale-[1.02] shadow-[0_0_20px_rgba(0,230,118,0.25)]"
                          : "border-white/15 hover:border-[#00E676]/60 hover:shadow-[0_0_12px_rgba(0,230,118,0.12)]",
                      ].join(" ")}
                      style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    >
                      <span className="block font-semibold text-white">{opt.label}</span>
                      <span className="block mt-1 text-sm" style={{ color: MUTED }}>
                        {opt.detail}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="mt-auto py-6 text-center">
        <Link href="/" className="text-xs hover:underline" style={{ color: MUTED }}>
          Exit assessment
        </Link>
      </footer>
    </div>
  );
}
