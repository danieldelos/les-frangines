import { authorizedFetch, finalizeResponse } from "@/app/api/_authorized";

export async function GET() {
  const result = await authorizedFetch("/api/student/profile/", { method: "GET" });
  return finalizeResponse(result);
}
