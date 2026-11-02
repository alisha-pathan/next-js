// app/api/posts/bulk/route.ts
// API route for "/api/posts/bulk".
// PATCH: takes { updates: [{ id, isAvailable }] } and saves every post's availability in one transaction.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updates: unknown[] = Array.isArray(body.updates) ? body.updates : [];

    const availableIds: number[] = [];
    const unavailableIds: number[] = [];

    for (const update of updates) {
      const { id, isAvailable } = (update ?? {}) as {
        id?: unknown;
        isAvailable?: unknown;
      };

      if (
        typeof id !== "number" ||
        !Number.isSafeInteger(id) ||
        id < 1 ||
        typeof isAvailable !== "boolean"
      ) {
        return NextResponse.json(
          { error: "Each update needs a valid post ID and isAvailable true/false." },
          { status: 400 }
        );
      }

      (isAvailable ? availableIds : unavailableIds).push(id);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "At least one update is required." },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      count: madeAvailable.count + madeUnavailable.count,
    });
  } catch (error) {
    console.error("Failed to bulk update posts:", error);

    return NextResponse.json(
      { error: "Failed to update posts." },
      { status: 500 }
    );
  }
}
