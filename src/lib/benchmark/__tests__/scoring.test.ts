import { describe, expect, it } from "vitest";
import { BENCHMARK_QUESTIONS, WEIGHTED_MAX_SCORE } from "../questions";
import {
  computeFinalScore,
  getIndustryHigherThanPercent,
  getLevelForScore,
  getThreeKeyGaps,
  getWeightedRawScore,
} from "../scoring";
import type { Answers } from "../types";

const allD: Answers = {
  q1: "D",
  q2: "D",
  q3: "D",
  q4: "D",
  q5: "D",
  q6: "D",
  q7: "D",
  q8: "D",
  q9: "D",
  q10: "D",
};

const allA: Answers = {
  q1: "A",
  q2: "A",
  q3: "A",
  q4: "A",
  q5: "A",
  q6: "A",
  q7: "A",
  q8: "A",
  q9: "A",
  q10: "A",
};

describe("benchmark scoring", () => {
  it("matches weighted max total from product plan", () => {
    let sum = 0;
    for (const q of BENCHMARK_QUESTIONS) {
      const maxPts = Math.max(...q.options.map((o) => o.points));
      sum += maxPts * q.weight;
    }
    expect(sum).toBeCloseTo(WEIGHTED_MAX_SCORE, 5);
  });

  it("all D answers yield score 100", () => {
    expect(computeFinalScore(allD)).toBe(100);
  });

  it("all A answers yield a low score", () => {
    const s = computeFinalScore(allA);
    expect(s).toBeLessThan(25);
    expect(getLevelForScore(s).level).toBe(1);
  });

  it("getWeightedRawScore sums weighted points", () => {
    const raw = getWeightedRawScore(allD);
    expect(raw).toBeCloseTo(WEIGHTED_MAX_SCORE, 5);
  });

  it("level boundaries", () => {
    expect(getLevelForScore(0).level).toBe(1);
    expect(getLevelForScore(20).level).toBe(1);
    expect(getLevelForScore(21).level).toBe(2);
    expect(getLevelForScore(40).level).toBe(2);
    expect(getLevelForScore(41).level).toBe(3);
    expect(getLevelForScore(60).level).toBe(3);
    expect(getLevelForScore(61).level).toBe(4);
    expect(getLevelForScore(80).level).toBe(4);
    expect(getLevelForScore(81).level).toBe(5);
    expect(getLevelForScore(100).level).toBe(5);
  });

  it("industry percent is in range", () => {
    expect(getIndustryHigherThanPercent(0)).toBeGreaterThanOrEqual(5);
    expect(getIndustryHigherThanPercent(100)).toBeLessThanOrEqual(95);
  });

  it("returns three gap labels", () => {
    const gaps = getThreeKeyGaps(allA);
    expect(gaps).toHaveLength(3);
  });
});
