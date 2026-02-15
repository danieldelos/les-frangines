import { NextResponse } from "next/server";

import { getDjangoBaseUrl } from "@/services/django";

export async function GET() {
  const url = `${getDjangoBaseUrl()}/api/health/`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    const data = await res.json().catch(() => ({ status: "invalid_json" }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ status: "offline", error: message }, { status: 502 });
  }
}

