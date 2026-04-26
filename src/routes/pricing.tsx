import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/score-card";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — M2 Digital Authority Engine" },
      {
        name: "description",
        content:
          "Simple pricing for businesses of every size. Start free, upgrade for premium ranking, AI Studio access, and competitor intelligence.",
      },
      { property: "og:title", content: "Simple, Honest Pricing — M2" },
      {
        property: "og:description",
        content: "Free profile forever. Upgrade for premium authority tools.",
      },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    plan: "Starter",
    price: "0",
    period: "/forever",
    desc: "Perfect for getting verified and tracking your basic authority score.",
    features: [
      "Free verified business profile",
      "Monthly authority score",
      "Basic dashboard analytics",
      "Public ranking inclusion",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    plan: "Growth",
    price: "49",
    period: "/month",
    desc: "Everything you need to outrank competitors and turn visibility into customers.",
    features: [
      "Everything in Starter",
      "Weekly score updates",
      "Full AI Content Studio access",
      "Competitor intelligence reports",
      "Backlink generation engine",
      "Priority directory listings",
    ],
    cta: "Start 14-Day Trial",
    featured: true,
  },
  {
    plan: "Authority",
    price: "199",
    period: "/month",
    desc: "For market-leading brands that want to dominate their category.",
    features: [
      "Everything in Growth",
      "Daily score updates",
      "Premium ranking placement",
      "Dedicated success manager",
      "API access",
      "Custom integrations",
    ],
    cta: "Talk to Sales",
    featured: false,
  },
];

function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <SectionLabel className="justify-center">Pricing</SectionLabel>
        <h1 className="mt-3 font-serif text-5xl font-bold leading-tight">
          Simple pricing. <em className="text-primary">Real authority.</em>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Start free forever. Upgrade only when you're ready to dominate the rankings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.plan}
            className={`relative rounded-3xl border-2 p-9 transition-all ${
              p.featured
                ? "scale-[1.02] border-primary bg-gradient-brand text-white shadow-elegant"
                : "border-border bg-card hover:-translate-y-1 hover:shadow-soft"
            }`}
          >
            {p.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
            )}

            <div
              className={`text-xs font-bold uppercase tracking-widest ${
                p.featured ? "text-gold-light" : "text-ink-muted"
              }`}
            >
              {p.plan}
            </div>

            <div className={`mt-4 flex items-start font-serif font-bold leading-none ${p.featured ? "text-gold-light" : "text-ink"}`}>
              <span className="mt-2.5 text-2xl">$</span>
              <span className="text-6xl">{p.price}</span>
              <span className={`ml-1 self-end pb-2 text-sm font-normal ${p.featured ? "text-white/55" : "text-ink-muted"}`}>
                {p.period}
              </span>
            </div>

            <p
              className={`mt-4 text-sm leading-relaxed ${
                p.featured ? "text-white/75" : "text-ink-muted"
              }`}
            >
              {p.desc}
            </p>

            <ul className="mt-6 mb-7 space-y-2.5">
              {p.features.map((f) => (
                <li
                  key={f}
                  className={`flex items-start gap-2.5 text-sm ${
                    p.featured ? "text-white/90" : "text-ink-mid"
                  }`}
                >
                  <span className={p.featured ? "text-primary-pale" : "text-primary-light"}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className={`w-full ${
                p.featured
                  ? "bg-gold text-white hover:bg-gold/90"
                  : "bg-cream text-primary hover:bg-primary-pale"
              }`}
            >
              <Link to="/profile">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center md:p-10">
        <div className="font-serif text-2xl font-semibold">Need something custom?</div>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-muted">
          We build custom authority programs for governments, NGOs, and enterprises across East Africa.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link to="/profile">Contact our team</Link>
        </Button>
      </div>
    </div>
  );
}
