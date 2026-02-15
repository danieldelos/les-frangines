export default function AgendaPage() {
  return (
    <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Agenda</h1>
      <p className="mt-2 text-sm text-slate-600">
        Próximo passo: calendário dinâmico com slots do professor, regras de cancelamento e
        criação automática de meetings no Zoom.
      </p>
      <div className="mt-5 rounded-xl border border-border bg-white p-4">
        <div className="text-xs text-slate-500">Estado</div>
        <div className="mt-1 text-sm font-medium">Placeholder</div>
      </div>
    </section>
  );
}

