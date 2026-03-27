import Link from "next/link";
import type { Metadata } from "next";
import { decodeShareToken } from "@/lib/benchmark/share-token";
import { getLevelForScore } from "@/lib/benchmark/scoring";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const data = decodeShareToken(token);
  if (!data) {
    return { title: "Benchmark result | EarlyCore" };
  }
  const level = getLevelForScore(data.score);
  const title = `AI Agent Security Score: ${data.score}/100 — ${level.shortName}`;
  const description =
    "I assessed my organization's AI agent security maturity. Take the 2-minute benchmark and see how you compare.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const data = decodeShareToken(token);

  if (!data) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: "#0A0E1A" }}
      >
        <p className="text-white/80 text-center">This benchmark link is invalid or expired.</p>
        <Link href="/" className="mt-6 text-[#00E676] font-medium hover:underline">
          Take the assessment
        </Link>
      </div>
    );
  }

  const level = getLevelForScore(data.score);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0E1A" }}>
      <header className="px-6 py-5 flex justify-between items-center">
        <span className="text-sm font-semibold text-white/90">EarlyCore</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 text-center max-w-lg mx-auto">
        <p className="text-xs uppercase tracking-widest text-[#8B95A5]">AI agent security maturity</p>
        <p
          className="mt-6 text-7xl font-bold tabular-nums text-white"
          style={{ textShadow: `0 0 40px ${level.color}44` }}
        >
          {data.score}
        </p>
        <p className="mt-4 text-xl font-semibold" style={{ color: level.color }}>
          {level.name}
        </p>
        {data.percentileLabel ? (
          <p className="mt-3 text-sm text-[#8B95A5]">{data.percentileLabel}</p>
        ) : null}
        <p className="mt-10 text-lg text-white/90">
          How secure are <span className="text-[#00E676] font-medium">your</span> AI agents?
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-[#0A0E1A] min-h-[48px] bg-[#00E676] hover:opacity-95 transition-opacity"
        >
          Take the free assessment
        </Link>
      </main>
    </div>
  );
}
