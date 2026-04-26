import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "AI Studio — Generate Authority Content | M2" },
      {
        name: "description",
        content:
          "Generate SEO-optimized bios, blog posts, social content, and competitor playbooks using advanced AI.",
      },
    ],
  }),
  component: StudioPage,
});

const TOOLS = [
  { id: "bio", icon: "✍️", label: "Business Bio Generator" },
  { id: "blog", icon: "📝", label: "Blog Post Writer" },
  { id: "social", icon: "💬", label: "Social Media Posts" },
  { id: "press", icon: "📰", label: "Press Release" },
  { id: "compare", icon: "⚔️", label: "Competitor Compare" },
];

function StudioPage() {
  const [active, setActive] = useState("bio");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setOutput("");
    setTimeout(() => {
      setLoading(false);
      setOutput(
        active === "bio"
          ? `Dahabshiil Bank is Somaliland's leading financial institution, trusted by over 2 million customers across East Africa. Headquartered in Hargeisa, we combine 50 years of remittance heritage with modern digital banking — offering instant transfers, business accounts, and SME lending tailored to the local economy.\n\nRecognized as the #1 ranked bank by M2 Authority Score, Dahabshiil powers the financial backbone of Somaliland's growing private sector.`
          : active === "blog"
            ? `# 5 Reasons Your Hargeisa Business Needs Structured Data in 2026\n\nIf your business doesn't show up when customers ask ChatGPT or Google AI a question, you're invisible. Here's how to fix it…`
            : active === "social"
              ? `🚀 Big news — we just hit #14 in Somaliland's Technology rankings!\n\nThanks to every customer who trusted us this year. The journey from #19 to #14 is just the beginning.\n\n#Somaliland #Tech #Hargeisa`
              : active === "press"
                ? `FOR IMMEDIATE RELEASE\n\nHargeisa, Somaliland — A leading Somaliland enterprise has earned recognition as a top-ranked digital authority…`
                : "Generated competitor analysis…",
      );
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl font-bold md:text-5xl">AI Content Studio</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          Generate authority-building content in seconds. SEO-optimized bios, blog posts, social
          content, press releases, and competitor playbooks — all powered by AI trained on
          high-ranking businesses.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-[88px]">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActive(t.id);
                setOutput("");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                active === t.id
                  ? "bg-primary-pale font-semibold text-primary"
                  : "text-ink-mid hover:bg-cream"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        <div>
          <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
            <h2 className="font-serif text-2xl font-semibold">
              {TOOLS.find((t) => t.id === active)?.label}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {active === "compare"
                ? "Compare your business head-to-head with any competitor."
                : "Tell the AI a few details — it handles the rest."}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {active === "compare" ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <Input label="Your Business" placeholder="Your business name" />
                  <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white sm:flex">
                    VS
                  </div>
                  <Input label="Competitor" placeholder="Competitor name or URL" />
                </div>
              ) : (
                <>
                  <Input
                    label="Business name"
                    placeholder="e.g. Dahabshiil Bank"
                    defaultValue="Dahabshiil Bank"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Industry" placeholder="Banking" defaultValue="Banking" />
                    <Input label="City" placeholder="Hargeisa" defaultValue="Hargeisa" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-mid">Key facts</label>
                    <textarea
                      placeholder="What makes the business unique?"
                      defaultValue="50 years in business, 2M customers, leader in remittance and SME lending."
                      className="min-h-[100px] resize-y rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </>
              )}

              <Button onClick={generate} disabled={loading} size="lg" className="self-start">
                {loading ? "Generating…" : "✨ Generate"}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-cream p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                AI Output
              </span>
              <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                AI
              </span>
            </div>
            <div className="min-h-[140px] whitespace-pre-wrap text-sm leading-relaxed text-ink-mid">
              {loading ? (
                <span className="inline-flex items-center gap-2 text-ink-muted">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-primary" />
                  AI is writing…
                </span>
              ) : output ? (
                output
              ) : (
                <span className="text-ink-muted">
                  Your generated content will appear here. Fill in the details and click Generate.
                </span>
              )}
            </div>
            {output && !loading && (
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  📋 Copy
                </Button>
                <Button size="sm" variant="outline">
                  🔄 Regenerate
                </Button>
                <Button size="sm">💾 Save to Profile</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  defaultValue,
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink-mid">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
