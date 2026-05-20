import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getClientId } from "@/lib/client-id";
import {
  getOrganizationsByOwner,
  upsertOrganization,
  type OrgRow,
} from "@/lib/orgs.functions";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Authority Profile — M2" },
      { name: "description", content: "Claim and customize your verified digital authority profile on M2." },
    ],
  }),
  component: ProfilePage,
});

const CATEGORIES = ["Banking","Telecom","Healthcare","Education","Retail","Logistics","Technology","Construction","NGO","Government","Media","Other"];
const CITIES = ["Hargeisa","Berbera","Burao","Borama","Erigavo","Las Anod"];

type FormState = {
  id?: string;
  name: string;
  category: string;
  city: string;
  bio_so: string;
  bio_en: string;
  website: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo_url: string;
  brand_color: string;
};

const EMPTY: FormState = {
  name: "", category: "Banking", city: "Hargeisa",
  bio_so: "", bio_en: "", website: "", phone: "", whatsapp: "",
  email: "", address: "", logo_url: "", brand_color: "#2d5a27",
};

function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [myOrgs, setMyOrgs] = useState<OrgRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const owner = getClientId();
    getOrganizationsByOwner({ data: { owner_client_id: owner } })
      .then(({ organizations }) => {
        setMyOrgs(organizations);
        if (organizations[0]) loadOrg(organizations[0]);
      })
      .finally(() => setLoaded(true));
  }, []);

  const loadOrg = (o: OrgRow) => {
    setForm({
      id: o.id, name: o.name, category: o.category, city: o.city,
      bio_so: o.bio_so ?? "", bio_en: o.bio_en ?? "",
      website: o.website ?? "", phone: o.phone ?? "", whatsapp: o.whatsapp ?? "",
      email: o.email ?? "", address: o.address ?? "",
      logo_url: o.logo_url ?? "", brand_color: o.brand_color ?? "#2d5a27",
    });
  };

  const completeness = useMemo(() => {
    const fields: Array<keyof FormState> = ["name","category","city","logo_url","website","phone","whatsapp","email","bio_en","bio_so","address"];
    const filled = fields.filter((f) => (form[f] ?? "").toString().trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [form]);

  const trustScore = Math.min(100, 40 + Math.round(completeness * 0.5));

  const save = async () => {
    if (!form.name.trim()) { toast.error("Business name is required"); return; }
    setSaving(true);
    try {
      const owner = getClientId();
      const { organization } = await upsertOrganization({
        data: {
          id: form.id, owner_client_id: owner, name: form.name,
          category: form.category, city: form.city,
          bio_so: form.bio_so || null, bio_en: form.bio_en || null,
          logo_url: form.logo_url || null, brand_color: form.brand_color,
          website: form.website || null, phone: form.phone || null,
          whatsapp: form.whatsapp || null, email: form.email || null,
          address: form.address || null,
        },
      });
      setForm((f) => ({ ...f, id: organization.id }));
      toast.success("Profile saved", {
        action: { label: "View public →", onClick: () => navigate({ to: "/p/$slug", params: { slug: organization.slug } }) },
      });
      const { organizations } = await getOrganizationsByOwner({ data: { owner_client_id: owner } });
      setMyOrgs(organizations);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const startNew = () => setForm(EMPTY);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Your Authority Profile</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            A verified profile is the fastest way to climb the rankings. Fill in every field to raise your authority score.
          </p>
        </div>
        {myOrgs.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={form.id ?? ""}
              onChange={(e) => {
                const o = myOrgs.find((x) => x.id === e.target.value);
                if (o) loadOrg(o); else startNew();
              }}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="">+ New profile</option>
              {myOrgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <Button variant="outline" size="sm" onClick={startNew}>New</Button>
          </div>
        )}
      </div>

      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
          <div className="mb-7 flex items-center gap-5">
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary-light bg-primary-pale text-3xl"
              style={form.logo_url ? { backgroundImage: `url(${form.logo_url})`, backgroundSize: "cover" } : undefined}
            >
              {!form.logo_url && "🏢"}
            </div>
            <div className="flex-1">
              <Field label="Logo URL">
                <input
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="https://…/logo.png"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Brand">
              <input
                type="color"
                value={form.brand_color}
                onChange={(e) => setForm({ ...form, brand_color: e.target.value })}
                className="h-11 w-14 cursor-pointer rounded-xl border-2 border-surface"
              />
            </Field>
          </div>

          <div className="grid gap-5">
            <Field label="Business name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Industry">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="City">
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Website">
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="example.com" className={inputCls} />
            </Field>
            <Field label="Bio (Somali)">
              <textarea rows={3} value={form.bio_so} onChange={(e) => setForm({ ...form, bio_so: e.target.value })} className={`${inputCls} resize-y`} />
            </Field>
            <Field label="Bio (English)">
              <textarea rows={3} value={form.bio_en} onChange={(e) => setForm({ ...form, bio_en: e.target.value })} className={`${inputCls} resize-y`} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+252 …" className={inputCls} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="WhatsApp (digits only)">
                <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="252634000000" className={inputCls} />
              </Field>
              <Field label="Address">
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" onClick={save} disabled={saving}>
                {saving ? "Saving…" : form.id ? "Update Profile" : "Create Profile"}
              </Button>
              {form.id && (
                <Button asChild size="lg" variant="outline">
                  <Link to="/p/$slug" params={{ slug: myOrgs.find((o) => o.id === form.id)?.slug ?? "" }}>
                    View Public Page →
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-gradient-brand p-7 text-white lg:sticky lg:top-[88px]">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55">Live Preview</div>
          <div className="mt-5 text-center">
            <div className="font-serif text-5xl font-bold leading-none text-gold-light">{trustScore}</div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">Authority Score</div>
          </div>
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="font-serif text-2xl font-semibold">{form.name || "Your business"}</div>
            <div className="mt-1 text-sm text-white/60">{form.category} · {form.city}</div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/75">
              {form.bio_en || form.bio_so || "Add a bio so AI search engines understand your business."}
            </p>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-white/60">
              <span>Completeness</span><span>{completeness}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-gold-light transition-all" style={{ width: `${completeness}%` }} />
            </div>
          </div>
          {!loaded && <div className="mt-4 text-xs text-white/50">Loading your profiles…</div>}
        </aside>
      </div>
    </div>
  );
}

const inputCls = "rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none focus:border-primary-mid focus:ring-2 focus:ring-primary/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink-mid">{label}</label>
      {children}
    </div>
  );
}
