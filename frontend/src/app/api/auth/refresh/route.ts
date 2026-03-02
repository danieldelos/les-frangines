import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { REFRESH_COOKIE, clearAuthCookies, djangoPost, setAuthCookies } from "@/app/api/auth/_shared";

export async function POST(req: Request) {
  const token = cookies().get(REFRESH_COOKIE)?.value ?? "";

  if (!token) {
    return NextResponse.json({ detail: "Sem refresh token." }, { status: 401 });
  }

  const { res, data } = await djangoPost("/api/auth/refresh/", { refresh: token });

  if (!res.ok) {
    const out = NextResponse.json(data, { status: res.status });
    clearAuthCookies(out);
    return out;
  }

  const access = (data as { access?: unknown }).access as string;
  const out = NextResponse.json({ ok: true });
  setAuthCookies(out, { access });
  return out;
}
