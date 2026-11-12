// lib/http.ts
// Small helpers shared by the API route handlers.
// readJsonBody turns a malformed JSON body into a 400 response instead of a 500.

import { NextResponse } from "next/server";

type JsonBodyResult =
  { body: unknown; errorResponse?: undefined } | { body?: undefined; errorResponse: NextResponse };

export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  try {
    return { body: await request.json() };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      ),
    };
  }
}
