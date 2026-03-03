import Link from "next/link";
import {
  Video,
  Globe,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  CalendarDays,
  MessageSquare,
  BarChart2,
} from "lucide-react";

const features = [
  {
    icon: Video,
    iconBg: "bg-brand-accent/20",
    iconColor: "text-brand-primary",
    title: "Videoaulas gravadas",
    description:
      "Acesse todo o conteúdo a qualquer hora. Videoaulas organizadas por nível e tema, disponíveis 24/7.",
  },
  {
    icon: Globe,
    iconBg: "bg-brand-support/15",
    iconColor: "text-brand-support",
    title: "Aulas ao vivo via Zoom",
    description:
      "Sessões individuais ou em grupo com seu professor, com horários flexíveis que se adaptam à sua rotina.",
  },
  {
    icon: BookOpen,
    iconBg: "bg-brand-secondary/15",
    iconColor: "text-brand-secondary",
    title: "Material pedagógico",
    description:
      "Repositório completo com exercícios, textos e correções organizados por habilidade e nível.",
  },
  {
    icon: Users,
    iconBg: "bg-brand-primary/10",
    iconColor: "text-brand-primary",
    title: "Professor dedicado",
    description:
      "Cada aluno tem um professor responsável pelo seu progresso e plano de estudos personalizado.",
  },
  {
    icon: CalendarDays,
    iconBg: "bg-brand-accent/20",
    iconColor: "text-brand-primary",
    title: "Agendamento inteligente",
    description:
      "Marque suas aulas ao vivo com facilidade e receba lembretes automáticos antes de cada sessão.",
  },
  {
    icon: BarChart2,
    iconBg: "bg-brand-support/15",
    iconColor: "text-brand-support",
    title: "Progresso visível",
    description:
      "Acompanhe sua evolução por habilidades com relatórios mensais e metas semanais claras.",
  },
];

const methodSteps = [
  {
    step: "01",
    title: "Diagnóstico",
    desc: "Mapeamento completo do seu nível atual e objetivos pessoais com francês.",
  },
  {
    step: "02",
    title: "Trilhas personalizadas",
    desc: "Sequências práticas com foco em fala, escuta e compreensão, adaptadas ao seu ritmo.",
  },
  {
    step: "03",
    title: "Ritual semanal",
    desc: "Plano semanal estruturado com tarefas, videoaulas e check-ins com o professor.",
  },
  {
    step: "04",
    title: "Acompanhamento contínuo",
    desc: "Feedback regular e ajustes de rota para garantir evolução constante e motivação.",
  },
];

const testimonials = [
  {
    name: "Marina Alves",
    progress: "A2 → B1",
    text: "Finalmente mantenho constância nos estudos. O plano semanal claro e o feedback direto do professor transformaram meu aprendizado.",
  },
  {
    name: "Thiago Costa",
    progress: "B1 → B2",
    text: "As correções destravam bloqueios que eu tinha há anos. O repositório de materiais me ajuda a revisar e evoluir muito mais rápido.",
  },
  {
    name: "Clara Mendes",
    progress: "B2 → C1",
    text: "Aulas objetivas, humanas e com atenção real. A agenda organizada e os objetivos claros fazem toda a diferença no meu dia a dia.",
  },
];

