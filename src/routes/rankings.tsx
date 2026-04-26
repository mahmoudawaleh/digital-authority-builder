import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/score-card";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Rankings — Top Businesses in Somaliland | M2" },
      {
        name: "description",
        content:
          "Explore the live authority rankings of businesses across Somaliland — banking, telecom, healthcare, education and more.",
      },
      { property: "og:title", content: "Live Business Rankings — M2" },
      {
        property: "og:description",
        content: "Authority Score rankings updated daily across Somaliland industries.",
      },
    ],
  }),
  component: RankingsPage,
});

const ALL = [
  { name: "Dahabshiil Bank", city: "Hargeisa", category: "Banking", score: 94, status: "Verified", color: "var(--primary)" },
  { name: "Telesom", city: "Hargeisa", category: "Telecom", score: 91, status: "Premium", color: "var(--gold)" },
  { name: "Somtel", city: "Hargeisa", category: "Telecom", score: 88, status: "Verified", color: "#5a7fbe" },
  { name: "Edna Hospital", city: "Hargeisa", category: "Healthcare", score: 86, status: "Verified", color: "#c0392b" },
  { name: "University of Hargeisa", city: "Hargeisa", category: "Education", score: 84, status: "Verified", color: "#2d5a7f" },
  { name: "Berbera Port", city: "Berbera", category: "Logistics", score: 82, status: "Verified", color: "#1e6091" },
  { name: "Premier Bank", city: "Hargeisa", category: "Banking", score: 80, status: "Premium", color: "#0e7c5a" },
  { name: "Hass Petroleum", city: "Hargeisa", category: "Retail", score: 78, status: "Verified", color: "#b04a2a" },
  { name: "Amoud University", city: "Borama", category: "Education", score: 76, status: "Verified", color: "#5b4787" },
  { name: "Burao Construction Co.", city: "Burao", category: "Construction", score: 73, status: "Pending", color: "#7a6a3a" },
  { name: "GollisNet", city: "Hargeisa", category: "Technology", score: 71, status: "Verified", color: "#2d6a8f" },
  { name: "Cadaado NGO", city: "Hargeisa", category: "NGO", score: 68, status: "Verified", color: "#5a8a55" },
];

const CATEGORIES = ["All Categories", "Banking", "Telecom", "Construction", "Healthcare", "Education", "Retail", "Logistics", "Technology", "NGO"];
const CITIES = ["All Cities", "Hargeisa", "Berbera", "Burao", "Borama"];
const STATUSES = ["All Status", "Verified", "Premium", "Pending"];

function RankingsPage() {
  const [cat, setCat] = useState("All Categories");
  const [city, setCity] = useState("All Cities");
  const [status, setStatus] = useState("All Status");

  const filtered = useMemo(
    () =>
      ALL.filter(
        (r) =>
          (cat === "All Categories" || r.category === cat) &&
          (city === "All Cities" || r.city === city) &&
          (status === "All Status" || r.status === status),
      ),
    [cat, city, status],
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10">
        <SectionLabel>Live Data</SectionLabel>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Business Rankings</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-muted">
          Ranked by Authority Score — updated daily based on SEO, Trust, AI Visibility, and Engagement.
        </p>
      </div>

      <div className="mb-7 flex flex-wrap gap-3">
        <FilterSelect value={cat} onChange={setCat} options={CATEGORIES} />
        <FilterSelect value={city} onChange={setCity} options={CITIES} />
        <FilterSelect value={status} onChange={setStatus} options={STATUSES} />
        <div className="ml-auto self-center text-sm text-ink-muted">
          Showing <span className="font-semibold text-ink">{filtered.length}</span> businesses
        </div>
      </div>

      <div className="hidden grid-cols-[64px_1fr_140px_100px_110px_130px] gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-muted md:grid">
        <div>Rank</div>
        <div>Business</div>
        <div>Category</div>
        <div>Score</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((r, i) => {
          const rank = i + 1;
          const accent =
            rank === 1
              ? "border-l-4 border-l-gold"
              : rank === 2
                ? "border-l-4 border-l-ink-muted"
                : rank === 3
                  ? "border-l-4 border-l-[#cd7f32]"
                  : "";
          return (
            <div
              key={r.name}
              className={`grid grid-cols-[50px_1fr_80px] items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:translate-x-1 hover:shadow-soft md:grid-cols-[64px_1fr_140px_100px_110px_130px] md:px-6 ${accent}`}
            >
              <div className={`font-serif text-2xl font-bold ${rank === 1 ? "text-gold" : "text-ink-muted"}`}>
                #{rank}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-bold text-white"
                  style={{ background: r.color }}
                >
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{r.name}</div>
                  <div className="text-xs text-ink-muted">{r.city}</div>
                </div>
              </div>
              <div className="hidden text-sm text-ink-mid md:block">{r.category}</div>
              <div className="font-serif text-2xl font-bold text-primary md:block">{r.score}</div>
              <div className="hidden md:block">
                <StatusBadge status={r.status} />
              </div>
              <div className="hidden md:block">
                <Button asChild size="sm" variant="outline">
                  <Link to="/check">View →</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-ink-muted">
          No businesses match these filters.
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2.5 pr-9 text-sm font-medium text-ink-mid outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Verified: "bg-primary-pale text-primary",
    Premium: "bg-gold-pale text-[oklch(0.45_0.1_80)]",
    Pending: "bg-surface text-ink-muted",
  };
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${map[status] ?? map.Pending}`}>
      {status}
    </span>
  );
}
