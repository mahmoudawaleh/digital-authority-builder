import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getClientId } from "@/lib/client-id";
import { toast } from "sonner";

type Project = {
  id: string;
  tool: string;
  title: string;
  output: string;
  created_at: string;
  updated_at: string;
};

const TOOL_META: Record<string, { icon: string; label: string }> = {
  bio: { icon: "✍️", label: "Business Bio" },
  blog: { icon: "📝", label: "Blog Post" },
  social: { icon: "💬", label: "Social Posts" },
  press: { icon: "📰", label: "Press Release" },
  compare: { icon: "⚔️", label: "Competitor Compare" },
};

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "My Projects — Saved AI Studio Content | M2" },
      {
        name: "description",
        content:
          "Your saved AI Studio content, grouped by date. Reopen any project to refine or regenerate.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("studio_projects")
        .select("id, tool, title, output, created_at, updated_at")
        .eq("client_id", getClientId())
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Couldn't load projects");
        setProjects([]);
        return;
      }
      setProjects((data ?? []) as Project[]);
    })();
  }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("studio_projects").delete().eq("id", id);
    if (error) return toast.error("Couldn't delete project");
    setProjects((p) => p?.filter((x) => x.id !== id) ?? null);
    toast.success("Deleted");
  };

  const grouped = groupByDay(projects ?? []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">My Projects</h1>
          <p className="mt-3 max-w-2xl text-base text-ink-muted">
            Everything you've generated in the AI Studio, grouped by date. Reopen any project to
            view, edit, or regenerate.
          </p>
        </div>
        <Button asChild>
          <Link to="/studio">＋ New in Studio</Link>
        </Button>
      </div>

      {projects === null && <p className="text-ink-muted">Loading…</p>}

      {projects !== null && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-ink-muted">No saved projects yet.</p>
          <Button asChild className="mt-4">
            <Link to="/studio">Open AI Studio</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {grouped.map(([day, items]) => (
          <section key={day}>
            <h2 className="mb-4 font-serif text-xl font-semibold text-ink-mid">{day}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((p) => {
                const meta = TOOL_META[p.tool] ?? { icon: "📄", label: p.tool };
                return (
                  <article
                    key={p.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-soft"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{meta.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                          {meta.label}
                        </div>
                        <div className="truncate text-base font-semibold text-ink">{p.title}</div>
                        <div className="mt-0.5 text-xs text-ink-muted">
                          {new Date(p.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="line-clamp-3 text-sm leading-relaxed text-ink-mid">
                      {p.output.slice(0, 220)}
                      {p.output.length > 220 ? "…" : ""}
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link to="/studio" search={{ project: p.id }}>
                          Reopen
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => remove(p.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function groupByDay(items: Project[]): [string, Project[]][] {
  const map = new Map<string, Project[]>();
  for (const it of items) {
    const d = new Date(it.created_at);
    const key = d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return Array.from(map.entries());
}
