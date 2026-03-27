import type { LevelInfo } from "./types";

const W = 1200;
const H = 630;

export function drawBadgeCanvas(
  ctx: CanvasRenderingContext2D,
  score: number,
  level: LevelInfo,
  percentileLabel: string,
): void {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#0A0E1A");
  g.addColorStop(1, "#141B2D");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#ffffff";
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.fillText("EarlyCore", 48, 52);

  ctx.fillStyle = "#8B95A5";
  ctx.font = "500 16px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AI AGENT SECURITY MATURITY", W / 2, 120);

  const cx = W / 2;
  const cy = 300;
  const r = 140;
  const ring = 14;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = ring;
  ctx.stroke();

  const end = (score / 100) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, end);
  ctx.strokeStyle = level.color;
  ctx.lineWidth = ring;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 72px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(score), cx, cy);

  ctx.fillStyle = level.color;
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.fillText(level.name.toUpperCase(), cx, cy + r + 48);

  ctx.fillStyle = "#8B95A5";
  ctx.font = "400 18px system-ui, sans-serif";
  ctx.fillText(percentileLabel, cx, cy + r + 92);

  const now = new Date();
  const dateStr = now.toLocaleString("en-US", { month: "long", year: "numeric" });
  ctx.textAlign = "left";
  ctx.fillText(`Assessed ${dateStr}`, 48, H - 40);

  ctx.textAlign = "right";
  ctx.fillText("benchmark.earlycore.ai", W - 48, H - 40);
}

export function renderBadgePngBlob(
  score: number,
  level: LevelInfo,
  percentileLabel: string,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }
    drawBadgeCanvas(ctx, score, level, percentileLabel);
    canvas.toBlob((b) => resolve(b), "image/png", 0.95);
  });
}

export const BADGE_DIMENSIONS = { width: W, height: H };
