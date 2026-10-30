import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CreatePostForm from "./create-post-form";
import EditPostForm from "../api/posts/edit-post-form";
import DeletePostButton from "./delete-post-button";


async function PostsList() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (posts.length === 0) {
    return <p className="mt-6">No posts found in the database.</p>;
  }

  return (
    <ul className="mt-6 space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={post.isAvailable}
              readOnly
              aria-label={`Availability of ${post.title}`}
            />

            <Link
              href={`/post/${post.id}`}
              className="text-lg font-semibold capitalize text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
          </div>

          <p className="mt-2 text-gray-600">{post.body}</p>

          <div className="mt-4 flex gap-2">
            <EditPostForm post={post} />
            <DeletePostButton
              postId={post.id}
              postTitle={post.title}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function PostPage() {
  return (
    <section className="px-8 py-12">
      <h1 className="text-3xl font-bold">Posts</h1>

      <p className="mt-3 text-gray-600">
        Welcome to the posts page.
      </p>

      <CreatePostForm />

      <Suspense
        fallback={<p className="mt-6">Loading posts...</p>}
      >
        <PostsList />
      </Suspense>
    </section>
  );
}