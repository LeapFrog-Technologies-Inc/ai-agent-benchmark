import type { BenchmarkQuestion } from "./types";
import { QUESTIONS_PART1 } from "./questions-part1";
import { QUESTIONS_PART2 } from "./questions-part2";

export const BENCHMARK_QUESTIONS: BenchmarkQuestion[] = [
  ...QUESTIONS_PART1,
  ...QUESTIONS_PART2,
];

export const WEIGHTED_MAX_SCORE = 403.5;
