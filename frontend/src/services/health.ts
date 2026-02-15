import { getDjangoBaseUrl } from "@/services/django";

export type BackendHealth = {
  status: string;
};

export type HealthResult =
  | { ok: true; url: string; data: BackendHealth }
  | { ok: false; url: string; error: string };

export async function fetchBackendHealth(): Promise<HealthResult> {
  const url = `${getDjangoBaseUrl()}/api/health/`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    if (!res.ok) {
      return { ok: false, url, error: `HTTP ${res.status}` };
    }

    const data = (await res.json()) as BackendHealth;
    return { ok: true, url, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return { ok: false, url, error: message };
  }
}

