"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { registerWithPassword } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerWithPassword({
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <section className="mt-10 w-full max-w-lg rounded-3xl border border-border bg-white/70 p-8 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-600">
          Crie sua conta com email/senha ou use Google (alunos).
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
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Nome</span>
              <input
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400"
                placeholder="Seu nome"
                autoComplete="given-name"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Sobrenome</span>
              <input
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400"
                placeholder="Seu sobrenome"
                autoComplete="family-name"
              />
            </label>
          </div>

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
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90 disabled:opacity-70"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link href="/login" className="underline decoration-border underline-offset-4 hover:text-slate-900">
            Já tenho conta
          </Link>
        </div>
      </section>
    </div>
  );
}

