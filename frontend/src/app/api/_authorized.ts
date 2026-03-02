import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "@/app/api/auth/_shared";
import { getDjangoBaseUrl } from "@/services/django";

type AuthorizedResult = {
  res?: Response;
  data: unknown;
  status: number;
  refreshed: boolean;
  accessToken?: string;
  clearCookies: boolean;
};

async function refreshAccessToken(refreshToken: string) {
  const url = `${getDjangoBaseUrl()}/api/auth/refresh/`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store"
  });
  const data = (await res.json().catch(() => ({}))) as { access?: string };
  return { ok: res.ok, access: data.access };
}

export async function authorizedFetch(path: string, init: RequestInit): Promise<AuthorizedResult> {
  const accessCookie = cookies().get(ACCESS_COOKIE)?.value ?? "";
  const refreshCookie = cookies().get(REFRESH_COOKIE)?.value ?? "";
  let accessToken = accessCookie;
  let refreshed = false;

  if (!accessToken && refreshCookie) {
    const refreshedToken = await refreshAccessToken(refreshCookie);
    if (refreshedToken.ok && refreshedToken.access) {
      accessToken = refreshedToken.access;
      refreshed = true;
    }
  }

  if (!accessToken) {
    return {
      data: { detail: "Não autenticado." },
      status: 401,
      refreshed: false,
      clearCookies: !refreshCookie
    };
  }

  const url = `${getDjangoBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init.headers ?? {}),
      authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });
  let data = (await res.json().catch(() => ({}))) as unknown;

  if (res.status === 401 && refreshCookie) {
    const refreshedToken = await refreshAccessToken(refreshCookie);
    if (!refreshedToken.ok || !refreshedToken.access) {
      return {
        data: { detail: "Sessão expirada." },
        status: 401,
        refreshed: false,
        clearCookies: true
      };
    }
    accessToken = refreshedToken.access;
    refreshed = true;
    const retryRes = await fetch(url, {
      ...init,
      headers: {
        accept: "application/json",
        ...(init.headers ?? {}),
        authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });
    data = (await retryRes.json().catch(() => ({}))) as unknown;
    return {
      res: retryRes,
      data,
      status: retryRes.status,
      refreshed,
      accessToken,
      clearCookies: false
    };
  }

  return {
    res,
    data,
    status: res.status,
    refreshed,
    accessToken,
    clearCookies: false
  };
}

export function finalizeResponse(result: AuthorizedResult) {
  const out = NextResponse.json(result.data, { status: result.status });
  if (result.clearCookies) {
    clearAuthCookies(out);
  }
  if (result.refreshed && result.accessToken) {
    setAuthCookies(out, { access: result.accessToken });
  }
  return out;
}
