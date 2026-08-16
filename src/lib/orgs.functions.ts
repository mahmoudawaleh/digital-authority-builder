import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type OrgRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  country: string;
  bio_so: string | null;
  bio_en: string | null;
  logo_url: string | null;
  brand_color: string | null;
  website: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  socials: Record<string, string>;
  verification_status: "none" | "pending" | "verified" | "official";
  trust_score: number;
  completeness: number;
  featured: boolean;
  owner_client_id: string | null;
  created_at: string;
  updated_at: string;
};

const ListInput = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["score_desc", "score_asc", "alpha"]).default("score_desc"),
  limit: z.number().min(1).max(200).default(100),
});

export const listOrganizations = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => ListInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin.from("organizations").select("*").limit(data.limit);
    if (data.category && data.category !== "All Categories") q = q.eq("category", data.category);
    if (data.city && data.city !== "All Cities") q = q.eq("city", data.city);
    if (data.status && data.status !== "All Status") q = q.eq("verification_status", data.status.toLowerCase());
    if (data.search) q = q.ilike("name", `%${data.search}%`);
    if (data.sort === "score_asc") q = q.order("trust_score", { ascending: true });
    else if (data.sort === "alpha") q = q.order("name", { ascending: true });
    else q = q.order("trust_score", { ascending: false });
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { organizations: (rows ?? []) as OrgRow[] };
  });

export const getOrganizationBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("organizations").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return { organization: (row ?? null) as OrgRow | null };
  });

export const getOrganizationsByOwner = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ owner_client_id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("organizations").select("*")
      .eq("owner_client_id", data.owner_client_id)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { organizations: (rows ?? []) as OrgRow[] };
  });

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "org";

const computeCompleteness = (o: Partial<OrgRow>) => {
  const fields = ["name","category","city","logo_url","website","phone","whatsapp","email","bio_en","bio_so","address"];
  const filled = fields.filter((f) => {
    const v = (o as Record<string, unknown>)[f];
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  return Math.round((filled / fields.length) * 100);
};

const UpsertInput = z.object({
  id: z.string().uuid().optional(),
  owner_client_id: z.string().min(1),
  name: z.string().min(1).max(120),
  slug: z.string().optional(),
  category: z.string().default("Other"),
  city: z.string().default("Hargeisa"),
  country: z.string().default("Somaliland"),
  bio_so: z.string().max(2000).optional().nullable(),
  bio_en: z.string().max(2000).optional().nullable(),
  logo_url: z.string().url().optional().nullable().or(z.literal("")),
  brand_color: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  socials: z.record(z.string(), z.string()).optional(),
});

export const upsertOrganization = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpsertInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const completeness = computeCompleteness(data);
    const trust_score = Math.min(100, 40 + Math.round(completeness * 0.5));
    const payload = {
      ...data,
      socials: data.socials ?? {},
      completeness,
      trust_score,
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("organizations").update(payload).eq("id", data.id).select("*").single();
      if (error) throw new Error(error.message);
      return { organization: row as OrgRow };
    }
    // new — generate unique slug
    let base = slugify(data.slug || data.name);
    let slug = base;
    for (let i = 1; i < 50; i++) {
      const { data: existing } = await supabaseAdmin
        .from("organizations").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${base}-${i}`;
    }
    const { data: row, error } = await supabaseAdmin
      .from("organizations").insert({ ...payload, slug }).select("*").single();
    if (error) throw new Error(error.message);
    return { organization: row as OrgRow };
  });

// ---- Dashboard metrics (all values derived from stored rows; nothing simulated) ----
export type DashboardData = {
  organization: OrgRow | null;
  categoryRank: number | null;
  categoryTotal: number;
  overallRank: number | null;
  overallTotal: number;
  studioProjects: number;
  lastStudioAt: string | null;
  generatedAt: string;
};

export const getDashboard = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ owner_client_id: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<DashboardData> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const generatedAt = new Date().toISOString();

    const { data: owned, error: ownedErr } = await supabaseAdmin
      .from("organizations").select("*")
      .eq("owner_client_id", data.owner_client_id)
      .order("updated_at", { ascending: false }).limit(1);
    if (ownedErr) throw new Error(ownedErr.message);
    const org = (owned?.[0] ?? null) as OrgRow | null;

    const { count: overallTotal } = await supabaseAdmin
      .from("organizations").select("id", { count: "exact", head: true });

    const { count: projectCount } = await supabaseAdmin
      .from("studio_projects").select("id", { count: "exact", head: true })
      .eq("client_id", data.owner_client_id);
    const { data: lastProj } = await supabaseAdmin
      .from("studio_projects").select("created_at")
      .eq("client_id", data.owner_client_id)
      .order("created_at", { ascending: false }).limit(1);

    let categoryRank: number | null = null;
    let categoryTotal = 0;
    let overallRank: number | null = null;
    if (org) {
      const { count: catTotal } = await supabaseAdmin
        .from("organizations").select("id", { count: "exact", head: true })
        .eq("category", org.category);
      categoryTotal = catTotal ?? 0;
      const { count: aheadInCat } = await supabaseAdmin
        .from("organizations").select("id", { count: "exact", head: true })
        .eq("category", org.category).gt("trust_score", org.trust_score);
      categoryRank = (aheadInCat ?? 0) + 1;
      const { count: aheadOverall } = await supabaseAdmin
        .from("organizations").select("id", { count: "exact", head: true })
        .gt("trust_score", org.trust_score);
      overallRank = (aheadOverall ?? 0) + 1;
    }

    return {
      organization: org,
      categoryRank,
      categoryTotal,
      overallRank,
      overallTotal: overallTotal ?? 0,
      studioProjects: projectCount ?? 0,
      lastStudioAt: lastProj?.[0]?.created_at ?? null,
      generatedAt,
    };
  });
