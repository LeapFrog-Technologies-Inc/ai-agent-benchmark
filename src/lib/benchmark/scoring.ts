import { BENCHMARK_QUESTIONS, WEIGHTED_MAX_SCORE } from "./questions";
import type { AnswerLetter, Answers, LevelInfo, QuestionId } from "./types";

const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: "Level 1: Unaware",
    shortName: "Unaware",
    description:
      "Your organization has minimal visibility into AI agent security. AI tools are being adopted without security oversight, and there are no controls in place to prevent misuse, data exposure, or compromise.",
    color: "#FF1744",
    summaryLine:
      "Your AI agents lack central visibility and foundational controls; shadow AI and data exposure risk are elevated.",
  },
  {
    level: 2,
    name: "Level 2: Reactive",
    shortName: "Reactive",
    description:
      "You're aware of some AI security risks and have taken initial steps, but your approach is ad hoc and inconsistent.",
    color: "#FF9100",
    summaryLine:
      "Your AI agents have basic protections, but you lack visibility into what they're doing and how they could be exploited.",
  },
  {
    level: 3,
    name: "Level 3: Developing",
    shortName: "Developing",
    description:
      "You have a structured approach to AI agent security with meaningful controls in place. However, gaps remain in monitoring and continuous assurance.",
    color: "#FFD600",
    summaryLine:
      "You have meaningful controls, but monitoring and continuous assurance need strengthening as adoption grows.",
  },
  {
    level: 4,
    name: "Level 4: Advanced",
    shortName: "Advanced",
    description:
      "Your AI agent security program is mature and comprehensive. You have strong controls, monitoring, and processes.",
    color: "#2979FF",
    summaryLine:
      "Your program is strong; remaining gaps are mostly in automation and scaling assurance as AI adoption accelerates.",
  },
  {
    level: 5,
    name: "Level 5: Optimized",
    shortName: "Optimized",
    description:
      "Your AI agent security program is among the most mature we've seen. You have comprehensive, automated, continuously monitored security across your AI agent fleet.",
    color: "#00E676",
    summaryLine:
      "Your AI agent security posture is among the most mature; focus on maintaining it as models and agents evolve.",
  },
];

function getOptionPoints(questionId: QuestionId, letter: AnswerLetter): number {
  const q = BENCHMARK_QUESTIONS.find((x) => x.id === questionId);
  if (!q) return 0;
  const opt = q.options.find((o) => o.letter === letter);
  return opt?.points ?? 0;
}

export function getWeightedRawScore(answers: Answers): number {
  let total = 0;
  for (const q of BENCHMARK_QUESTIONS) {
    const letter = answers[q.id];
    if (!letter) continue;
    total += getOptionPoints(q.id, letter) * q.weight;
  }
  return total;
}

export function computeFinalScore(answers: Answers): number {
  const raw = getWeightedRawScore(answers);
  if (BENCHMARK_QUESTIONS.some((q) => answers[q.id] == null)) {
    return 0;
  }
  return Math.round((raw / WEIGHTED_MAX_SCORE) * 100);
}

export function getLevelForScore(score: number): LevelInfo {
  if (score <= 20) return LEVELS[0]!;
  if (score <= 40) return LEVELS[1]!;
  if (score <= 60) return LEVELS[2]!;
  if (score <= 80) return LEVELS[3]!;
  return LEVELS[4]!;
}

export function getIndustryHigherThanPercent(score: number): number {
  const s = Math.min(100, Math.max(0, score));
  return Math.min(95, Math.max(5, Math.round(12 + s * 0.78)));
}

export interface GapItem {
  questionId: QuestionId;
  weightedContribution: number;
  label: string;
}

export function getThreeKeyGaps(answers: Answers): string[] {
  const items: GapItem[] = BENCHMARK_QUESTIONS.map((q) => {
    const letter = answers[q.id];
    if (!letter) {
      return {
        questionId: q.id,
        weightedContribution: 0,
        label: q.gapByAnswer.A,
      };
    }
    const pts = getOptionPoints(q.id, letter);
    const weightedContribution = pts * q.weight;
    return {
      questionId: q.id,
      weightedContribution,
      label: q.gapByAnswer[letter],
    };
  });

  items.sort((a, b) => a.weightedContribution - b.weightedContribution);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of items) {
    if (seen.has(it.label)) continue;
    seen.add(it.label);
    out.push(it.label);
    if (out.length >= 3) break;
  }
  return out;
}

export { LEVELS };
