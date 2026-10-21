import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SectionLabel } from "@/components/score-card";
import { listOrganizations, type OrgRow } from "@/lib/orgs.functions";
import { ScoreEvidenceButton } from "@/components/score-evidence";
import { evidenceDate, rankWithin } from "@/lib/score-evidence";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Rankings — Top Businesses in Somaliland | M2" },
      { name: "description", content: "Live authority rankings of verified businesses, NGOs and institutions across Somaliland." },
      { property: "og:title", content: "Live Business Rankings — M2" },
      { property: "og:description", content: "Stored authority scores with source records, freshness, and ranking evidence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listOrganizations({ data: { sort: "score_desc", limit: 200 } }),
  component: RankingsPage,
});

const CATEGORIES = ["All Categories","Banking","Telecom","Construction","Healthcare","Education","Retail","Logistics","Technology","NGO","Government","Media"];
const CITIES = ["All Cities","Hargeisa","Berbera","Burao","Borama","Erigavo","Las Anod"];
const STATUSES = ["All Status","Verified","Official","Pending"];
const SORTS = ["Highest score","Lowest score","A → Z"];

function RankingsPage() {
  const initial = Route.useLoaderData();
  const [rows, setRows] = useState<OrgRow[]>(initial.organizations);
  const [cat, setCat] = useState("All Categories");
  const [city, setCity] = useState("All Cities");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Highest score");
  const [q, setQ] = useState("");
  const [retrievedAt, setRetrievedAt] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refetch from server when server-side filters change (search stays client-side for snappy UX)
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    const sortMap: Record<string, "score_desc" | "score_asc" | "alpha"> = {
      "Highest score": "score_desc", "Lowest score": "score_asc", "A → Z": "alpha",
    };
    listOrganizations({
      data: { category: cat, city, status: status === "Official" ? "official" : status, sort: sortMap[sort], limit: 200 },
    }).then(({ organizations }) => {
      if (!active) return;
      setRows(organizations);
      setRetrievedAt(new Date().toISOString());
    }).catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [cat, city, status, sort]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(needle) || r.category.toLowerCase().includes(needle));
  }, [rows, q]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10">
        <SectionLabel>Stored score rankings</SectionLabel>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink">Business Rankings</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-muted">
          Ranked by stored M2 scores, not measured SEO or engagement. Open each record’s evidence to see its fields and whether its score matches the current profile-completeness formula.
        </p>
        <p className="mt-3 text-xs text-ink-muted">Records retrieved: {evidenceDate(retrievedAt)} · Up to 200 records per selection. Ranks compare the returned category, city, and status selection; search narrows the view without changing ranks. Ties share a rank, even when sorted A–Z or lowest first.</p>
      </div>

      <div className="mb-7 flex flex-wrap gap-3">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search business or category…"
          className="min-w-[220px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
        />
        <FilterSelect value={cat} onChange={setCat} options={CATEGORIES} />
        <FilterSelect value={city} onChange={setCity} options={CITIES} />
        <FilterSelect value={status} onChange={setStatus} options={STATUSES} />
        <FilterSelect value={sort} onChange={setSort} options={SORTS} />
        <div className="ml-auto self-center text-sm text-ink-muted">
          Showing <span className="font-semibold text-ink">{filtered.length}</span>
        </div>
      </div>

      {loading && <p role="status" className="mb-4 text-sm text-ink-muted">Loading selected records…</p>}
      {loadError && <p role="alert" className="mb-4 text-sm text-destructive">Couldn’t retrieve this selection. Previous results are hidden; change a filter to try again.</p>}
      <div className="hidden grid-cols-[64px_minmax(0,1fr)_110px_70px_100px_120px] gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-muted md:grid">
        <div>Rank</div><div>Business</div><div>Category</div><div>Score</div><div>Status</div><div></div>
      </div>

      <div className="flex flex-col gap-2">
        {!loading && !loadError && filtered.map((r) => {
          const rank = rankWithin(rows, r.trust_score);
          const accent = rank === 1 ? "border-l-4 border-l-gold"
            : rank === 2 ? "border-l-4 border-l-ink-muted"
            : rank === 3 ? "border-l-4 border-l-primary-light" : "";
          return (
            <div
              key={r.id}
              className={`grid grid-cols-[40px_minmax(0,1fr)_55px] items-center gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[64px_minmax(0,1fr)_110px_70px_100px_120px] md:px-6 ${accent}`}
            >
              <div className={`font-serif text-2xl font-bold ${rank === 1 ? "text-gold" : "text-ink-muted"}`}>#{rank}</div>
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg font-serif text-sm font-bold text-white"
                  style={{ background: r.brand_color || "#2d5a27" }}>
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <Link to="/p/$slug" params={{ slug: r.slug }} className="break-words text-sm font-semibold text-ink hover:underline">{r.name}</Link>
                  <div className="text-xs text-ink-muted">{r.city}</div>
                </div>
              </div>
              <div className="hidden text-sm text-ink-mid md:block">{r.category}</div>
              <div className="font-serif text-2xl font-bold text-primary md:block">{r.trust_score}</div>
              <div className="hidden md:block"><StatusBadge status={r.verification_status} /></div>
              <div className="col-span-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 md:col-span-1 md:border-0 md:pt-0">
                <span className="text-xs text-ink-muted md:hidden">Updated {evidenceDate(r.updated_at)}</span>
                <ScoreEvidenceButton organization={r} retrievedAt={retrievedAt} ranking={`#${rank} of ${rows.length} returned records · ${cat}, ${city}, ${status}. ${rows.length === 200 ? "Selection reaches the 200-record limit; this is not a full-database rank." : ""}`} />
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !loadError && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-ink-muted">
          No businesses match these filters.
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2.5 pr-9 text-sm font-medium text-ink-mid outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function StatusBadge({ status }: { status: OrgRow["verification_status"] }) {
  const map: Record<string, { cls: string; label: string }> = {
    verified: { cls: "bg-primary-pale text-primary", label: "Verified" },
    official: { cls: "bg-gold text-white", label: "Official" },
    pending: { cls: "bg-gold-pale text-[oklch(0.45_0.1_80)]", label: "Pending" },
    none: { cls: "bg-surface text-ink-muted", label: "Unverified" },
  };
  const v = map[status] ?? map.none;
  return <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${v.cls}`}>{v.label}</span>;
}
