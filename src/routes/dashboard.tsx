import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your Authority Score | M2" },
      {
        name: "description",
        content:
          "Track your authority score, ranking, profile views, and leads. Get AI-powered recommendations to improve your digital presence.",
      },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { icon: "📊", num: "72", label: "Authority Score", trend: "↑ +8 this month", up: true },
  { icon: "🏆", num: "#14", label: "Ranking — Technology", trend: "↑ Up from #19", up: true },
  { icon: "👁", num: "2,840", label: "Profile Views", trend: "↑ +340 this week", up: true },
  { icon: "🎯", num: "34", label: "Leads Generated", trend: "↓ -3 vs last month", up: false },
];

const DIMS = [
  { name: "SEO", value: 78 },
  { name: "Trust", value: 81 },
  { name: "AI Visibility", value: 64 },
  { name: "Backlinks", value: 70 },
  { name: "Content", value: 69 },
  { name: "Engagement", value: 75 },
];

const ACTIONS = [
  { icon: "🔗", bg: "bg-primary-pale", title: "Build 5 backlinks", sub: "+6 score points" },
  { icon: "✨", bg: "bg-gold-pale", title: "Generate AI bio", sub: "Boost AI visibility" },
  { icon: "📝", bg: "bg-blue-50", title: "Publish blog post", sub: "Improve content score" },
];

const ACTIVITY = [
  { text: "Backlink earned from somalilandbiz.com", time: "2 hours ago" },
  { text: "Profile viewed by 12 visitors from Hargeisa", time: "5 hours ago" },
  { text: "AI generated 3 new social posts", time: "Yesterday" },
  { text: "You climbed from #19 to #14 in Technology", time: "2 days ago" },
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-ink-muted">Welcome back,</div>
          <h1 className="font-serif text-4xl font-bold">
            <span className="text-primary">Abdirahman Hassan</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/profile">Edit Profile</Link>
          </Button>
          <Button asChild>
            <Link to="/studio">🤖 AI Studio</Link>
          </Button>
        </div>
      </div>

      <div className="mb-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 text-2xl">{s.icon}</div>
            <div className="font-serif text-4xl font-bold text-ink">{s.num}</div>
            <div className="mt-1 text-sm font-medium text-ink-muted">{s.label}</div>
            <div className={`mt-1.5 text-xs font-semibold ${s.up ? "text-primary-light" : "text-destructive"}`}>
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-7 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Authority Score Breakdown</h2>
            <Link to="/check" className="text-sm font-semibold text-primary hover:underline">
              Improve →
            </Link>
          </div>
          <div className="mb-6 text-center">
            <div className="font-serif text-6xl font-bold text-primary">72</div>
            <div className="mt-1 text-sm font-medium text-ink-muted">Overall Authority Score</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DIMS.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex justify-between text-sm font-medium">
                  <span className="text-ink-mid">{d.name}</span>
                  <span className="font-bold text-primary">{d.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    style={{ width: `${d.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold">Quick Actions</h2>
          {ACTIONS.map((a) => (
            <div
              key={a.title}
              className="mb-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-border hover:bg-cream"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} text-lg`}>
                {a.icon}
              </div>
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-ink-muted">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl font-semibold">Recent Activity</h2>
        {ACTIVITY.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border-b border-border py-3 last:border-0"
          >
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
