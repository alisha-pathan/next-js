// components/posts/posts-list.tsx
// Posts table where each row's checkbox shows availability (checked = available) and the header checkbox toggles all.
// Changes stay local until the "Save Changes" button sends them in one request to /api/posts/bulk.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreatePostForm from "./create-post-form";
import EditPostForm from "./edit-post-form";
import DeletePostButton from "./delete-post-button";

type PostsListProps = {
    posts: {
        id: number;
        title: string;
        body: string;
        isAvailable: boolean;
    }[];
};

export default function PostsList({ posts }: PostsListProps) {
    const router = useRouter();
    // Only unsaved edits live here; everything else comes from the saved post.
    const [drafts, setDrafts] = useState<Record<number, boolean>>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const headerCheckboxRef = useRef<HTMLInputElement>(null);

    const isChecked = (post: PostsListProps["posts"][number]) =>
        drafts[post.id] ?? post.isAvailable;

    const changedPosts = posts.filter(
        (post) => post.id in drafts && drafts[post.id] !== post.isAvailable
    );
    const checkedCount = posts.filter(isChecked).length;
    const allChecked = posts.length > 0 && checkedCount === posts.length;
    const someChecked = checkedCount > 0 && !allChecked;

    // "indeterminate" (the dash) can only be set from JavaScript.
    useEffect(() => {
        if (headerCheckboxRef.current) {
            headerCheckboxRef.current.indeterminate = someChecked;
        }
    }, [someChecked]);

    function toggleAll() {
        const next = !allChecked;
        setDrafts(Object.fromEntries(posts.map((post) => [post.id, next])));
    }

    function toggleOne(post: PostsListProps["posts"][number]) {
        setDrafts((current) => ({ ...current, [post.id]: !isChecked(post) }));
    }

    async function handleSave() {
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/posts/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    updates: changedPosts.map((post) => ({
                        id: post.id,
                        isAvailable: drafts[post.id],
                    })),
                }),
            });

            const responseText = await response.text();
            let result: { error?: string };

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `Unexpected server response (HTTP ${response.status}).`
                );
            }

            if (!response.ok) {
                throw new Error(result.error || "Failed to update posts.");
            }

            setDrafts({});
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Table title + action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">All Posts</h2>
                    <p className="text-sm text-gray-500">
                        {posts.length} total · {checkedCount} available
                        {changedPosts.length > 0 && (
                            <span className="text-amber-600">
                                {" "}· {changedPosts.length} unsaved
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || changedPosts.length === 0}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : changedPosts.length > 0
                                ? `Save Changes (${changedPosts.length})`
                                : "Save Changes"}
                    </button>

                    <CreatePostForm />
                </div>
            </div>

            {error && (
                <p role="alert" className="border-b border-gray-200 bg-red-50 px-6 py-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                            <th scope="col" className="w-36 px-6 py-3 font-semibold">
                                <label className="flex items-center gap-2">
                                    <input
                                        ref={headerCheckboxRef}
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={toggleAll}
                                        disabled={posts.length === 0}
                                        aria-label="Mark all posts available"
                                        className="h-4 w-4"
                                    />
                                    Available
                                </label>
                            </th>
                            <th scope="col" className="px-6 py-3 font-semibold">Title</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Body</th>
                            <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No posts found in the database.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => {
                                const isChanged = changedPosts.includes(post);

                                return (
                                    <tr
                                        key={post.id}
                                        className={isChanged ? "bg-amber-50" : "hover:bg-gray-50"}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={isChecked(post)}
                                                onChange={() => toggleOne(post)}
                                                aria-label={`${post.title} is available`}
                                                className="h-4 w-4 align-middle"
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/post/${post.id}`}
                                                className="font-medium capitalize text-blue-600 hover:underline"
                                            >
                                                {post.title}
                                            </Link>
                                        </td>

                                        <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                                            <p className="line-clamp-2">{post.body}</p>
                                        </td>

                                        {/* No nowrap/text-size here: the Edit/Delete modals render inside this cell. */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <EditPostForm post={post} />
                                                <DeletePostButton
                                                    postId={post.id}
                                                    postTitle={post.title}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
