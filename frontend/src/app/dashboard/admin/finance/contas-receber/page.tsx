import Link from "next/link";

import { Sidebar } from "@/components/Sidebar";

const receivables = [
  { id: 1, customer: "Ana Silva", dueDate: "08/03/2026", amount: "R$ 320", status: "pendente" },
  { id: 2, customer: "Lucas Martins", dueDate: "11/03/2026", amount: "R$ 320", status: "pendente" },
  { id: 3, customer: "Turma B2", dueDate: "15/03/2026", amount: "R$ 1.920", status: "agendado" },
  { id: 4, customer: "Prof. Claire", dueDate: "18/03/2026", amount: "R$ 1.200", status: "confirmado" },
  { id: 5, customer: "Anaïs Dubois", dueDate: "22/03/2026", amount: "R$ 320", status: "agendado" }
];

const statusStyle: Record<string, string> = {
  pendente: "text-orange-700 bg-orange-100 border-orange-200",
  agendado: "text-blue-700 bg-blue-100 border-blue-200",
  confirmado: "text-emerald-700 bg-emerald-100 border-emerald-200"
};

export default function AdminAccountsReceivablePage() {
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 space-y-6">
          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Contas a receber
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Cobranças ativas e recebimentos programados.
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
                  Nova cobrança
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Em aberto", value: "R$ 7.600" },
                { label: "Previsto 15 dias", value: "R$ 5.120" },
                { label: "Recebido no mês", value: "R$ 24.800" }
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Carteira de cobrança</h2>
                <p className="text-sm text-slate-600">Últimas cobranças emitidas.</p>
              </div>
            </div>
            <div className="mt-6 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Vencimento</th>
                    <th className="py-2">Valor</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {receivables.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-900">{item.customer}</td>
                      <td className="py-3 text-slate-600">{item.dueDate}</td>
                      <td className="py-3 text-slate-600">{item.amount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusStyle[item.status]
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
