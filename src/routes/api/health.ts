import { createFileRoute } from "@tanstack/react-router";

type Check = { status: "ok" | "degraded" | "down" | "unconfigured"; detail?: string; latency_ms?: number };

async function timed(fn: () => Promise<Check>): Promise<Check> {
  const t = Date.now();
  try {
    const r = await fn();
    return { ...r, latency_ms: Date.now() - t };
  } catch (e) {
    return { status: "down", detail: e instanceof Error ? e.message : "unknown error", latency_ms: Date.now() - t };
  }
}

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const database = await timed(async () => {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error, count } = await supabaseAdmin
            .from("organizations")
            .select("id", { count: "exact", head: true });
          if (error) return { status: "down", detail: error.message };
          return { status: "ok", detail: `${count ?? 0} organizations` };
        });

        const ai: Check = process.env["LOVABLE_API_KEY"]
          ? { status: "ok", detail: "AI gateway key present (not called on health check)" }
          : { status: "unconfigured", detail: "LOVABLE_API_KEY missing" };

        const checks = { application: { status: "ok" } as Check, database, ai_gateway: ai };
        const worst = Object.values(checks).some((c) => c.status === "down")
          ? "down"
          : Object.values(checks).some((c) => c.status === "unconfigured")
            ? "degraded"
            : "ok";

        return new Response(
          JSON.stringify({ status: worst, checked_at: new Date().toISOString(), checks }, null, 2),
          {
            status: worst === "down" ? 503 : 200,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          },
        );
      },
    },
  },
});
