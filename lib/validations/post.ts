// lib/validations/post.ts
// One place for every Post input check, shared by Server Actions and API routes.
// Each parser takes untrusted input and returns clean data or an error message.

import type { AvailabilityUpdate, PostInput } from "@/types/post";

export const TITLE_MAX_LENGTH = 200;
export const MAX_BULK_UPDATES = 500;

type ParseResult<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

// Accepts a positive integer, or a string of plain digits ("12"; not "1e3", "0x10" or " 12 ").
export function parsePostId(value: unknown): number | null {
  if (typeof value === "string" && !/^[1-9]\d*$/.test(value)) return null;

  const id = typeof value === "string" ? Number(value) : value;

  return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function parsePostInput(input: unknown): ParseResult<PostInput> {
  const { title, body, isAvailable } = (input ?? {}) as Record<string, unknown>;

  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const cleanBody = typeof body === "string" ? body.trim() : "";

  if (!cleanTitle || !cleanBody) {
    return { error: "Title and body are required." };
  }

  if (cleanTitle.length > TITLE_MAX_LENGTH) {
    return { error: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.` };
  }

  if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
    return { error: "isAvailable must be true or false." };
  }

  return { data: { title: cleanTitle, body: cleanBody, isAvailable } };
}

export function parseAvailabilityUpdates(input: unknown): ParseResult<AvailabilityUpdate[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return { error: "At least one update is required." };
  }

  if (input.length > MAX_BULK_UPDATES) {
    return { error: `You can update at most ${MAX_BULK_UPDATES} posts at once.` };
  }

  const updates: AvailabilityUpdate[] = [];
  const seenIds = new Set<number>();

  for (const item of input) {
    const { id, isAvailable } = (item ?? {}) as Record<string, unknown>;
    const postId = parsePostId(id);

    if (postId === null || typeof id !== "number" || typeof isAvailable !== "boolean") {
      return { error: "Each update needs a valid post ID and isAvailable true/false." };
    }

    if (seenIds.has(postId)) {
      return { error: `Post ${postId} appears more than once.` };
    }

    seenIds.add(postId);
    updates.push({ id: postId, isAvailable });
  }

  return { data: updates };
}
