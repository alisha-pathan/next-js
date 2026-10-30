
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type EditPostFormProps = {
    post: {
        id: number;
        title: string;
        body: string;
    };
};

export default function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function openModal() {
        setTitle(post.title);
        setBody(post.body);
        setError("");
        setIsOpen(true);
    }

    function closeModal() {
        if (loading) return;
        setIsOpen(false);
        setError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body }),
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
                throw new Error(result.error || "Failed to update post.");
            }

            setIsOpen(false);
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
        <>
            <button
                type="button"
                onClick={openModal}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
            >
                Edit
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`edit-post-title-${post.id}`}
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2
                                id={`edit-post-title-${post.id}`}
                                className="text-xl font-bold"
                            >
                                Edit Post
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                aria-label="Close modal"
                                className="text-2xl text-gray-500 hover:text-gray-800"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label
                                    htmlFor={`edit-title-${post.id}`}
                                    className="mb-1 block font-medium"
                                >
                                    Title
                                </label>
                                <input
                                    id={`edit-title-${post.id}`}
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                    maxLength={200}
                                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor={`edit-body-${post.id}`}
                                    className="mb-1 block font-medium"
                                >
                                    Body
                                </label>
                                <textarea
                                    id={`edit-body-${post.id}`}
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    required
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500"
                                />
                            </div>

                            {error && (
                                <p role="alert" className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
