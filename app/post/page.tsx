// app/post/page.tsx
// Posts page at "/post": lists all posts from the database, newest first.
// Reads through the cached data layer; mutations happen in the client components via Server Actions.

import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, Skeleton } from "antd";
import { Paragraph, Title } from "@/components/antd";
import { getPosts } from "@/lib/data/posts";
import PostsList from "@/components/posts/posts-list";

export const metadata: Metadata = {
  title: "Posts",
};

async function Posts() {
  const posts = await getPosts();

  return <PostsList posts={posts} />;
}

export default function PostPage() {
  return (
    <section className="px-8 py-12">
      <Title level={2} style={{ marginTop: 0 }}>
        Posts
      </Title>
      <Paragraph type="secondary">Welcome to the posts page.</Paragraph>

      <Suspense
        fallback={
          <Card className="mt-8">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        }
      >
        <Posts />
      </Suspense>
    </section>
  );
}
