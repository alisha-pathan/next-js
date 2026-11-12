// app/api/posts/route.ts
// API route for "/api/posts" (for external clients; the app's own UI uses Server Actions).
// POST: validates the title, body and isAvailable, then creates a new post.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createPost, POSTS_TAG } from "@/lib/data/posts";
import { parsePostInput } from "@/lib/validations/post";
import { readJsonBody } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const { body, errorResponse } = await readJsonBody(request);
    if (errorResponse) return errorResponse;

    const parsed = parsePostInput(body);

    if (parsed.error !== undefined) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const post = await createPost(parsed.data);
    revalidateTag(POSTS_TAG, { expire: 0 });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);

    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
