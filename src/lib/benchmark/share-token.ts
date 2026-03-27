export interface SharePayload {
  v: 1;
  score: number;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  percentileLabel?: string;
}

function toBase64Url(json: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  const bin = encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/g,
    (_, h: string) => String.fromCharCode(parseInt(h, 16)),
  );
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string): string {
  let b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf8");
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeShareToken(payload: SharePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeShareToken(token: string): SharePayload | null {
  try {
    const json = fromBase64Url(token);
    const data = JSON.parse(json) as SharePayload;
    if (data.v !== 1 || typeof data.score !== "number") return null;
    if (data.score < 0 || data.score > 100) return null;
    if (![1, 2, 3, 4, 5].includes(data.level)) return null;
    return data;
  } catch {
    return null;
  }
}
