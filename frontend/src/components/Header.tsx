import Link from "next/link";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/", label: "Início" },
  { href: "/app", label: "Área" },
  { href: "/login", label: "Entrar" }
];

export function Header() {
  return (
    <header className="border-b border-border bg-white/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue via-accent-yellow to-brand-red shadow-soft" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Les Frangines</div>
            <div className="text-xs text-slate-600">Escola de francês</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
