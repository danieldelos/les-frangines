import { NextResponse } from "next/server";

import { djangoPost, setAuthCookies } from "@/app/api/auth/_shared";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const { res, data } = await djangoPost("/api/auth/register/", body);

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const tokens = (data as { tokens?: unknown }).tokens as { access: string; refresh: string };
  const user = (data as { user?: unknown }).user;

  const out = NextResponse.json({ user });
  setAuthCookies(out, tokens);
  return out;
}

