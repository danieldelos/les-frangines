import Link from "next/link";

import { Sidebar } from "@/components/Sidebar";

const highlights = [
  { label: "Disponível hoje", value: "R$ 12.850" },
  { label: "A vencer (7 dias)", value: "R$ 9.420" },
  { label: "Recebimentos previstos", value: "R$ 31.250" }
];

const modules = [
  {
    title: "Contas a pagar",
    description: "Controle despesas fixas, boletos e fornecedores.",
    href: "/dashboard/admin/finance/contas-pagar",
    cta: "Gerenciar pagamentos"
  },
  {
    title: "Contas a receber",
    description: "Acompanhe cobranças, recorrências e inadimplência.",
    href: "/dashboard/admin/finance/contas-receber",
    cta: "Gerenciar recebimentos"
  },
  {
    title: "Fluxo de caixa",
    description: "Projeções e saldo consolidado por período.",
    href: "/dashboard/admin/finance/fluxo-caixa",
    cta: "Ver fluxo de caixa"
  }
];

export default function AdminFinancePage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 space-y-6">
          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Painel financeiro
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Centralize pagamentos, recebimentos e projeções.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard/admin/finance/contas-receber"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-belgium-black/90 motion-reduce:transition-none"
                >
                  Nova cobrança
                </Link>
                <Link
                  href="/dashboard/admin/finance/contas-pagar"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 motion-reduce:transition-none"
                >
                  Lançar despesa
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-white p-4 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-xs font-semibold tracking-wide text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Módulos</h2>
              <p className="text-sm text-slate-600">
                Navegue pelos pilares financeiros do administrativo.
              </p>
            </div>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {modules.map((module) => (
                <Link
                  key={module.title}
                  href={module.href}
                  className="group rounded-2xl border border-border bg-white p-5 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {module.title}
                  </div>
                  <div className="mt-3 text-sm text-slate-600">{module.description}</div>
                  <div className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-slate-950">
                    {module.cta}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Resumo operacional</h2>
                <p className="text-sm text-slate-600">Indicadores chave do mês.</p>
              </div>
              <Link
                href="/dashboard/admin"
                className="text-sm font-semibold text-slate-900 underline decoration-border underline-offset-4"
              >
                Voltar para dashboard
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Inadimplência", value: "3,2%" },
                { label: "Recebido no mês", value: "R$ 46.000" },
                { label: "Custo fixo", value: "R$ 14.500" },
                { label: "Resultado", value: "R$ 18.200" }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-white p-4 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-xs font-semibold tracking-wide text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
