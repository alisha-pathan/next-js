// app/post/error.tsx
// Error boundary for "/post" and "/post/[id]" (e.g. the database is unreachable).
// Shows antd's error Result with "Try again" and "Home" buttons instead of the default error screen.

"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";
import { HomeOutlined, ReloadOutlined } from "@ant-design/icons";
import LinkButton from "@/components/navigation/link-button";

type PostErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function PostError({ error, retry }: PostErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle="We couldn't load the posts right now. Please try again."
      extra={[
        <Button key="retry" type="primary" icon={<ReloadOutlined />} onClick={() => retry()}>
          Try again
        </Button>,
        <LinkButton key="home" href="/" icon={<HomeOutlined />}>
          Home
        </LinkButton>,
      ]}
    />
  );
}
