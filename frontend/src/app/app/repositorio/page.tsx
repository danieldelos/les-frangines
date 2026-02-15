export default function RepositorioPage() {
  return (
    <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">
        Repositório pedagógico
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Aqui vão materiais, exercícios e feedback compartilhados entre aluno e professor.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Materiais</div>
          <div className="mt-1 text-sm font-medium">Aulas e PDFs</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Exercícios</div>
          <div className="mt-1 text-sm font-medium">Envios e correções</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Feedback</div>
          <div className="mt-1 text-sm font-medium">Comentários do professor</div>
        </div>
      </div>
    </section>
  );
}

