// app/api/posts/[id]/route.ts
// API route for "/api/posts/[id]" (for external clients; the app's own UI uses Server Actions).
// PUT updates a post and DELETE removes it, each in a single database query.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { deletePost, tagsForPost, updatePost } from "@/lib/data/posts";
import { parsePostId, parsePostInput } from "@/lib/validations/post";
import { readJsonBody } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function invalidPostId() {
  return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
}

function postNotFound() {
  return NextResponse.json({ error: "Post not found." }, { status: 404 });
}

function expirePost(id: number) {
  tagsForPost(id).forEach((tag) => revalidateTag(tag, { expire: 0 }));
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const postId = parsePostId((await params).id);
    if (postId === null) return invalidPostId();

    const { body, errorResponse } = await readJsonBody(request);
    if (errorResponse) return errorResponse;

    const parsed = parsePostInput(body);

    if (parsed.error !== undefined) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const post = await updatePost(postId, parsed.data);
    if (!post) return postNotFound();

    expirePost(postId);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update post:", error);

    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const postId = parsePostId((await params).id);
    if (postId === null) return invalidPostId();

    const deleted = await deletePost(postId);
    if (!deleted) return postNotFound();

    expirePost(postId);
    return NextResponse.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Failed to delete post:", error);

    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
