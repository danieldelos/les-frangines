"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { loginWithPassword } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithPassword({ email, password });
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <section className="mt-10 w-full max-w-lg rounded-3xl border border-border bg-white/70 p-8 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Entrar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Entre com email e senha ou use sua conta Google (alunos).
        </p>

        <div className="mt-6">
          <GoogleSignInButton onSuccess={() => router.push("/app")} />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-slate-500">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400"
              placeholder="voce@exemplo.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Senha</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90 disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link
            href="/register"
            className="underline decoration-border underline-offset-4 hover:text-slate-900"
          >
            Criar conta
          </Link>
          <span>•</span>
          <a
            href="/api/health"
            className="underline decoration-border underline-offset-4 hover:text-slate-900"
          >
            Verificar backend
          </a>
        </div>
      </section>
    </div>
  );
}
