import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, djangoGet, djangoPost, setAuthCookies } from "@/app/api/auth/_shared";

export async function GET() {
  const access = cookies().get(ACCESS_COOKIE)?.value ?? "";
  const refresh = cookies().get(REFRESH_COOKIE)?.value ?? "";

  if (!access && !refresh) {
    return NextResponse.json({ detail: "Não autenticado." }, { status: 401 });
  }

  if (access) {
    const { res, data } = await djangoGet("/api/auth/me/", access);
    if (res.ok) {
      return NextResponse.json(data);
    }
    if (res.status !== 401 || !refresh) {
      return NextResponse.json(data, { status: res.status });
    }
  }

  const refreshResp = await djangoPost("/api/auth/refresh/", { refresh });
  if (!refreshResp.res.ok) {
    const out = NextResponse.json(refreshResp.data, { status: refreshResp.res.status });
    clearAuthCookies(out);
    return out;
  }

  const newAccess = (refreshResp.data as { access?: unknown }).access as string;
  const { res, data } = await djangoGet("/api/auth/me/", newAccess);
  if (!res.ok) {
    const out = NextResponse.json(data, { status: res.status });
    clearAuthCookies(out);
    return out;
  }

  const out = NextResponse.json(data);
  setAuthCookies(out, { access: newAccess });
  return out;
}

