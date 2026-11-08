import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink px-6 py-10 text-sm text-white/50 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-serif text-xl font-bold text-gold-light">M2.</div>
          <div className="mt-1 text-white/45">
            Digital Authority Engine · Hargeisa, Somaliland
          </div>
        </div>

        <nav className="flex flex-wrap gap-5">
          <Link to="/rankings" className="hover:text-gold-light">Rankings</Link>
          <Link to="/check" className="hover:text-gold-light">Score check</Link>
          <Link to="/studio" className="hover:text-gold-light">AI Studio</Link>
          <Link to="/pricing" className="hover:text-gold-light">Pricing</Link>
        </nav>

        <div className="w-full text-center text-white/35 md:w-auto md:text-right">
          © 2026 M2 Digital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
