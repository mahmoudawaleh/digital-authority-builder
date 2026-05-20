import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getOrganizationBySlug, type OrgRow } from "@/lib/orgs.functions";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const { organization } = await getOrganizationBySlug({ data: { slug: params.slug } });
    if (!organization) throw notFound();
    return { organization };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.organization;
    if (!o) return { meta: [{ title: "Profile not found" }] };
    const desc = (o.bio_en || o.bio_so || `${o.name} — verified digital authority profile on M2.`).slice(0, 160);
    return {
      meta: [
        { title: `${o.name} — M2 Authority Profile` },
        { name: "description", content: desc },
        { property: "og:title", content: `${o.name} — Verified on M2` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        ...(o.logo_url ? [{ property: "og:image", content: o.logo_url }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/p/${o.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: o.name,
          description: desc,
          url: o.website || undefined,
          logo: o.logo_url || undefined,
          email: o.email || undefined,
          telephone: o.phone || undefined,
          address: o.address ? { "@type": "PostalAddress", streetAddress: o.address, addressLocality: o.city, addressCountry: o.country } : undefined,
        }),
      }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold">Profile not found</h1>
      <p className="mt-3 text-ink-muted">This authority profile doesn't exist or has been removed.</p>
      <Link to="/rankings" className="mt-6 inline-block text-primary underline">Browse all profiles</Link>
    </div>
  ),
  component: PublicProfile,
});

const STATUS_LABEL: Record<OrgRow["verification_status"], { label: string; cls: string }> = {
  none: { label: "Unverified", cls: "bg-surface text-ink-muted" },
  pending: { label: "Pending Review", cls: "bg-gold-pale text-[oklch(0.45_0.1_80)]" },
  verified: { label: "✓ Verified", cls: "bg-primary-pale text-primary" },
  official: { label: "★ Official", cls: "bg-gold text-white" },
};

function PublicProfile() {
  const { organization: o } = Route.useLoaderData();
  const [lang, setLang] = useState<"so" | "en">("so");
  const bio = (lang === "so" ? o.bio_so : o.bio_en) || o.bio_en || o.bio_so || "";

  const profileUrl = typeof window !== "undefined" ? window.location.href : `https://m2.so/p/${o.slug}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(profileUrl)}`;

  const waLink = o.whatsapp ? `https://wa.me/${o.whatsapp.replace(/\D/g, "")}` : null;
  const telLink = o.phone ? `tel:${o.phone}` : null;
  const mailLink = o.email ? `mailto:${o.email}` : null;
  const webLink = o.website ? (o.website.startsWith("http") ? o.website : `https://${o.website}`) : null;

  const downloadVcard = () => {
    const lines = [
      "BEGIN:VCARD","VERSION:3.0",
      `FN:${o.name}`,
      `ORG:${o.name}`,
      o.email && `EMAIL:${o.email}`,
      o.phone && `TEL:${o.phone}`,
      webLink && `URL:${webLink}`,
      o.address && `ADR:;;${o.address};${o.city};;;${o.country}`,
      `NOTE:${(o.bio_en || o.bio_so || "").replace(/\n/g, " ")}`,
      "END:VCARD",
    ].filter(Boolean).join("\n");
    const blob = new Blob([lines], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${o.slug}.vcf`; a.click();
    URL.revokeObjectURL(url);
  };

  const status = STATUS_LABEL[o.verification_status];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-16">
      {/* Hero */}
      <div
        className="overflow-hidden rounded-3xl p-8 text-white shadow-elegant md:p-12"
        style={{ background: `linear-gradient(135deg, ${o.brand_color || "#2d5a27"}, color-mix(in oklab, ${o.brand_color || "#2d5a27"} 60%, black))` }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/15 font-serif text-4xl font-bold backdrop-blur md:h-28 md:w-28">
            {o.logo_url ? <img src={o.logo_url} alt={o.name} className="h-full w-full rounded-2xl object-cover" /> : o.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${status.cls}`}>{status.label}</span>
              <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">{o.category}</span>
              <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">📍 {o.city}</span>
            </div>
            <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">{o.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-white/80">
              <button
                onClick={() => setLang("so")}
                className={`rounded px-2 py-0.5 ${lang === "so" ? "bg-white/25 text-white" : "text-white/60 hover:text-white"}`}
              >SO</button>
              <button
                onClick={() => setLang("en")}
                className={`rounded px-2 py-0.5 ${lang === "en" ? "bg-white/25 text-white" : "text-white/60 hover:text-white"}`}
              >EN</button>
            </div>
          </div>
          <div className="text-center">
            <div className="font-serif text-6xl font-bold leading-none text-gold-light">{o.trust_score}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/55">Authority Score</div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-ink-muted">About</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-mid">
            {bio || (lang === "so" ? "Sharaxaad lagama helin." : "No bio added yet.")}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {waLink && (
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe57]">
                <a href={waLink} target="_blank" rel="noreferrer">💬 WhatsApp</a>
              </Button>
            )}
            {telLink && (
              <Button asChild size="lg" variant="outline"><a href={telLink}>📞 Call</a></Button>
            )}
            {mailLink && (
              <Button asChild size="lg" variant="outline"><a href={mailLink}>✉ Email</a></Button>
            )}
            {webLink && (
              <Button asChild size="lg" variant="outline"><a href={webLink} target="_blank" rel="noreferrer">🌐 Website</a></Button>
            )}
            <Button size="lg" variant="outline" onClick={downloadVcard}>📇 Save Contact</Button>
          </div>

          {/* Contact details */}
          <div className="mt-10 grid gap-3 text-sm">
            {o.address && <DetailRow icon="📍" label="Address" value={o.address} />}
            {o.phone && <DetailRow icon="📞" label="Phone" value={o.phone} />}
            {o.whatsapp && <DetailRow icon="💬" label="WhatsApp" value={`+${o.whatsapp.replace(/\D/g, "")}`} />}
            {o.email && <DetailRow icon="✉" label="Email" value={o.email} />}
            {o.website && <DetailRow icon="🌐" label="Website" value={o.website} />}
          </div>
        </div>

        <aside className="h-fit space-y-6 lg:sticky lg:top-[88px]">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">Share Profile</div>
            <img src={qrSrc} alt="QR code" className="mx-auto mt-4 h-44 w-44 rounded-xl border border-border" />
            <div className="mt-3 break-all text-[11px] text-ink-muted">{profileUrl}</div>
          </div>

          <div className="rounded-2xl bg-gradient-brand p-6 text-white">
            <div className="text-xs font-bold uppercase tracking-widest text-white/60">Profile Completeness</div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="font-serif text-4xl font-bold text-gold-light">{o.completeness}%</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full bg-gold-light" style={{ width: `${o.completeness}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="text-lg">{icon}</div>
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</div>
        <div className="text-sm text-ink">{value}</div>
      </div>
    </div>
  );
}
