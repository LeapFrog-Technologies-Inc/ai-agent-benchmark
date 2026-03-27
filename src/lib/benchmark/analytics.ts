import { track } from "@/lib/hooks/track";

export function trackAssessmentStarted(meta: {
  sessionId: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): void {
  track({
    name: "assessment_started",
    properties: {
      session_id: meta.sessionId,
      referrer: meta.referrer ?? "",
      utm_source: meta.utm_source ?? "",
      utm_medium: meta.utm_medium ?? "",
      utm_campaign: meta.utm_campaign ?? "",
    },
  });
}

export function trackQuestionAnswered(meta: {
  questionId: string;
  answer: string;
  msOnQuestion: number;
}): void {
  track({
    name: "question_answered",
    properties: {
      question_id: meta.questionId,
      answer: meta.answer,
      time_ms: meta.msOnQuestion,
    },
  });
}

export function trackAssessmentCompleted(meta: { score: number; level: number }): void {
  track({
    name: "assessment_completed",
    properties: {
      score: meta.score,
      level: meta.level,
    },
  });
}

export function trackResultsViewed(meta: { score: number; level: number }): void {
  track({
    name: "results_viewed",
    properties: {
      score: meta.score,
      level: meta.level,
    },
  });
}

export function trackBadgeDownloaded(): void {
  track({ name: "badge_downloaded" });
}

export function trackBadgeLinkCopied(): void {
  track({ name: "badge_link_copied" });
}

export function trackBadgeSharedLinkedIn(): void {
  track({ name: "badge_shared_linkedin" });
}

export function trackEmailSubmitted(): void {
  track({ name: "email_submitted" });
}
