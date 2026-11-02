// app/post/[id]/not-found.tsx
// Not-found UI for "/post/[id]".
// Rendered when a post ID is invalid or no matching post exists.

import BackLink from "@/components/ui/back-link";

export default function NotFound() {
  return (
    <div className="px-8 py-12">
      <div className="mb-6">
        <BackLink href="/post" label="Back to posts" />
      </div>
      <p>Post not found...</p>
    </div>
  );
}
