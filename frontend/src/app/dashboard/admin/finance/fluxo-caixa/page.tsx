import Link from "next/link";

import { Sidebar } from "@/components/Sidebar";

const cashflow = [
  { period: "Semana 1", inflow: 12600, outflow: 8400, balance: 4200 },
  { period: "Semana 2", inflow: 14800, outflow: 9200, balance: 5600 },
  { period: "Semana 3", inflow: 13250, outflow: 10100, balance: 3150 },
  { period: "Semana 4", inflow: 17500, outflow: 9600, balance: 7900 }
];

const maxValue = Math.max(...cashflow.map((item) => Math.max(item.inflow, item.outflow)));

export default function AdminCashflowPage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 space-y-6">
          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Fluxo de caixa
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Entradas e saídas consolidadas por período.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard/admin/finance"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 motion-reduce:transition-none"
                >
                  Voltar ao painel
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-belgium-black/90 motion-reduce:transition-none"
                >
                  Exportar relatório
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Saldo atual", value: "R$ 12.850" },
                { label: "Entradas no mês", value: "R$ 58.150" },
                { label: "Saídas no mês", value: "R$ 37.300" }
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

          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Projeção semanal</h2>
              <p className="text-sm text-slate-600">
                Comparativo entre entradas e saídas.
              </p>
            </div>
            <div className="mt-6 grid gap-4">
              {cashflow.map((item) => (
                <div key={item.period} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>{item.period}</span>
                    <span className="text-slate-600">Saldo {item.balance.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-xs font-semibold text-emerald-700">Entradas</span>
                      <div className="h-2 flex-1 rounded-full bg-emerald-100">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all duration-300 motion-reduce:transition-none"
                          style={{ width: `${(item.inflow / maxValue) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">
                        {item.inflow.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-xs font-semibold text-rose-700">Saídas</span>
                      <div className="h-2 flex-1 rounded-full bg-rose-100">
                        <div
                          className="h-2 rounded-full bg-rose-500 transition-all duration-300 motion-reduce:transition-none"
                          style={{ width: `${(item.outflow / maxValue) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">
                        {item.outflow.toLocaleString("pt-BR")}
                      </span>
                    </div>
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
