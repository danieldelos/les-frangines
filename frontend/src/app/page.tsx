import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="mt-10 mx-4 overflow-hidden rounded-3xl border border-brand-accent/40 bg-white/80 shadow-soft backdrop-blur sm:mx-6 lg:mx-8">
        <div className="h-2 w-full bg-[linear-gradient(90deg,theme(colors.brand.primary),theme(colors.brand.secondary),theme(colors.brand.accent))]" />
        <div className="p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/40 bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-primary">
                Escola de Francês • Aulas ao vivo + trilhas guiadas
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-primary">
                Fluência com método, rotina e acompanhamento real
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                A Les Frangines une aulas individuais ao vivo, videoaulas organizadas por nível
                e um repositório pedagógico com feedback contínuo. Tudo no mesmo lugar.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-secondary"
                >
                  Entrar
                </Link>
                <div className="text-xs text-slate-500">
                  Plataforma exclusiva para alunos e professores
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                  <div className="text-xs font-semibold tracking-wide text-brand-primary/70">
                    Níveis claros
                  </div>
                  <div className="mt-2 text-sm text-slate-700">A1 ao C1 com metas objetivas</div>
                </div>
                <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                  <div className="text-xs font-semibold tracking-wide text-brand-primary/70">
                    Rotina guiada
                  </div>
                  <div className="mt-2 text-sm text-slate-700">Plano semanal por objetivo</div>
                </div>
                <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                  <div className="text-xs font-semibold tracking-wide text-brand-primary/70">
                    Aulas 1:1
                  </div>
                  <div className="mt-2 text-sm text-slate-700">Professor dedicado</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-brand-primary/10 bg-white p-5">
                <Image
                  src="/landing-hero-visual.svg"
                  width={640}
                  height={480}
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  alt="Painel visual da plataforma Les Frangines"
                  className="h-auto w-full rounded-2xl"
                />
              </div>
              <div className="rounded-3xl border border-brand-primary/10 bg-white p-6">
                <div className="text-xs font-semibold tracking-wide text-brand-primary/70">
                  O que acontece na plataforma
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Aulas ao vivo</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Agendamento inteligente, lembretes e histórico de sessões.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Repositório guiado</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Materiais, exercícios e correções organizados por tema.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Progresso visível</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Evolução por habilidades e metas semanais.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                  <div className="text-xs font-semibold tracking-wide text-brand-primary/70">24/7</div>
                  <div className="mt-1 text-base font-semibold text-slate-900">Acesso total</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Videoaulas e materiais sempre disponíveis.
                  </div>
                </div>
                <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                  <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Feedback</div>
                  <div className="mt-1 text-base font-semibold text-slate-900">Correções reais</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Acompanhamento individual e ajustes de rota.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 rounded-3xl border border-brand-primary/10 bg-white/80 p-8 shadow-soft backdrop-blur sm:mx-6 lg:mx-8">
        <div className="grid gap-6 lg:grid-cols-[0.6fr_1.1fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Método Les Frangines
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Estrutura clara para manter constância, reduzir insegurança e acelerar a fala.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
              <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Diagnóstico</div>
              <div className="mt-2 text-sm text-slate-700">
                Mapeamento do nível e objetivos pessoais.
              </div>
            </div>
            <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
              <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Trilhas</div>
              <div className="mt-2 text-sm text-slate-700">
                Sequências práticas com foco em fala e escuta.
              </div>
            </div>
            <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
              <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Ritual</div>
              <div className="mt-2 text-sm text-slate-700">
                Plano semanal com tarefas e check-ins.
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-primary/10 bg-white p-5">
            <Image
              src="/landing-resources-visual.svg"
              width={480}
              height={480}
              sizes="(min-width: 1024px) 28vw, 90vw"
              alt="Ilustração de trilhas e organização de estudo"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mx-6 lg:mx-8">
        <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Aulas</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">1:1</div>
          <div className="mt-2 text-sm text-slate-600">Horários flexíveis</div>
        </div>
        <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Suporte</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">Diário</div>
          <div className="mt-2 text-sm text-slate-600">Canal direto com o professor</div>
        </div>
        <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Turmas</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">Pequenas</div>
          <div className="mt-2 text-sm text-slate-600">Foco e atenção</div>
        </div>
        <div className="rounded-2xl border border-brand-primary/10 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Progresso</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">Mensal</div>
          <div className="mt-2 text-sm text-slate-600">Relatórios objetivos</div>
        </div>
      </section>

      <section className="mx-4 rounded-3xl border border-brand-primary/10 bg-white/80 p-8 shadow-soft backdrop-blur sm:mx-6 lg:mx-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Jornada do aluno
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Entrada simples, acompanhamento contínuo e foco no que importa: falar com segurança.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Semana 1</div>
                <div className="mt-2 text-sm text-slate-700">
                  Diagnóstico e plano inicial personalizado.
                </div>
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                <div className="text-xs font-semibold tracking-wide text-brand-primary/70">Semana 2+</div>
                <div className="mt-2 text-sm text-slate-700">
                  Ritmo constante com ajustes do professor.
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-primary/10 bg-white p-6">
            <div className="text-xs font-semibold tracking-wide text-brand-primary/70">
              Resultados esperados
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Autonomia</div>
                <div className="mt-1 text-sm text-slate-600">
                  Você sabe o que estudar, quando e por quê.
                </div>
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Clareza</div>
                <div className="mt-1 text-sm text-slate-600">
                  Correções pontuais que removem bloqueios.
                </div>
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Confiança</div>
                <div className="mt-1 text-sm text-slate-600">
                  Evolução perceptível em conversas reais.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-4 rounded-3xl border border-brand-primary/10 bg-white/80 p-8 shadow-soft backdrop-blur sm:mx-6 lg:mx-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Depoimentos
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Acompanhamento real, evolução perceptível e confiança para falar.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">&ldquo;Finalmente mantenho constância.&rdquo;</div>
                <div className="mt-2 text-sm text-slate-600">
                  Plano semanal claro e feedback direto do professor.
                </div>
                <div className="mt-3 text-xs font-semibold text-brand-primary/70">Marina • A2 → B1</div>
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">&ldquo;As correções destravam.&rdquo;</div>
                <div className="mt-2 text-sm text-slate-600">
                  O repositório ajuda a revisar e evoluir rápido.
                </div>
                <div className="mt-3 text-xs font-semibold text-brand-primary/70">Thiago • B1 → B2</div>
              </div>
              <div className="rounded-2xl border border-brand-primary/10 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">&ldquo;Aulas objetivas e humanas.&rdquo;</div>
                <div className="mt-2 text-sm text-slate-600">
                  Agenda organizada e objetivos claros.
                </div>
                <div className="mt-3 text-xs font-semibold text-brand-primary/70">Clara • B2 → C1</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-primary/10 bg-white p-5">
            <Image
              src="/landing-testimonials-visual.svg"
              width={520}
              height={520}
              sizes="(min-width: 1024px) 35vw, 90vw"
              alt="Ilustração de depoimentos e avaliação"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-4 mb-10 rounded-3xl border border-brand-primary/10 bg-brand-primary p-8 shadow-soft sm:mx-6 lg:mx-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Pronto para começar?
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Acesse a plataforma e acompanhe suas metas desde o primeiro dia.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-accent px-6 text-sm font-semibold text-brand-primary hover:bg-white"
              >
                Entrar
              </Link>
              <span className="text-xs text-white/70">Acesso imediato para alunos</span>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5">
            <Image
              src="/landing-cta-visual.svg"
              width={520}
              height={420}
              sizes="(min-width: 1024px) 35vw, 90vw"
              alt="Ilustração de início da jornada"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
