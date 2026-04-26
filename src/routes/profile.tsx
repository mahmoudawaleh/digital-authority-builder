import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — M2 Digital Authority" },
      {
        name: "description",
        content:
          "Claim and customize your business profile on M2. Add your logo, bio, links and start building digital authority.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("Dahabshiil Bank");
  const [category, setCategory] = useState("Banking");
  const [bio, setBio] = useState(
    "Somaliland's leading financial institution. 50 years of remittance heritage, modern digital banking, trusted by 2 million customers across East Africa.",
  );
  const [website, setWebsite] = useState("dahabshiil.com");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl font-bold md:text-5xl">Your Business Profile</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-muted">
          A complete, verified profile is the fastest way to climb the rankings. The more you fill
          in, the higher your authority score.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
          <div className="mb-7 flex items-center gap-5">
            <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-primary-light bg-primary-pale text-3xl transition-colors hover:bg-surface">
              📷
            </div>
            <div>
              <div className="font-semibold">Upload your logo</div>
              <div className="text-sm text-ink-muted">PNG or SVG · 512×512 recommended</div>
            </div>
          </div>

          <div className="grid gap-5">
            <Field label="Business name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Industry">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cursor-pointer rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
                >
                  {["Banking", "Telecom", "Healthcare", "Education", "Retail", "Logistics", "Technology", "NGO"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="City">
                <select className="cursor-pointer rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15">
                  {["Hargeisa", "Berbera", "Burao", "Borama"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Website">
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
              />
            </Field>

            <Field label="Business bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="resize-y rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email">
                <input
                  type="email"
                  placeholder="contact@dahabshiil.com"
                  className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  placeholder="+252 ..."
                  className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg">Save Profile</Button>
              <Button size="lg" variant="outline">
                Generate AI Bio
              </Button>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-gradient-brand p-7 text-white lg:sticky lg:top-[88px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55">
            Live Preview
          </div>

          <div className="mt-5 text-center">
            <div className="font-serif text-5xl font-bold leading-none text-gold-light">73</div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
              Authority Score
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="font-serif text-2xl font-semibold">{name || "Your business"}</div>
            <div className="mt-1 text-sm text-white/60">{category}</div>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {bio || "Add a bio to give visitors and AI search engines context about your business."}
            </p>
          </div>

          {website && (
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/85">
                🌐 {website}
              </span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/85">
                ✓ Verified
              </span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink-mid">{label}</label>
      {children}
    </div>
  );
}
