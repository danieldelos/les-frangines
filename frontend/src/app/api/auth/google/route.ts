import { NextResponse } from "next/server";

import { djangoPost, setAuthCookies } from "@/app/api/auth/_shared";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const rawToken = body.id_token;
  if (typeof rawToken !== "string" || !rawToken.trim()) {
    return NextResponse.json({ detail: "id_token é obrigatório." }, { status: 400 });
  }

  const { res, data } = await djangoPost("/api/auth/google/", body);

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const tokens = (data as { tokens?: unknown }).tokens as { access?: unknown; refresh?: unknown };
  if (typeof tokens?.access !== "string" || !tokens.access) {
    return NextResponse.json({ detail: "Resposta inválida do backend." }, { status: 502 });
  }
  const user = (data as { user?: unknown }).user;

  const out = NextResponse.json({ user });
  setAuthCookies(out, {
    access: tokens.access,
    refresh: typeof tokens.refresh === "string" ? tokens.refresh : undefined
  });
  return out;
}
