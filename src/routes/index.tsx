import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ScoreCard, SectionLabel } from "@/components/score-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "M2 — Get Verified, Get Ranked, Get Customers" },
      {
        name: "description",
        content:
          "The digital intelligence platform that transforms your business into a trusted, high-ranking authority across Google, AI search, and social media.",
      },
      { property: "og:title", content: "M2 — Digital Authority Engine" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "Africa's first digital authority engine — get verified, get ranked, get customers.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Score Engine",
    desc: "6-dimensional scoring covering SEO, Trust, AI Visibility, Backlinks, Content & Engagement. Real analysis, not guesswork.",
  },
  {
    icon: "💰",
    title: "Business Impact Analysis",
    desc: "We don't just say \"you have errors.\" We quantify exactly how much revenue you're losing and how to recover it.",
  },
  {
    icon: "🏆",
    title: "National Ranking System",
    desc: "The first-ever digital ranking system for Somaliland businesses. Know your position, beat your competitors.",
  },
  {
    icon: "🤖",
    title: "AI Content Studio",
    desc: "Generate SEO-optimized business bios, blog posts, social content, and press releases using advanced AI in seconds.",
  },
  {
    icon: "🔗",
    title: "Authority Backlink Engine",
    desc: "Automatic backlink generation through verified directories, citations, and business profiles. Real authority, not spam.",
  },
  {
    icon: "📊",
    title: "Competitor Intelligence",
    desc: "See exactly why competitors outrank you and get a step-by-step playbook to overtake them.",
  },
];

const topRanks = [
  { rank: 1, name: "Dahabshiil Bank", city: "Hargeisa", category: "Banking", score: 94, status: "Verified", color: "var(--primary)" },
  { rank: 2, name: "Telesom", city: "Hargeisa", category: "Telecom", score: 91, status: "Premium", color: "var(--gold)" },
  { rank: 3, name: "Somtel", city: "Hargeisa", category: "Telecom", score: 88, status: "Verified", color: "#5a7fbe" },
  { rank: 4, name: "Edna Hospital", city: "Hargeisa", category: "Healthcare", score: 86, status: "Verified", color: "#c0392b" },
  { rank: 5, name: "University of Hargeisa", city: "Hargeisa", category: "Education", score: 84, status: "Verified", color: "#2d5a7f" },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-pale px-3.5 py-1.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            🌍 Africa's First Digital Authority Engine
          </span>

          <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] text-ink md:text-6xl">
            Get <em className="text-primary">Verified.</em>
            <br />
            Get <em className="text-primary">Ranked.</em>
            <br />
            Get <em className="italic text-gold">Customers.</em>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            The digital intelligence platform that transforms your business into a trusted,
            high-ranking authority across Google, AI search, and social media.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-elegant">
              <Link to="/check">Check Your Score Free →</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/rankings">View Rankings</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-5 text-sm font-medium text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-primary-light">✓</span> 100% Free to Start
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-primary-light">✓</span> No Technical Skills Needed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-primary-light">✓</span> Instant Score
            </span>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute -top-5 right-0 z-10 animate-float rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary shadow-soft">
            Illustrative preview
          </div>
          <div
            className="absolute bottom-5 -left-5 z-10 animate-float rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-gold shadow-soft"
            style={{ animationDelay: "2s" }}
          >
            🏆 #1 Ranked — Banking
          </div>

          <ScoreCard
            business="Dahabshiil Bank"
            category="Banking"
            city="Hargeisa"
            initials="DH"
            score={94}
            dims={[
              { name: "SEO", value: 91 },
              { name: "Trust", value: 96 },
              { name: "AI Visibility", value: 88 },
              { name: "Backlinks", value: 93 },
            ]}
          />
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-gradient-brand">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 text-center md:grid-cols-4 md:px-10">
          {[
            { num: "1,240+", label: "Businesses Indexed" },
            { num: "18", label: "Industry Categories" },
            { num: "94K+", label: "Profile Views / Month" },
            { num: "$2.1M", label: "Business Impact Tracked" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-4xl font-bold text-gold-light md:text-5xl">{s.num}</div>
              <div className="mt-1 text-xs font-medium text-white/65 md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 max-w-2xl">
          <SectionLabel>Why M2</SectionLabel>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink md:text-5xl">
            Built for the market <em className="text-primary">every global tool ignores</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            We combine digital intelligence, economic data, and AI to give businesses in East Africa
            a system that actually works for them.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary-pale hover:shadow-soft"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-serif text-xl font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RANKINGS PREVIEW */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel className="!text-gold-light before:!hidden [&::before]:!bg-gold-light">
                Illustrative rankings
              </SectionLabel>
              <h2 className="mt-3 font-serif text-4xl font-bold text-white">
                Top Businesses in Somaliland
              </h2>
            </div>
            <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/rankings">View Full Rankings →</Link>
            </Button>
          </div>

          <p className="mb-5 text-sm text-primary-foreground">Source: fixed sample values, not the current M2 ranking records. No calculation date or independent evidence is available. <Link to="/rankings" className="underline">Open stored rankings and evidence →</Link></p>

          <div className="hidden grid-cols-[60px_1fr_140px_100px_120px_120px] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/40 md:grid">
            <div>Rank</div>
            <div>Business</div>
            <div>Category</div>
            <div>Score</div>
            <div>City</div>
            <div>Status</div>
          </div>

          <div className="flex flex-col gap-2">
            {topRanks.map((r) => (
              <div
                key={r.rank}
                className="grid grid-cols-[50px_1fr_80px] items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 md:grid-cols-[60px_1fr_140px_100px_120px_120px] md:px-5"
              >
                <div className="font-serif text-2xl font-bold text-gold-light">#{r.rank}</div>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-bold text-white"
                    style={{ background: r.color }}
                  >
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="text-xs text-white/40">{r.city}</div>
                  </div>
                </div>
                <div className="hidden text-sm text-white/70 md:block">{r.category}</div>
                <div className="font-serif text-2xl font-bold text-primary-light md:block">
                  {r.score}
                </div>
                <div className="hidden text-sm text-white/60 md:block">{r.city}</div>
                <div className="hidden md:block">
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/70">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-brand relative overflow-hidden px-6 py-24 text-center md:px-10">
        <div className="relative mx-auto max-w-3xl">
          <SectionLabel className="!text-gold-light">Start Today</SectionLabel>
          <h2 className="mt-3 font-serif text-5xl font-bold leading-tight text-white">
            Your competitors are <em className="text-gold-light">already moving.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Every day you're invisible online is a day your competitors capture your customers.
            Join the businesses dominating Somaliland's digital landscape.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90">
              <Link to="/check">Get Your Free Score →</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to="/profile">Create Free Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
