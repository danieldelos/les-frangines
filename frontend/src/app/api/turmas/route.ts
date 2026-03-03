import { authorizedFetch, finalizeResponse } from "@/app/api/_authorized";

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  const path = search ? `/api/turmas/${search}` : "/api/turmas/";
  const result = await authorizedFetch(path, { method: "GET" });
  return finalizeResponse(result);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const result = await authorizedFetch("/api/turmas/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return finalizeResponse(result);
}
