import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const content =
      typeof body.body === "string" ? body.body.trim() : "";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and body are required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        body: content,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);

    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}