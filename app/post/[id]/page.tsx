import { Suspense } from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

async function PostDetails({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isSafeInteger(postId) || postId < 1) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <section className="px-8 py-12">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="mt-6 space-y-3">
        <p>
          <strong>Post ID:</strong> {post.id}
        </p>

        <div>
          <strong>Body:</strong>
          <p className="mt-2 whitespace-pre-line text-gray-600">
            {post.body}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Created: {post.createdAt.toLocaleString()}
        </p>
      </div>
    </section>
  );
}

export default function PostDetailPage({
  params,
}: PostPageProps) {
  return (
    <Suspense fallback={<p className="p-8">Loading post...</p>}>
      <PostDetails params={params} />
    </Suspense>
  );
}