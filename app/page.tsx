// app/page.tsx
// Home page rendered at the "/" route.
// Shows a short welcome message with a button to the posts page.

import { ArrowRightOutlined, Paragraph, Title } from "@/components/antd";
import LinkButton from "@/components/navigation/link-button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-zinc-50 px-8 py-24 text-center">
      <Title>Welcome to Posts App</Title>
      <Paragraph type="secondary" className="max-w-md">
        Built with Next.js 16, the App Router, Prisma and Ant Design.
      </Paragraph>
      <LinkButton
        type="primary"
        size="large"
        href="/post"
        icon={<ArrowRightOutlined />}
        iconPlacement="end"
      >
        View posts
      </LinkButton>
    </div>
  );
}
