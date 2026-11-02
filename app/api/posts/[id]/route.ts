// app/api/posts/[id]/route.ts
// API route for "/api/posts/[id]".
// PUT updates a post and DELETE removes it, after validating the ID.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const postId = Number(id);

        if (!Number.isSafeInteger(postId) || postId < 1) {
            return NextResponse.json(
                { error: "Invalid post ID." },
                { status: 400 }
            );
        }

        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: "Post not found." },
                { status: 404 }
            );
        }

        const body = await request.json();
        const title =
            typeof body.title === "string" ? body.title.trim() : "";
        const content =
            typeof body.body === "string" ? body.body.trim() : "";
        const isAvailable =
            typeof body.isAvailable === "boolean"
                ? body.isAvailable
                : existingPost.isAvailable;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and body are required." },
                { status: 400 }
            );
        }

        const post = await prisma.post.update({
            where: { id: postId },
            data: { title, body: content, isAvailable },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to update post:", error);

        return NextResponse.json(
            { error: "Failed to update post." },
            { status: 500 }
        );
    }
}



export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id } = await params;
        const postId = Number(id);

        if (!Number.isSafeInteger(postId) || postId < 1) {
            return NextResponse.json(
                { error: "Invalid post ID." },
                { status: 400 }
            );
        }

        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: "Post not found." },
                { status: 404 }
            );
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Failed to delete post:", error);

        return NextResponse.json(
            { error: "Failed to delete post." },
            { status: 500 }
        );
    }
}
