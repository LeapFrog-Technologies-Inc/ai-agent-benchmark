import type { BenchmarkQuestion } from "./types";

export const QUESTIONS_PART2: BenchmarkQuestion[] = [
  {
    id: "q6",
    text: "Can you reconstruct exactly what an AI agent did, what inputs it received, and what outputs it produced?",
    weight: 1.0,
    options: [
      { letter: "A", label: "No structured logs", detail: "AI agent activity not logged in a structured way", points: 5 },
      { letter: "B", label: "Generic logs only", detail: "Basic app logs; no agent-specific audit trails", points: 10 },
      { letter: "C", label: "Partial traceability", detail: "Inputs/outputs logged; limited decision traceability", points: 25 },
      { letter: "D", label: "Comprehensive audit trails", detail: "Inputs, outputs, tool calls, retention per compliance", points: 35 },
    ],
    gapByAnswer: {
      A: "No AI audit trail",
      B: "Weak agent logging",
      C: "Incomplete forensic traceability",
      D: "Strong audit and logging",
    },
  },
  {
    id: "q7",
    text: "How do you evaluate the security of third-party AI agents, plugins, or tools before deploying them?",
    weight: 0.9,
    options: [
      { letter: "A", label: "No vetting", detail: "Teams adopt tools as needed", points: 5 },
      { letter: "B", label: "Informal reviews", detail: "Informal reviews; no formal security evaluation", points: 10 },
      { letter: "C", label: "Checklist reviews", detail: "Review checklist including data handling and access", points: 20 },
      { letter: "D", label: "Full third-party assessment", detail: "Data handling, provenance, API security, ongoing monitoring", points: 35 },
    ],
    gapByAnswer: {
      A: "No third-party AI vetting",
      B: "Informal third-party reviews only",
      C: "Incomplete supply-chain assessment",
      D: "Mature third-party AI vetting",
    },
  },
  {
    id: "q8",
    text: "Do you monitor your AI agents' behavior for anomalies, such as unusual data access patterns, unexpected outputs, or deviation from expected behavior?",
    weight: 1.2,
    options: [
      { letter: "A", label: "No behavioral monitoring", detail: "No monitoring for AI agent behavior", points: 5 },
      { letter: "B", label: "Reactive only", detail: "Notice obvious failures; no active anomaly detection", points: 10 },
      { letter: "C", label: "Error alerting", detail: "Alerting for errors; not behavioral anomalies", points: 20 },
      { letter: "D", label: "Real-time behavioral monitoring", detail: "Anomaly detection, alerting, IR for deviations", points: 40 },
    ],
    gapByAnswer: {
      A: "No behavioral monitoring",
      B: "Limited anomaly detection",
      C: "No behavioral anomaly program",
      D: "Strong behavioral monitoring",
    },
  },
  {
    id: "q9",
    text: "If one of your AI agents was compromised or started behaving maliciously right now, how quickly could you contain it?",
    weight: 1.0,
    options: [
      { letter: "A", label: "No plan", detail: "Would respond ad hoc", points: 5 },
      { letter: "B", label: "Undocumented response", detail: "Could shut down in hours; no documented procedure", points: 10 },
      { letter: "C", label: "General IR plan", detail: "General IR plan adaptable to AI incidents", points: 20 },
      { letter: "D", label: "AI-specific IR", detail: "Kill switches, playbooks, roles, drills", points: 35 },
    ],
    gapByAnswer: {
      A: "No AI incident response plan",
      B: "Undocumented containment procedures",
      C: "IR not tailored to AI agents",
      D: "Mature AI incident response",
    },
  },
  {
    id: "q10",
    text: "How do you ensure your AI agents remain compliant with your security policies over time as models update, configurations change, and new agents are deployed?",
    weight: 1.3,
    options: [
      { letter: "A", label: "Deploy and forget", detail: "Rarely revisit security posture after deployment", points: 5 },
      { letter: "B", label: "Infrequent manual reviews", detail: "Periodic manual reviews (quarterly or less)", points: 10 },
      { letter: "C", label: "Mixed automation", detail: "Scheduled reviews and some automated checks; gaps remain", points: 20 },
      { letter: "D", label: "Continuous compliance", detail: "Automated compliance, drift detection, remediation", points: 40 },
    ],
    gapByAnswer: {
      A: "No ongoing compliance assurance",
      B: "Infrequent compliance reviews",
      C: "Gaps in continuous compliance",
      D: "Strong drift and compliance monitoring",
    },
  },
];
