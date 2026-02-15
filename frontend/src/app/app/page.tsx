import { HealthCard } from "@/components/HealthCard";

export default function AppHomePage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Base para evoluir permissões (admin/professor/aluno), repositório pedagógico,
          agendamento e financeiro.
        </p>
      </section>

      <HealthCard />
    </div>
  );
}