const stats = [
  { label: "Alunos formados", value: "200+" },
  { label: "Horas de conteúdo", value: "500+" },
  { label: "Professoras", value: "6+" },
  { label: "Avaliação média", value: "4.9★" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-primary">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-brand-accent/10" />
        <div className="pointer-events-none absolute top-1/2 -right-10 h-56 w-56 -translate-y-1/2 rounded-full bg-brand-secondary/15" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-brand-support/10" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-32 w-32 rounded-full bg-brand-accent/8" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-xs font-semibold text-brand-accent">
                Escola de Francês Online • Turmas abertas
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Aprenda francês com{" "}
                <span className="text-brand-accent">método</span> e{" "}
                <span className="text-brand-support">acompanhamento real</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/70">
                A Les Frangines une videoaulas gravadas, aulas ao vivo via Zoom e material
                pedagógico personalizado. Tudo num só lugar, com professora dedicada.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-accent px-8 text-sm font-bold text-brand-primary transition-all duration-200 hover:bg-brand-accent/85 hover:shadow-lg"
                >
                  Acessar Plataforma
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  Criar Conta
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/55">
                {["Do A1 ao C1", "Aulas 1:1", "Professoras nativas", "Plataforma exclusiva"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-brand-accent" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right: platform preview cards */}
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
                  O que você encontra na plataforma
                </p>
                <div className="grid gap-2.5">
                  {[
                    {
                      icon: Video,
                      bg: "bg-brand-accent",
                      ic: "text-brand-primary",
                      t: "Videoaulas gravadas",
                      s: "Acesso 24/7 ao conteúdo completo",
                    },
                    {
                      icon: Globe,
                      bg: "bg-brand-support",
                      ic: "text-white",
                      t: "Aulas ao vivo via Zoom",
                      s: "Sessões remotas com professora",
                    },
                    {
                      icon: MessageSquare,
                      bg: "bg-brand-secondary",
                      ic: "text-white",
                      t: "Feedback individual",
                      s: "Correções e ajustes de rota",
                    },
                    {
                      icon: TrendingUp,
                      bg: "bg-white/20",
                      ic: "text-white",
                      t: "Progresso acompanhado",
                      s: "Relatórios e metas semanais",
                    },
                  ].map(({ icon: Icon, bg, ic, t, s }) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3.5"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}
                      >
                        <Icon className={`h-4 w-4 ${ic}`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t}</div>
                        <div className="text-xs text-white/50">{s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-brand-accent/15 p-5">
                  <div className="text-2xl font-bold text-brand-accent">24/7</div>
                  <div className="mt-1 text-sm font-semibold text-white">Acesso total</div>
                  <div className="mt-1.5 text-xs text-white/55">
                    Materiais e videoaulas sempre disponíveis.
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-brand-support/20 p-5">
                  <div className="text-2xl font-bold text-brand-support">1:1</div>
                  <div className="mt-1 text-sm font-semibold text-white">Atenção real</div>
                  <div className="mt-1.5 text-xs text-white/55">
                    Professora dedicada ao seu progresso.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-brand-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent/15 px-4 py-1.5 text-xs font-semibold text-brand-primary">
              Plataforma completa
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
              Tudo que você precisa para aprender francês
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Uma plataforma que combina tecnologia, pedagogia e acompanhamento humano para
              resultados reais.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHOD ────────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/8 px-4 py-1.5 text-xs font-semibold text-brand-primary">
                Nosso método
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
                Método Les Frangines
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Estrutura clara para manter constância, reduzir insegurança e acelerar a
                sua evolução no idioma.
              </p>

              <div className="mt-8 grid gap-5">
                {methodSteps.map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-brand-accent">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="mt-10 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-secondary"
              >
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: levels */}
            <div className="grid gap-3 pt-2">
              <div className="rounded-2xl bg-brand-primary p-6 text-white">
                <div className="text-xs font-semibold tracking-widest text-brand-accent uppercase">
                  Do A1 ao C1
                </div>
                <div className="mt-2 text-xl font-bold">Níveis claros com metas objetivas</div>
                <div className="mt-2 text-sm text-white/65">
                  Você sabe exatamente onde está e o que precisa para chegar onde quer.
                </div>
              </div>

              {[
                {
                  level: "A1 – A2",
                  name: "Iniciante",
                  desc: "Base sólida, pronúncia correta e vocabulário essencial do dia a dia.",
                  bg: "bg-brand-accent/15 border-brand-accent/25",
                  text: "text-brand-primary",
                },
                {
                  level: "B1 – B2",
                  name: "Intermediário",
                  desc: "Conversação fluente, compreensão avançada e expressão com confiança.",
                  bg: "bg-brand-support/10 border-brand-support/20",
                  text: "text-brand-primary",
                },
                {
                  level: "C1 – C2",
                  name: "Avançado",
                  desc: "Fluência profissional e domínio completo do idioma em qualquer contexto.",
                  bg: "bg-brand-secondary/10 border-brand-secondary/20",
                  text: "text-brand-primary",
                },
              ].map(({ level, name, desc, bg, text }) => (
                <div key={level} className={`rounded-2xl border p-5 ${bg}`}>
                  <div className={`text-xl font-bold ${text}`}>{level}</div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-700">{name}</div>
                  <div className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY / RESULTS ─────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-support/10 px-4 py-1.5 text-xs font-semibold text-brand-support">
                Jornada do aluno
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
                Entrada simples, evolução perceptível
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Acompanhamento contínuo e foco no que importa: falar com segurança e naturalidade.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { week: "Semana 1", desc: "Diagnóstico e plano inicial totalmente personalizado." },
                  { week: "Semana 2+", desc: "Ritmo constante com ajustes semanais da professora." },
                  { week: "Mês 1", desc: "Primeiras conversas reais com confiança crescente." },
                  { week: "Mês 3+", desc: "Evolução mensurável de nível, vocabulário e fluência." },
                ].map(({ week, desc }) => (
                  <div
                    key={week}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"
                  >
                    <div className="text-xs font-semibold tracking-wide text-brand-primary/60">
                      {week}
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-700">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="text-xs font-semibold tracking-widest text-brand-primary/50 uppercase">
                Resultados esperados
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  {
                    icon: CheckCircle,
                    color: "text-brand-accent",
                    title: "Autonomia",
                    desc: "Você sabe o que estudar, quando e por quê — sem depender de sorte.",
                  },
                  {
                    icon: MessageSquare,
                    color: "text-brand-support",
                    title: "Clareza",
                    desc: "Correções pontuais que removem bloqueios específicos da sua fala.",
                  },
                  {
                    icon: TrendingUp,
                    color: "text-brand-secondary",
                    title: "Confiança",
                    desc: "Evolução perceptível em conversas reais com francófonos.",
                  },
                  {
                    icon: Clock,
                    color: "text-brand-primary",
                    title: "Constância",
                    desc: "Rotina de estudos que se encaixa na sua vida e se mantém.",
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{title}</div>
                      <div className="mt-0.5 text-sm text-slate-600">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
              O que dizem nossos alunos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              Acompanhamento real, evolução perceptível e confiança para falar.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-soft"
              >
                <div className="flex gap-0.5 text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-brand-accent">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-brand-primary/50">{t.progress}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-primary px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-accent/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-support/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary/5" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-xs font-semibold text-brand-accent">
            Acesso imediato
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pronto para falar francês com confiança?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/65">
            Acesse a plataforma agora e comece sua jornada com a Les Frangines. Professora
            dedicada, método claro e progresso visível desde o primeiro dia.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-accent px-10 text-sm font-bold text-brand-primary transition-all duration-200 hover:bg-brand-accent/85 hover:shadow-lg"
            >
              Acessar Plataforma
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/25 px-10 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              Criar Conta
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/35">
            Plataforma exclusiva para alunos e professoras da Les Frangines.
          </p>
        </div>
      </section>

    </div>
  );
}
