import type { BenchmarkQuestion } from "./types";

export const QUESTIONS_PART1: BenchmarkQuestion[] = [
  {
    id: "q1",
    text: "How well do you know what AI agents are running in your organization?",
    weight: 1.2,
    options: [
      { letter: "A", label: "No central visibility", detail: "Teams deploy AI tools without central tracking", points: 5 },
      { letter: "B", label: "Informal awareness", detail: "Rough idea, but no formal inventory", points: 15 },
      { letter: "C", label: "Documented list", detail: "Spreadsheet or document listing known AI agents", points: 25 },
      { letter: "D", label: "Automated inventory", detail: "Continuously updated inventory of agents, permissions, and data access", points: 40 },
    ],
    gapByAnswer: {
      A: "No agent inventory",
      B: "Incomplete agent inventory",
      C: "Manual-only agent tracking",
      D: "Strong agent visibility",
    },
  },
  {
    id: "q2",
    text: "How are permissions managed for your AI agents?",
    weight: 1.0,
    options: [
      { letter: "A", label: "Broad access", detail: "Agents typically have broad access; permissions not restricted", points: 5 },
      { letter: "B", label: "Inconsistent scoping", detail: "Some agents scoped; not consistent", points: 15 },
      { letter: "C", label: "Manual least-privilege", detail: "Least-privilege with manual permission reviews", points: 25 },
      { letter: "D", label: "Policy-as-code", detail: "Permissions enforced via policy-as-code with audits", points: 35 },
    ],
    gapByAnswer: {
      A: "Over-permissioned agents",
      B: "Inconsistent permission scoping",
      C: "Manual permission reviews only",
      D: "Strong permission controls",
    },
  },
  {
    id: "q3",
    text: "How do you handle the risk of prompt injection attacks on your AI agents?",
    weight: 1.3,
    options: [
      { letter: "A", label: "Not assessed", detail: "Unsure what prompt injection is or not considered", points: 5 },
      { letter: "B", label: "Awareness only", detail: "Aware of risk; no specific defenses yet", points: 10 },
      { letter: "C", label: "Basic defenses", detail: "Input validation and filtering on some agents", points: 20 },
      { letter: "D", label: "Layered defenses", detail: "Sanitization, output validation, monitoring, red-teaming", points: 35 },
    ],
    gapByAnswer: {
      A: "No prompt injection defenses",
      B: "Prompt injection not mitigated",
      C: "Partial prompt injection coverage",
      D: "Strong prompt injection program",
    },
  },
  {
    id: "q4",
    text: "Do you validate or monitor what your AI agents output before it reaches users or downstream systems?",
    weight: 1.0,
    options: [
      { letter: "A", label: "No output checks", detail: "Outputs go directly to users or systems", points: 5 },
      { letter: "B", label: "Model safety only", detail: "Rely on built-in model safety filters", points: 10 },
      { letter: "C", label: "Partial filtering", detail: "Some filtering for toxicity or PII; not comprehensive", points: 20 },
      { letter: "D", label: "Full validation layers", detail: "Accuracy, safety, PII, policy checks before delivery", points: 35 },
    ],
    gapByAnswer: {
      A: "No output validation",
      B: "Minimal output validation",
      C: "Incomplete output validation",
      D: "Comprehensive output validation",
    },
  },
  {
    id: "q5",
    text: "How do you control what data your AI agents can access and potentially expose?",
    weight: 1.1,
    options: [
      { letter: "A", label: "Unrestricted data access", detail: "Agents can access whatever they need", points: 5 },
      { letter: "B", label: "Ad hoc limits", detail: "Some limits; no systematic policy", points: 10 },
      { letter: "C", label: "Classification-based", detail: "Data classification; agents restricted by sensitivity", points: 20 },
      { letter: "D", label: "Per-agent enforcement", detail: "Policies per agent with monitoring and alerts", points: 35 },
    ],
    gapByAnswer: {
      A: "Uncontrolled data exposure risk",
      B: "No systematic data controls",
      C: "Gaps in data access enforcement",
      D: "Strong data exposure controls",
    },
  },
];
