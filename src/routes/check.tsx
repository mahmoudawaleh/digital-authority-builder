import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Free Score Checker — M2 Digital Authority" },
      {
        name: "description",
        content:
          "Enter any business name or website. Our AI engine analyzes it across 6 dimensions and gives you a complete authority score with actionable recommendations.",
      },
      { property: "og:title", content: "Free Authority Score Checker — M2" },
      {
        property: "og:description",
        content: "Get a complete digital authority score in seconds. No account needed.",
      },
    ],
  }),
  component: CheckPage,
});

const DIMS = [
  { icon: "🔍", name: "SEO", value: 78 },
  { icon: "🛡️", name: "Trust", value: 84 },
  { icon: "🤖", name: "AI Visibility", value: 62 },
  { icon: "🔗", name: "Backlinks", value: 71 },
  { icon: "📝", name: "Content", value: 69 },
  { icon: "💬", name: "Engagement", value: 75 },
];

const INSIGHTS = [
  {
    sev: "high",
    label: "Missing structured data",
    text: "Your site lacks schema.org markup, making it invisible to AI search engines like ChatGPT and Perplexity. Estimated revenue impact: ~$1,200/mo.",
  },
  {
    sev: "med",
    label: "Slow Largest Contentful Paint (3.4s)",
    text: "Page load is 38% slower than your category average. Mobile users are bouncing before content appears.",
  },
  {
    sev: "low",
    label: "Add 12 more authority backlinks",
    text: "You're 12 backlinks below the median for top-ranked businesses in your category. We can auto-generate 8 from verified directories.",
  },
];

function CheckPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | { score: number }>(null);

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults({ score: 73 });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
        <h1 className="font-serif text-4xl font-bold text-ink md:text-5xl">Digital Score Checker</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Enter any business name or website URL and our AI engine will analyze it across 6
          dimensions and give you a complete authority score with actionable recommendations.
        </p>

        <form onSubmit={analyze} className="mt-7 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="e.g. dahabshiil.com or Telesom"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border-2 border-surface bg-card px-4 py-3 text-base outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
          />
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Now →"}
          </Button>
        </form>

        <p className="mt-3 text-xs text-ink-muted">
          ✓ No account needed · ✓ Results in seconds · ✓ Powered by AI
        </p>
      </div>

      {(loading || results) && (
        <div className="mt-8 animate-fade-in-up space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-gradient-brand p-9 text-center text-white">
              <div className="font-serif text-7xl font-bold leading-none text-gold-light md:text-8xl">
                {loading ? "—" : results?.score}
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                Authority Score
              </div>
              <div className="mt-3 font-serif text-xl font-semibold text-primary-pale">
                {loading ? "Analyzing…" : "Grade: B+ (Strong)"}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-7">
              <h3 className="mb-4 font-serif text-xl font-semibold">Score Breakdown</h3>
              <div className="flex flex-col gap-3.5">
                {DIMS.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className="w-8 text-center text-lg">{d.icon}</div>
                    <div className="flex-1">
                      <div className="mb-1 text-xs font-semibold text-ink-mid">{d.name}</div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000"
                          style={{ width: loading ? "0%" : `${d.value}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-9 text-right font-serif text-base font-bold text-primary">
                      {loading ? "—" : d.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <h3 className="mb-4 font-serif text-xl font-semibold">AI Analysis & Recommendations</h3>
            {loading ? (
              <p className="py-6 text-center text-ink-muted">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-surface border-t-primary" />{" "}
                Generating insights…
              </p>
            ) : (
              <div>
                {INSIGHTS.map((it) => (
                  <div key={it.label} className="flex gap-3 border-b border-border py-4 last:border-0">
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        it.sev === "high"
                          ? "bg-destructive"
                          : it.sev === "med"
                            ? "bg-gold"
                            : "bg-primary-light"
                      }`}
                    />
                    <div className="text-sm leading-relaxed text-ink-mid">
                      <div className="mb-1 text-sm font-semibold text-ink">{it.label}</div>
                      {it.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && (
            <Button asChild size="lg" className="w-full">
              <Link to="/profile">Claim This Profile & Start Improving →</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
