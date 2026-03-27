export type AnswerLetter = "A" | "B" | "C" | "D";

export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10";

export type Answers = Partial<Record<QuestionId, AnswerLetter>>;

export interface AnswerOption {
  letter: AnswerLetter;
  label: string;
  detail: string;
  points: number;
}

export interface BenchmarkQuestion {
  id: QuestionId;
  text: string;
  weight: number;
  options: AnswerOption[];
  gapByAnswer: Record<AnswerLetter, string>;
}

export interface LevelInfo {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  shortName: string;
  description: string;
  color: string;
  summaryLine: string;
}
