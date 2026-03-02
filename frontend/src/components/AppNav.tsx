import Link from "next/link";

import { LogoutButton } from "@/components/LogoutButton";

const items: Array<{ href: string; label: string }> = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/repositorio", label: "Repositório" },
  { href: "/app/agenda", label: "Agenda" },
  { href: "/app/financeiro", label: "Financeiro" }
];

export function AppNav() {
  return (
    <aside className="rounded-2xl border border-border bg-white/70 p-4 shadow-soft backdrop-blur">
      <div className="mb-3 text-xs font-semibold tracking-wide text-slate-600">
        Área do aluno/professor
      </div>
      <nav className="grid gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 grid gap-3">
        <div className="rounded-xl border border-border bg-bg p-3 text-xs text-slate-600">
          Protótipo inicial.
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
