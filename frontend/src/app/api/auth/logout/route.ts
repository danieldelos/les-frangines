import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/app/api/auth/_shared";

export async function POST() {
  const out = NextResponse.json({ ok: true });
  clearAuthCookies(out);
  return out;
}

