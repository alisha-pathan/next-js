
import { Suspense } from "react";
import Link from "next/link";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function PostsList() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await response.json();

  return (
    <ul className="mt-6 space-y-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-lg border border-gray-200 p-4"
        >
          <Link
            href={`/post/${post.id}`}
            className="text-lg font-semibold capitalize text-blue-600 hover:underline"
          >
            {post.title}
          </Link>

          <p className="mt-2 text-gray-600">{post.body}</p>
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

      <Suspense
        fallback={<p className="mt-6">Loading posts...</p>}
      >
        <PostsList />
      </Suspense>
    </section>
  );
}
