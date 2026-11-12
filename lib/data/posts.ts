// lib/data/posts.ts
// Data access layer: the only place that talks to the Post table.
// Reads are cached with "use cache" + tags; callers invalidate those tags after writes.

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import type { AvailabilityUpdate, PostInput } from "@/types/post";

export const POSTS_TAG = "posts";

export function postTag(id: number) {
  return `post-${id}`;
}

// Every cache tag that goes stale when this post changes.
export function tagsForPost(id: number) {
  return [POSTS_TAG, postTag(id)];
}

function isNotFoundError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_TAG);

  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, body: true, isAvailable: true },
  });
}

export async function getPost(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(postTag(id));

  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(input: PostInput) {
  return prisma.post.create({
    data: {
      title: input.title,
      body: input.body,
      isAvailable: input.isAvailable ?? false,
    },
  });
}

// Returns null when the post does not exist (one query instead of find + update).
export async function updatePost(id: number, input: PostInput) {
  try {
    return await prisma.post.update({
      where: { id },
      // undefined isAvailable leaves the saved value untouched.
      data: { title: input.title, body: input.body, isAvailable: input.isAvailable },
    });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

// Returns false when the post does not exist.
export async function deletePost(id: number) {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch (error) {
    if (isNotFoundError(error)) return false;
    throw error;
  }
}

// Saves many availability changes in one transaction; returns how many rows changed.
export async function updateAvailability(updates: AvailabilityUpdate[]) {
  const availableIds = updates.filter((u) => u.isAvailable).map((u) => u.id);
  const unavailableIds = updates.filter((u) => !u.isAvailable).map((u) => u.id);

  const [madeAvailable, madeUnavailable] = await prisma.$transaction([
    prisma.post.updateMany({
      where: { id: { in: availableIds } },
      data: { isAvailable: true },
    }),
    prisma.post.updateMany({
      where: { id: { in: unavailableIds } },
      data: { isAvailable: false },
    }),
  ]);

  return madeAvailable.count + madeUnavailable.count;
}
