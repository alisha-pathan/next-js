// app/api/posts/bulk/route.ts
// API route for "/api/posts/bulk" (for external clients; the app's own UI uses Server Actions).
// PATCH: takes { updates: [{ id, isAvailable }] } and saves every post's availability in one transaction.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { tagsForPost, updateAvailability } from "@/lib/data/posts";
import { parseAvailabilityUpdates } from "@/lib/validations/post";
import { readJsonBody } from "@/lib/http";

export async function PATCH(request: Request) {
  try {
    const { body, errorResponse } = await readJsonBody(request);
    if (errorResponse) return errorResponse;

    const { updates } = (body ?? {}) as { updates?: unknown };
    const parsed = parseAvailabilityUpdates(updates);

    if (parsed.error !== undefined) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const count = await updateAvailability(parsed.data);

    new Set(parsed.data.flatMap(({ id }) => tagsForPost(id))).forEach((tag) =>
      revalidateTag(tag, { expire: 0 })
    );

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to bulk update posts:", error);

    return NextResponse.json({ error: "Failed to update posts." }, { status: 500 });
  }
}
