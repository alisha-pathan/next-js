// app/post/[id]/not-found.tsx
// Not-found UI for "/post/[id]", using antd's 404 Result.
// Rendered when a post ID is invalid or no matching post exists.

import { Result } from "antd";
import { ArrowLeftOutlined } from "@/components/antd";
import LinkButton from "@/components/navigation/link-button";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="Post not found"
      subTitle="This post doesn't exist or may have been deleted."
      extra={
        <LinkButton type="primary" href="/post" icon={<ArrowLeftOutlined />}>
          Back to posts
        </LinkButton>
      }
    />
  );
}
