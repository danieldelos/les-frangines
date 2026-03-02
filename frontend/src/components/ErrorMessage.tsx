"use client";

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-white/70 p-6 text-sm text-slate-700 shadow-soft backdrop-blur">
      <div className="font-semibold text-slate-900">{message}</div>
      <button
        type="button"
        onClick={onRetry ?? (() => window.location.reload())}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
