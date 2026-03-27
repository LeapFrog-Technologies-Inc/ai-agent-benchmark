# AI Agent Security Maturity Benchmark

Standalone Next.js app implementing the product flow described in **`../leapfrog-sre/benchmark-product-plan.md`** (landing → 10 questions → results → badge share → email gate).

## Routes

| Path | Description |
|------|-------------|
| `/` | Hero + start assessment |
| `/assessment` | 10 questions with progress |
| `/results` | Score, level, gaps, CTAs |
| `/r/[token]` | Stateless share page (token encodes score/level) |

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # Vitest (scoring)
pnpm build
```

## Stack

- Next.js 15 (App Router), React 19, Tailwind CSS
- `motion` for transitions, `zod` for API validation, `lucide-react` for icons

## Production follow-ups

- Wire `POST /api/benchmark/results` to Redis/Postgres for aggregates
- Resend/SendGrid + PDF for full report after email capture
- PostHog (or similar) in `src/lib/hooks/track.ts`
- Upgrade Next.js when a patched release is available for your version

## License

Private / internal — align with your org.
