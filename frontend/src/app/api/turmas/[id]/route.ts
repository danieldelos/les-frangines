import { authorizedFetch, finalizeResponse } from "@/app/api/_authorized";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const result = await authorizedFetch(`/api/turmas/${params.id}/`, { method: "GET" });
  return finalizeResponse(result);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const result = await authorizedFetch(`/api/turmas/${params.id}/`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  return finalizeResponse(result);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await authorizedFetch(`/api/turmas/${params.id}/`, { method: "DELETE" });
  return finalizeResponse(result);
}
