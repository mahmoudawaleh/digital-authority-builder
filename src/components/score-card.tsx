import { cn } from "@/lib/utils";

type Dim = { name: string; value: number };

export function ScoreCard({
  business,
  category,
  city,
  initials,
  score,
  dims,
  logoColor = "var(--primary)",
}: {
  business: string;
  category: string;
  city?: string;
  initials: string;
  score: number;
  dims: Dim[];
  logoColor?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-elegant">
      <div className="mb-4 font-serif text-lg font-semibold">Illustrative Authority Score</div>

      <div className="mb-4 flex items-center gap-3 rounded-xl bg-cream p-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl font-serif text-lg font-bold text-white"
          style={{ background: logoColor }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">{business}</div>
          <div className="text-xs text-ink-muted">
            {category}
            {city ? ` · ${city}` : ""}
          </div>
        </div>
        <span className="rounded-md bg-primary-pale px-2 py-0.5 text-xs font-semibold text-primary">
          Example
        </span>
      </div>

      <div className="py-4 text-center">
        <div className="font-serif text-7xl font-bold leading-none text-primary">{score}</div>
        <div className="mt-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
          Authority Score
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {dims.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <div className="w-20 shrink-0 text-xs text-ink-muted">{d.name}</div>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                style={{ width: `${d.value}%` }}
              />
            </div>
            <div className="w-7 text-right text-xs font-semibold text-primary">{d.value}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-ink-muted">Source: fixed demonstration values. No retrieval or measurement date; these scores and dimensions are not calculated from this business’s records and have no supporting audit evidence.</p>
    </div>
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold",
        className,
      )}
    >
      <span className="block h-0.5 w-5 bg-gold" />
      {children}
    </div>
  );
}
