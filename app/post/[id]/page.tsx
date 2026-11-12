// app/post/[id]/page.tsx
// Post detail page at "/post/[id]": shows a single post by its ID with antd Descriptions.
// Reads through the cached getPost(); calls notFound() when the ID is invalid or the post does not exist.

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Card, Descriptions, Skeleton, Tag } from "antd";
import { ArrowLeftOutlined, Title } from "@/components/antd";
import { getPost } from "@/lib/data/posts";
import { parsePostId } from "@/lib/validations/post";
import LinkButton from "@/components/navigation/link-button";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

// Uses the same cached getPost() as the page, so the database is only hit once.
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postId = parsePostId((await params).id);
  const post = postId === null ? null : await getPost(postId);

  return { title: post?.title ?? "Post not found" };
}

async function PostDetails({ params }: PostPageProps) {
  const postId = parsePostId((await params).id);

  if (postId === null) {
    notFound();
  }

  const post = await getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <Card>
      <Title level={2} className="capitalize" style={{ marginTop: 0 }}>
        {post.title}
      </Title>

      <Descriptions
        column={1}
        bordered
        items={[
          { key: "id", label: "Post ID", children: post.id },
          {
            key: "status",
            label: "Status",
            children: (
              <Tag color={post.isAvailable ? "success" : "default"}>
                {post.isAvailable ? "Available" : "Unavailable"}
              </Tag>
            ),
          },
          {
            key: "body",
            label: "Body",
            children: <span className="whitespace-pre-line">{post.body}</span>,
          },
          { key: "created", label: "Created", children: post.createdAt.toLocaleString() },
        ]}
      />
    </Card>
  );
}

export default function PostDetailPage({ params }: PostPageProps) {
  return (
    <section className="px-8 py-12">
      <div className="mb-6">
        <LinkButton href="/post" icon={<ArrowLeftOutlined />}>
          Back to posts
        </LinkButton>
      </div>

      <Suspense
        fallback={
          <Card>
            <Skeleton active />
          </Card>
        }
      >
        <PostDetails params={params} />
      </Suspense>
    </section>
  );
}
