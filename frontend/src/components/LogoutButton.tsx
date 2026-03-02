"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  redirectTo?: string;
  fullWidth?: boolean;
};

export function LogoutButton({ redirectTo = "/login", fullWidth = true }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace(redirectTo);
      router.refresh();
      setLoading(false);
    }
  }

  const sizeClass = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={`inline-flex h-10 ${sizeClass} items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-70`}
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
