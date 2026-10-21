import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getClientId } from "@/lib/client-id";
import { getDashboard, type OrgRow } from "@/lib/orgs.functions";
import { ScoreEvidenceButton } from "@/components/score-evidence";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your Authority Score | M2" },
      {
        name: "description",
        content:
          "Track your live authority score, category ranking, profile completeness, and AI Studio activity — all read from your real M2 records.",
      },
      { property: "og:title", content: "Your M2 Authority Dashboard" },
      { property: "og:description", content: "Live authority score, ranking, and profile completeness for your business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function timeAgo(iso: string | null) {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

/** Derived sub-scores — computed from stored profile fields, not simulated. */
function dimensions(o: OrgRow) {
  const has = (v: unknown) => (typeof v === "string" && v.trim().length > 0 ? 1 : 0);
  const contact = has(o.phone) + has(o.whatsapp) + has(o.email);
  const socialCount = Object.values(o.socials ?? {}).filter((v) => typeof v === "string" && v.trim()).length;
  return [
    { name: "Profile completeness", value: o.completeness, note: `${o.completeness}% of fields filled` },
    {
      name: "Verification",
      value: o.verification_status === "official" ? 100 : o.verification_status === "verified" ? 80 : o.verification_status === "pending" ? 40 : 10,
      note: o.verification_status,
    },
    { name: "Contactability", value: Math.round((contact / 3) * 100), note: `${contact}/3 channels` },
    { name: "Web presence", value: has(o.website) ? 100 : 0, note: o.website || "no website on file" },
    { name: "Social reach", value: Math.min(100, socialCount * 25), note: `${socialCount} linked account(s)` },
    { name: "Bilingual content", value: (has(o.bio_so) + has(o.bio_en)) * 50, note: "Somali + English bios" },
  ];
}

function DashboardPage() {
  const [clientId, setClientId] = useState<string | null>(null);
  useEffect(() => setClientId(getClientId()), []);
  const fetchDashboard = useServerFn(getDashboard);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["dashboard", clientId],
    queryFn: () => {
      if (!clientId) throw new Error("No browser profile identifier");
      return fetchDashboard({ data: { owner_client_id: clientId } });
    },
    enabled: !!clientId,
  });

  if (!clientId || isPending) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-surface" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Couldn't load your dashboard</h1>
        <p className="mt-3 text-sm text-ink-muted">{error instanceof Error ? error.message : "Unknown error"}</p>
        <Button className="mt-6" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  const o = data?.organization ?? null;

  if (!o) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-4 text-5xl">🏛</div>
        <h1 className="font-serif text-3xl font-bold">No authority profile yet</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          Your dashboard reads live data from your profile. Create one and your score, ranking, and
          recommendations appear here immediately.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild><Link to="/profile">Create your profile</Link></Button>
          <Button asChild variant="outline"><Link to="/rankings">Browse rankings</Link></Button>
        </div>
        {data && data.studioProjects > 0 && (
          <p className="mt-8 text-sm text-ink-muted">
            You do have {data.studioProjects} saved AI Studio {data.studioProjects === 1 ? "project" : "projects"} —{" "}
            <Link to="/projects" className="text-primary underline">open them</Link>.
          </p>
        )}
      </div>
    );
  }

  if (!data) return null;
  const dims = dimensions(o);
  const actions = [
    o.completeness < 100 && { icon: "📝", bg: "bg-primary-pale", title: "Complete your profile fields", sub: `${100 - o.completeness}% still empty`, to: "/profile" as const },
    o.verification_status === "none" && { icon: "🛡", bg: "bg-gold-pale", title: "Request verification", sub: "Unlocks the verified badge", to: "/profile" as const },
    !o.bio_so && { icon: "🌍", bg: "bg-blue-50", title: "Add a Somali bio", sub: "Reach local searchers", to: "/studio" as const },
    !o.bio_en && { icon: "✨", bg: "bg-blue-50", title: "Generate an English bio", sub: "AI Studio can draft it", to: "/studio" as const },
    { icon: "🤖", bg: "bg-gold-pale", title: "Create authority content", sub: `${data!.studioProjects} saved project(s)`, to: "/studio" as const },
  ].filter(Boolean) as { icon: string; bg: string; title: string; sub: string; to: "/profile" | "/studio" }[];

  const stats = [
    { icon: "📊", num: String(o.trust_score), label: "Authority Score", sub: "Derived from stored profile data" },
    {
      icon: "🏆",
      num: data!.categoryRank ? `#${data!.categoryRank}` : "—",
      label: `Rank — ${o.category}`,
      sub: `of ${data!.categoryTotal} in category`,
    },
    {
      icon: "🌍",
      num: data!.overallRank ? `#${data!.overallRank}` : "—",
      label: "Rank — All businesses",
      sub: `of ${data!.overallTotal} on M2`,
    },
    { icon: "🗂", num: String(data!.studioProjects), label: "Studio Projects", sub: `last ${timeAgo(data!.lastStudioAt)}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-ink-muted">Welcome back,</div>
          <h1 className="font-serif text-4xl font-bold">
            <span className="text-primary">{o.name}</span>
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary-pale px-2 py-0.5 font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-light" /> LIVE DATA
            </span>
            <span>Updated {timeAgo(data!.generatedAt)}{isFetching ? " · refreshing…" : ""}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => refetch()} disabled={isFetching}>Refresh</Button>
          <Button asChild variant="outline"><Link to="/profile">Edit Profile</Link></Button>
          <Button asChild><Link to="/p/$slug" params={{ slug: o.slug }}>View public profile</Link></Button>
        </div>
      </div>

      <div className="mb-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 text-2xl">{s.icon}</div>
            <div className="font-serif text-4xl font-bold text-ink">{s.num}</div>
            <div className="mt-1 text-sm font-medium text-ink-muted">{s.label}</div>
            <div className="mt-1.5 text-xs font-semibold text-ink-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-7 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Authority Score Breakdown</h2>
            <ScoreEvidenceButton organization={o} retrievedAt={data.generatedAt} ranking={`Category: #${data.categoryRank} of ${data.categoryTotal} in ${o.category}. Overall: #${data.overallRank} of ${data.overallTotal} M2 records. Counts queried during this dashboard retrieval.`} />
          </div>
          <div className="mb-6 text-center">
            <div className="font-serif text-6xl font-bold text-primary">{o.trust_score}</div>
            <div className="mt-1 text-sm font-medium text-ink-muted">Overall Authority Score</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {dims.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex justify-between text-sm font-medium">
                  <span className="text-ink-mid">{d.name}</span>
                  <span className="font-bold text-primary">{d.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    style={{ width: `${Math.max(0, Math.min(100, d.value))}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-ink-muted">{d.note}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-muted">
            These indicators are not weighted inputs to the overall score. Verification maps official/verified/pending/none to 100/80/40/10; contacts count phone, WhatsApp, and email; website presence is 100 or 0; each social link adds 25 (maximum 100); each language bio adds 50. Stored claims do not prove independent verification, reachability, or audience reach.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold">Recommended Next Steps</h2>
          {actions.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="mb-1.5 flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-cream"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} text-lg`}>{a.icon}</div>
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-ink-muted">{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-1 font-serif text-xl font-semibold">Profile Activity</h2>
        <p className="mb-4 text-xs text-ink-muted">Timestamps recorded on your records.</p>
        {[
          { text: `Profile last updated — ${o.name}`, time: timeAgo(o.updated_at) },
          { text: `Profile created`, time: timeAgo(o.created_at) },
          ...(data!.lastStudioAt ? [{ text: "AI Studio content saved", time: timeAgo(data!.lastStudioAt) }] : []),
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
            <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-light" />
            <div className="flex-1">
              <div className="text-sm text-ink-mid">{a.text}</div>
              <div className="mt-0.5 text-xs text-ink-muted">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
