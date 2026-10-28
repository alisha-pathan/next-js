
import { Suspense } from "react";
import prisma from "@/lib/prisma";

async function PostsList() {
  const posts = await prisma.post.findMany();

  if (posts.length === 0) {
    return <p>No posts found in the database.</p>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="rounded border p-4">
          <h2 className="font-semibold">{post.title}</h2>
          <p>{post.body}</p>
          <small>{post.createdAt.toLocaleString()}</small>
        </li>
      ))}
    </ul>
  );
}

export default function DbPostsPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Posts from PostgreSQL
      </h1>

      <Suspense fallback={<p>Loading posts...</p>}>
        <PostsList />
      </Suspense>
    </main>
  );
}
