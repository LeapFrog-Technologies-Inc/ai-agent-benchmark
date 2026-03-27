import { NextResponse } from "next/server";
import { z } from "zod";

const personalDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

const bodySchema = z.object({
  email: z.string().email(),
  score: z.number().int().min(0).max(100),
  level: z.number().int().min(1).max(5),
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])).optional(),
});

function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !personalDomains.has(domain);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { email } = parsed.data;
    if (!isWorkEmail(email)) {
      return NextResponse.json(
        {
          error: "Please use your work email for industry-specific insights.",
          code: "PERSONAL_EMAIL",
        },
        { status: 422 },
      );
    }
    if (process.env.NODE_ENV === "development") {
      console.debug("[benchmark/report] queued for", email);
    }
    return NextResponse.json({ ok: true, message: "Report queued" });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
