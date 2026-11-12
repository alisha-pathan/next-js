// types/post.ts
// Shared Post types used by both server and client code.
// PostItem is the subset of fields the posts table and forms need.

import type { Post } from "@/app/generated/prisma/client";

export type PostItem = Pick<Post, "id" | "title" | "body" | "isAvailable">;

export type PostInput = {
  title: string;
  body: string;
  isAvailable?: boolean;
};

export type AvailabilityUpdate = {
  id: number;
  isAvailable: boolean;
};

// What every Server Action returns: nothing on success, a message on failure.
export type ActionResult = { error?: string };
