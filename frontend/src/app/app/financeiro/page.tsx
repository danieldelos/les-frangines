export default function FinanceiroPage() {
  return (
    <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Financeiro</h1>
      <p className="mt-2 text-sm text-slate-600">
        Próximo passo: contas a pagar/receber, integração Asaas (cobranças + webhooks),
        importação CSV e dashboards.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Receita</div>
          <div className="mt-1 text-sm font-medium">—</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Ticket médio</div>
          <div className="mt-1 text-sm font-medium">—</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Fluxo de caixa</div>
          <div className="mt-1 text-sm font-medium">—</div>
        </div>
      </div>
    </section>
  );
}

