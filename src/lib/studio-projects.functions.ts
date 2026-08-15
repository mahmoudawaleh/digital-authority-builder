import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ClientId = z.string().min(8).max(80);

const ListInput = z.object({ client_id: ClientId });

export const listStudioProjects = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => ListInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("studio_projects")
      .select("id, tool, title, output, created_at, updated_at")
      .eq("client_id", data.client_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Couldn't load projects");
    return { projects: rows ?? [] };
  });

export const getStudioProject = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), client_id: ClientId }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("studio_projects")
      .select("id, tool, title, inputs, output, created_at, updated_at")
      .eq("id", data.id)
      .eq("client_id", data.client_id)
      .maybeSingle();
    if (error) throw new Error("Couldn't load project");
    return { project: row ?? null };
  });

const SaveInput = z.object({
  id: z.string().uuid().optional(),
  client_id: ClientId,
  tool: z.enum(["bio", "blog", "social", "press", "compare"]),
  title: z.string().min(1).max(200),
  inputs: z.record(z.string(), z.string().max(5000)),
  output: z.string().max(60000),
});

export const saveStudioProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SaveInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, client_id, ...fields } = data;
    if (id) {
      const { data: row, error } = await supabaseAdmin
        .from("studio_projects")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("client_id", client_id)
        .select("id")
        .maybeSingle();
      if (error || !row) throw new Error("Couldn't update project");
      return { id: row.id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("studio_projects")
      .insert({ ...fields, client_id })
      .select("id")
      .single();
    if (error || !row) throw new Error("Couldn't save project");
    return { id: row.id };
  });

export const deleteStudioProject = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), client_id: ClientId }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("studio_projects")
      .delete()
      .eq("id", data.id)
      .eq("client_id", data.client_id);
    if (error) throw new Error("Couldn't delete project");
    return { ok: true };
  });
