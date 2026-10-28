
import { Suspense } from "react";
import { notFound } from "next/navigation";

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

type PostPageProps = {
    params: Promise<{ id: string }>;
};

async function PostDetails({ params }: PostPageProps) {
    const { id } = await params;

    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
    );

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error("Failed to fetch post");
    }

    const post: Post = await response.json();

    return (
        <section className="px-8 py-12">
            <h1 className="text-3xl font-bold">{post.title}</h1>

            <div className="mt-6 space-y-3">
                <p>
                    <strong>Post ID:</strong> {post.id}
                </p>

                <p>
                    <strong>User ID:</strong> {post.userId}
                </p>

                <div>
                    <strong>Body:</strong>
                    <p className="mt-2 whitespace-pre-line text-gray-600">
                        {post.body}
                    </p>
                </div>
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
