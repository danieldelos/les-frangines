import { fetchBackendHealth } from "@/services/health";

export async function HealthCard() {
  const result = await fetchBackendHealth();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Backend Django</h2>
          <p className="text-sm text-slate-600">
            Health check em <span className="font-mono text-[0.85em]">{result.url}</span>
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            result.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          ].join(" ")}
        >
          {result.ok ? `OK (${result.data?.status ?? "ok"})` : `OFFLINE (${result.error})`}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Endpoint</div>
          <div className="mt-1 font-mono text-sm">/api/health/</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Cache</div>
          <div className="mt-1 text-sm">no-store</div>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="text-xs text-slate-500">Modo</div>
          <div className="mt-1 text-sm">Server-side (sem CORS)</div>
        </div>
      </div>
    </section>
  );
}
