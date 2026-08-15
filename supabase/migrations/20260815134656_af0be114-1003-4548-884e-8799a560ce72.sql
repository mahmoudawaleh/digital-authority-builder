-- ORGANIZATIONS: public read only; writes via trusted server code (service role)
DROP POLICY IF EXISTS "Anyone can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can update organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can delete organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can read organizations" ON public.organizations;

CREATE POLICY "Public can read organizations"
  ON public.organizations FOR SELECT TO anon, authenticated USING (true);

REVOKE INSERT, UPDATE, DELETE ON public.organizations FROM anon, authenticated;
GRANT SELECT ON public.organizations TO anon, authenticated;
GRANT ALL ON public.organizations TO service_role;

-- STUDIO PROJECTS: no direct client access at all; all access via server functions
DROP POLICY IF EXISTS "Anyone can read studio projects" ON public.studio_projects;
DROP POLICY IF EXISTS "Anyone can insert studio projects" ON public.studio_projects;
DROP POLICY IF EXISTS "Anyone can update studio projects" ON public.studio_projects;
DROP POLICY IF EXISTS "Anyone can delete studio projects" ON public.studio_projects;

REVOKE ALL ON public.studio_projects FROM anon, authenticated;
GRANT ALL ON public.studio_projects TO service_role;

ALTER TABLE public.studio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;