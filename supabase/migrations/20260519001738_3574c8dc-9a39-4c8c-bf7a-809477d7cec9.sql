
CREATE TABLE public.studio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  tool TEXT NOT NULL,
  title TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  output TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX studio_projects_client_idx ON public.studio_projects (client_id, created_at DESC);

ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read studio projects"
  ON public.studio_projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert studio projects"
  ON public.studio_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update studio projects"
  ON public.studio_projects FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete studio projects"
  ON public.studio_projects FOR DELETE
  USING (true);
