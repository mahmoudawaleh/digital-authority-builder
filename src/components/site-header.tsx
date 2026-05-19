import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/rankings", label: "Rankings" },
  { to: "/check", label: "Score Checker" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/studio", label: "AI Studio" },
  { to: "/projects", label: "Projects" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
          M2<span className="text-gold">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-mid transition-colors hover:bg-primary-pale hover:text-primary data-[status=active]:bg-primary-pale data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="shadow-soft">
          <Link to="/profile">Get Free Profile</Link>
        </Button>
      </div>
    </header>
  );
}
