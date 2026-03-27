"use client";

import type { Answers } from "./types";

const STORAGE_KEY = "benchmark-assessment-v1";
const SESSION_KEY = "benchmark-session-id";

export interface BenchmarkSessionPayload {
  answers: Answers;
  startedAt: string;
  sessionId: string;
}

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = generateSessionId();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function loadBenchmarkPayload(): BenchmarkSessionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BenchmarkSessionPayload;
  } catch {
    return null;
  }
}

export function saveBenchmarkPayload(payload: BenchmarkSessionPayload): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function saveAnswersPartial(answers: Answers, startedAt: string): void {
  const sessionId = getOrCreateSessionId();
  saveBenchmarkPayload({ answers, startedAt, sessionId });
}
