"use client";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-white/70 p-6 text-sm text-slate-600 shadow-soft backdrop-blur">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-belgium-black" />
      <span>Carregando dados...</span>
    </div>
  );
}
