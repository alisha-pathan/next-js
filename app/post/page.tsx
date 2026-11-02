// app/post/page.tsx
// Posts page at "/post": lists all posts from the database, newest first.
// Lets users create, edit, delete and bulk-update availability through the post components.

import { Suspense } from "react";
import prisma from "@/lib/prisma";
import PostsList from "@/components/posts/posts-list";


async function Posts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      body: true,
      isAvailable: true,
    },
  });

  return <PostsList posts={posts} />;
}

export default function PostPage() {
  return (
    <section className="px-8 py-12">
      <h1 className="text-3xl font-bold">Posts</h1>

      <p className="mt-3 text-gray-600">
        Welcome to the posts page.
      </p>

      <Suspense
        fallback={<p className="mt-8">Loading posts...</p>}
      >
        <Posts />
      </Suspense>
    </section>
  );
}
