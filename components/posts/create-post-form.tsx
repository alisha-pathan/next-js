"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function closeModal() {
        if (loading) return;

        setIsOpen(false);
        setTitle("");
        setBody("");
        setError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body }),
            });

            const responseText = await response.text();

            let result: { error?: string };

            try {
                result = JSON.parse(responseText);
            } catch {
                console.error("Expected JSON but received:", responseText);
                throw new Error(
                    `The server returned an unexpected response (HTTP ${response.status}). Check the Network tab.`
                );
            }

            if (!response.ok) {
                throw new Error(result.error || "Failed to create post.");
            }

            setIsOpen(false);
            setTitle("");
            setBody("");
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
                onClick={() => setIsOpen(true)}
                className="mt-6 inline-block leading-tight rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
                + Add Post
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-post-title"
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 id="create-post-title" className="text-xl font-bold">
                                Create Post
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                aria-label="Close modal"
                                className="text-2xl text-gray-500 hover:text-gray-800 disabled:opacity-50"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label htmlFor="title" className="mb-1 block font-medium">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                    maxLength={200}
                                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500"
                                    placeholder="Enter post title"
                                />
                            </div>

                            <div>
                                <label htmlFor="body" className="mb-1 block font-medium">
                                    Body
                                </label>
                                <textarea
                                    id="body"
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    required
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-blue-500"
                                    placeholder="Write your post"
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
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}