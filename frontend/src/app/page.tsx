import { HealthCard } from "@/components/HealthCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-white/70 shadow-soft backdrop-blur">
        <div className="h-2 w-full bg-[linear-gradient(90deg,theme(colors.brand.blue),theme(colors.white),theme(colors.brand.red))]" />
        <div className="p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Francês com clareza, constância e acompanhamento
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                A plataforma da Les Frangines combina videoaulas e aulas ao vivo via Zoom,
                com um repositório pedagógico compartilhado entre aluno e professor.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-blue px-5 text-sm font-semibold text-white hover:bg-brand-blue/90"
                >
                  Entrar
                </Link>
                <Link
                  href="/app"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Ver área (protótipo)
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-border bg-white p-5">
                <div className="text-xs font-semibold tracking-wide text-slate-500">
                  Aula ao vivo
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900">Zoom automático</div>
                <div className="mt-2 text-sm text-slate-600">
                  Agendamento com slots do professor e regras de cancelamento.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5">
                <div className="text-xs font-semibold tracking-wide text-slate-500">
                  Repositório
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900">
                  Materiais e feedback
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Exercícios, correções e histórico de aprendizagem.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-blue" />
                <div>
                  <div className="text-sm font-semibold">Organização</div>
                  <div className="text-sm text-slate-600">Tudo num só lugar</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-accent-yellow" />
                <div>
                  <div className="text-sm font-semibold">Rotina</div>
                  <div className="text-sm text-slate-600">Metas e constância</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-accent-pink" />
                <div>
                  <div className="text-sm font-semibold">Acolhimento</div>
                  <div className="text-sm text-slate-600">Experiência leve</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HealthCard />
    </div>
  );
}
