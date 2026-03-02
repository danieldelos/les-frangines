import { authorizedFetch, finalizeResponse } from "@/app/api/_authorized";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const result = await authorizedFetch("/api/users/assign/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return finalizeResponse(result);
}
