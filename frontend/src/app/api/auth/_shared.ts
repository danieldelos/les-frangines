import { NextResponse } from "next/server";

import { getDjangoBaseUrl } from "@/services/django";

export const ACCESS_COOKIE = "lf_access";
export const REFRESH_COOKIE = "lf_refresh";

export function cookieBaseOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
}

export function setAuthCookies(
  res: NextResponse,
  tokens: { access: string; refresh?: string }
) {
  res.cookies.set(ACCESS_COOKIE, tokens.access, {
    ...cookieBaseOptions(),
    maxAge: 60 * 30
  });

  if (tokens.refresh) {
    res.cookies.set(REFRESH_COOKIE, tokens.refresh, {
      ...cookieBaseOptions(),
      maxAge: 60 * 60 * 24 * 14
    });
  }
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieBaseOptions(), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieBaseOptions(), maxAge: 0 });
}

export async function djangoPost(path: string, body: Record<string, unknown>) {
  const url = `${getDjangoBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const data = (await res.json().catch(() => ({}))) as unknown;
  return { res, data };
}

export async function djangoGet(path: string, accessToken: string) {
  const url = `${getDjangoBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json", authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });
  const data = (await res.json().catch(() => ({}))) as unknown;
  return { res, data };
}

