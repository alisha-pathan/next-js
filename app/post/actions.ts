// app/post/actions.ts
// Server Actions the posts UI calls directly (no fetch, no JSON parsing).
// Each one validates input, writes through the data layer, then expires the affected cache tags.

"use server";

import { updateTag } from "next/cache";
import {
  createPost,
  deletePost,
  POSTS_TAG,
  tagsForPost,
  updateAvailability,
  updatePost,
} from "@/lib/data/posts";
import { parseAvailabilityUpdates, parsePostId, parsePostInput } from "@/lib/validations/post";
import type { ActionResult } from "@/types/post";

export async function createPostAction(input: unknown): Promise<ActionResult> {
  const parsed = parsePostInput(input);
  if (parsed.error !== undefined) return { error: parsed.error };

  try {
    await createPost(parsed.data);
  } catch (error) {
    console.error("Failed to create post:", error);
    return { error: "Failed to create post." };
  }

  updateTag(POSTS_TAG);
  return {};
}

export async function updatePostAction(id: unknown, input: unknown): Promise<ActionResult> {
  const postId = parsePostId(id);
  if (postId === null) return { error: "Invalid post ID." };

  const parsed = parsePostInput(input);
  if (parsed.error !== undefined) return { error: parsed.error };

  try {
    const post = await updatePost(postId, parsed.data);
    if (!post) return { error: "Post not found." };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { error: "Failed to update post." };
  }

  tagsForPost(postId).forEach(updateTag);
  return {};
}

export async function deletePostAction(id: unknown): Promise<ActionResult> {
  const postId = parsePostId(id);
  if (postId === null) return { error: "Invalid post ID." };

  try {
    const deleted = await deletePost(postId);
    if (!deleted) return { error: "Post not found." };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { error: "Failed to delete post." };
  }

  tagsForPost(postId).forEach(updateTag);
  return {};
}

export async function updateAvailabilityAction(updates: unknown): Promise<ActionResult> {
  const parsed = parseAvailabilityUpdates(updates);
  if (parsed.error !== undefined) return { error: parsed.error };

  try {
    await updateAvailability(parsed.data);
  } catch (error) {
    console.error("Failed to bulk update posts:", error);
    return { error: "Failed to update posts." };
  }

  new Set(parsed.data.flatMap(({ id }) => tagsForPost(id))).forEach(updateTag);
  return {};
}
