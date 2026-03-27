import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])),
  score: z.number().int().min(0).max(100),
  level: z.number().int().min(1).max(5),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const row = parsed.data;
    if (process.env.NODE_ENV === "development") {
      console.debug("[benchmark/results]", row.sessionId, row.score, row.level);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
