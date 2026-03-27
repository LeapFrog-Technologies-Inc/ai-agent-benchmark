type TrackEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export function track(event: TrackEvent): void {
  try {
    if (process.env.NODE_ENV === "development") {
      console.debug("[track]", event.name, event.properties);
    }
  } catch {
    // Never crash the UI for analytics
  }
}
