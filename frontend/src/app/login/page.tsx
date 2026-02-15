import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <section className="rounded-3xl border border-border bg-white/70 p-8 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Entrar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Esta tela é o ponto de entrada para autenticação via API do Django. Na próxima fase,
          adicionamos login, refresh e permissões por role.
        </p>

        <form className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Email</span>
            <input
              type="email"
              name="email"
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-brand-blue"
              placeholder="voce@exemplo.com"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Senha</span>
            <input
              type="password"
              name="password"
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-brand-blue"
              placeholder="••••••••"
            />
          </label>

          <button
            type="button"
            className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-brand-blue px-4 text-sm font-semibold text-white hover:bg-brand-blue/90"
          >
            Entrar (em breve)
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link href="/app" className="underline decoration-border underline-offset-4 hover:text-slate-900">
            Ir para a área (protótipo)
          </Link>
          <span>•</span>
          <a
            href="/api/health"
            className="underline decoration-border underline-offset-4 hover:text-slate-900"
          >
            Verificar backend
          </a>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white/70 p-8 shadow-soft backdrop-blur">
        <h2 className="text-base font-semibold">Próximo: autenticação</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          <li className="rounded-xl border border-border bg-white p-3">
            Roles: admin/professor/aluno e regras de acesso
          </li>
          <li className="rounded-xl border border-border bg-white p-3">
            Sessão/JWT conforme estratégia definida no Django
          </li>
          <li className="rounded-xl border border-border bg-white p-3">
            Rotas protegidas na área e chamadas à API com credenciais
          </li>
        </ul>
      </section>
    </div>
  );
}

