"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { loginWithGoogle } from "@/services/auth";

type GoogleCredentialResponse = {
  credential: string;
};

type GoogleAccountsId = {
  initialize: (input: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
  prompt: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

export function GoogleSignInButton(props: { onSuccess: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clientId = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "", []);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    const id = "google-gsi";
    const existing = document.getElementById(id) as HTMLScriptElement | null;

    function init() {
      const api = window.google?.accounts?.id;
      const el = containerRef.current;
      if (!api || !el) return;

      api.initialize({
        client_id: clientId,
        callback: async (response) => {
          setError(null);
          if (!response?.credential) {
            setError("Não foi possível obter credenciais do Google.");
            return;
          }
          setLoading(true);
          try {
            await loginWithGoogle(response.credential);
            props.onSuccess();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Falha no login com Google.");
          } finally {
            setLoading(false);
          }
        }
      });

      el.innerHTML = "";
      api.renderButton(el, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 320,
        text: "continue_with",
        locale: "pt-BR"
      });
    }

    if (existing) {
      if (window.google?.accounts?.id) init();
      else existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    script.onerror = () => setError("Não foi possível carregar o Google Sign-In.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [clientId, props.onSuccess]);

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-border bg-white p-4 text-sm text-slate-600">
        <div className="font-medium text-slate-800">Login com Google indisponível</div>
        <div className="mt-1">
          Configure <span className="font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</span> em{" "}
          <span className="font-mono">frontend/.env.local</span> (use{" "}
          <span className="font-mono">frontend/.env.local.example</span> como base) e reinicie o
          servidor do Next.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <div ref={containerRef} className={loading ? "pointer-events-none opacity-70" : ""} />
      {error ? <div className="text-sm text-rose-700">{error}</div> : null}
    </div>
  );
}

