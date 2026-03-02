import { authorizedFetch, finalizeResponse } from "@/app/api/_authorized";

export async function PUT(
  req: Request,
  { params }: { params: { materialId: string } }
) {
  const materialId = Number(params.materialId);
  if (!materialId) {
    return new Response(JSON.stringify({ detail: "Material inválido." }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }
  const result = await authorizedFetch(`/api/materials/${materialId}/complete`, { method: "PUT" });
  return finalizeResponse(result);
}
