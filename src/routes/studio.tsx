import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStudioProject, saveStudioProject } from "@/lib/studio-projects.functions";
import { getClientId } from "@/lib/client-id";
import { toast } from "sonner";

type SearchParams = { project?: string };

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "AI Studio — Generate Authority Content | M2" },
      {
        name: "description",
        content:
          "Generate SEO-optimized bios, blog posts, social content, and competitor playbooks using advanced AI.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    project: typeof s.project === "string" ? s.project : undefined,
  }),
  component: StudioPage,
});

const TOOLS = [
  { id: "bio", icon: "✍️", label: "Business Bio Generator" },
  { id: "blog", icon: "📝", label: "Blog Post Writer" },
  { id: "social", icon: "💬", label: "Social Media Posts" },
  { id: "press", icon: "📰", label: "Press Release" },
  { id: "compare", icon: "⚔️", label: "Competitor Compare" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

const DEFAULT_INPUTS: Record<ToolId, Record<string, string>> = {
  bio: { name: "Dahabshiil Bank", industry: "Banking", city: "Hargeisa", facts: "50 years in business, 2M customers, leader in remittance and SME lending." },
  blog: { name: "Dahabshiil Bank", industry: "Banking", city: "Hargeisa", facts: "Digital banking adoption in Somaliland 2026" },
  social: { name: "Dahabshiil Bank", industry: "Banking", city: "Hargeisa", facts: "Just hit #14 in Somaliland Technology rankings" },
  press: { name: "Dahabshiil Bank", industry: "Banking", city: "Hargeisa", facts: "Launching new SME digital lending product" },
  compare: { business: "Dahabshiil Bank", competitor: "Premier Bank" },
};

function StudioPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/studio" });
  const [active, setActive] = useState<ToolId>("bio");
  const [inputs, setInputs] = useState<Record<string, string>>(DEFAULT_INPUTS.bio);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load project from URL
  useEffect(() => {
    const id = search.project;
    if (!id || id === loadedId) return;
    (async () => {
      try {
        const { project } = await getStudioProject({
          data: { id, client_id: getClientId() },
        });
        if (!project) throw new Error("not found");
        setActive(project.tool as ToolId);
        setInputs((project.inputs ?? {}) as Record<string, string>);
        setOutput(project.output ?? "");
        setLoadedId(id);
      } catch {
        toast.error("Couldn't load project");
      }
    })();
  }, [search.project, loadedId]);


  const setField = (k: string, v: string) => setInputs((p) => ({ ...p, [k]: v }));

  const selectTool = (id: ToolId) => {
    setActive(id);
    setInputs(DEFAULT_INPUTS[id]);
    setOutput("");
    setLoadedId(null);
    if (search.project) navigate({ to: "/studio", search: {} });
  };

  const generate = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: active, inputs }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "Generation failed");
        if (res.status === 429) toast.error("Rate limit reached — try again shortly.");
        else if (res.status === 402) toast.error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
        else toast.error(msg || "Generation failed");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  }, [active, inputs]);

  const save = async () => {
    if (!output) return;
    const title =
      inputs.name || inputs.business || TOOLS.find((t) => t.id === active)?.label || "Untitled";
    const payload = {
      client_id: getClientId(),
      tool: active,
      title: `${title} — ${TOOLS.find((t) => t.id === active)?.label}`,
      inputs,
      output,
    };
    if (loadedId) {
      const { error } = await supabase
        .from("studio_projects")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", loadedId);
      if (error) return toast.error("Couldn't update project");
      toast.success("Project updated");
    } else {
      const { data, error } = await supabase
        .from("studio_projects")
        .insert(payload)
        .select("id")
        .single();
      if (error || !data) return toast.error("Couldn't save project");
      setLoadedId(data.id);
      navigate({ to: "/studio", search: { project: data.id } });
      toast.success("Saved to Projects");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-bold md:text-5xl">AI Content Studio</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Generate authority-building content in seconds. Streamed live by Lovable AI and saved to
            dated projects you can reopen anytime.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/projects">📁 My Projects</Link>
        </Button>
      </div>

      <div className="grid gap-7 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-[88px]">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTool(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                active === t.id
                  ? "bg-primary-pale font-semibold text-primary"
                  : "text-ink-mid hover:bg-cream"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        <div>
          <div className="rounded-2xl border border-border bg-card p-7 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-2xl font-semibold">
                {TOOLS.find((t) => t.id === active)?.label}
              </h2>
              {loadedId && (
                <span className="rounded-md bg-primary-pale px-2 py-1 text-xs font-semibold text-primary">
                  Editing saved project
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {active === "compare"
                ? "Compare your business head-to-head with any competitor."
                : "Tell the AI a few details — it handles the rest."}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {active === "compare" ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <Input
                    label="Your Business"
                    value={inputs.business ?? ""}
                    onChange={(v) => setField("business", v)}
                  />
                  <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-white sm:flex">
                    VS
                  </div>
                  <Input
                    label="Competitor"
                    value={inputs.competitor ?? ""}
                    onChange={(v) => setField("competitor", v)}
                  />
                </div>
              ) : (
                <>
                  <Input
                    label="Business name"
                    value={inputs.name ?? ""}
                    onChange={(v) => setField("name", v)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Industry"
                      value={inputs.industry ?? ""}
                      onChange={(v) => setField("industry", v)}
                    />
                    <Input
                      label="City"
                      value={inputs.city ?? ""}
                      onChange={(v) => setField("city", v)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-ink-mid">Key facts</label>
                    <textarea
                      value={inputs.facts ?? ""}
                      onChange={(e) => setField("facts", e.target.value)}
                      className="min-h-[100px] resize-y rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </>
              )}

              <Button onClick={generate} disabled={loading} size="lg" className="self-start">
                {loading ? "Streaming…" : "✨ Generate"}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-cream p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                AI Output {loading && <span className="ml-2 text-primary">● live</span>}
              </span>
              <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                AI
              </span>
            </div>
            <div className="min-h-[140px] whitespace-pre-wrap text-sm leading-relaxed text-ink-mid">
              {output ? (
                <>
                  {output}
                  {loading && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />}
                </>
              ) : loading ? (
                <span className="inline-flex items-center gap-2 text-ink-muted">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-primary" />
                  Asking the AI…
                </span>
              ) : (
                <span className="text-ink-muted">
                  Your generated content will appear here. Fill in the details and click Generate.
                </span>
              )}
            </div>
            {output && !loading && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={copy}>
                  📋 Copy
                </Button>
                <Button size="sm" variant="outline" onClick={generate}>
                  🔄 Regenerate
                </Button>
                <Button size="sm" onClick={save}>
                  💾 {loadedId ? "Update project" : "Save to Projects"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink-mid">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-2 border-surface bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary-mid focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
