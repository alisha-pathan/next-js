// components/posts/posts-list.tsx
// antd Card + Table of posts: each row's checkbox shows availability, the header checkbox toggles all.
// Changes stay local until "Save Changes" sends them all through the updateAvailabilityAction Server Action.

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Alert, App, Button, Card, Checkbox, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import CreatePostForm from "./create-post-form";
import EditPostForm from "./edit-post-form";
import DeletePostButton from "./delete-post-button";
import { updateAvailabilityAction } from "@/app/post/actions";
import type { PostItem } from "@/types/post";

type PostsListProps = {
  posts: PostItem[];
};

export default function PostsList({ posts }: PostsListProps) {
  const { message } = App.useApp();
  // Only unsaved edits live here; everything else comes from the saved post.
  const [drafts, setDrafts] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");
  const [saving, startTransition] = useTransition();

  const isChecked = (post: PostItem) => drafts[post.id] ?? post.isAvailable;
  const isChanged = (post: PostItem) => post.id in drafts && drafts[post.id] !== post.isAvailable;

  const changedPosts = posts.filter(isChanged);
  const checkedCount = posts.filter(isChecked).length;
  const allChecked = posts.length > 0 && checkedCount === posts.length;
  const someChecked = checkedCount > 0 && !allChecked;

  function toggleAll() {
    const next = !allChecked;
    setDrafts(Object.fromEntries(posts.map((post) => [post.id, next])));
  }

  function toggleOne(post: PostItem) {
    setDrafts((current) => ({ ...current, [post.id]: !isChecked(post) }));
  }

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateAvailabilityAction(
        changedPosts.map((post) => ({ id: post.id, isAvailable: drafts[post.id] }))
      );

      if (result.error) {
        setError(result.error);
      } else {
        message.success(
          `Saved ${changedPosts.length} change${changedPosts.length === 1 ? "" : "s"}.`
        );
        setDrafts({});
      }
    });
  }

  const columns: TableColumnsType<PostItem> = [
    {
      key: "available",
      width: 150,
      title: (
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          disabled={posts.length === 0}
          onChange={toggleAll}
        >
          Available
        </Checkbox>
      ),
      render: (_, post) => (
        <Space size="small">
          <Checkbox
            checked={isChecked(post)}
            onChange={() => toggleOne(post)}
            aria-label={`${post.title} is available`}
          />
          {isChanged(post) && <Tag color="warning">Unsaved</Tag>}
        </Space>
      ),
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      render: (title: string, post) => (
        <Link href={`/post/${post.id}`} className="font-medium capitalize">
          {title}
        </Link>
      ),
    },
    {
      key: "body",
      title: "Body",
      dataIndex: "body",
      render: (body: string) => (
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
          {body}
        </Typography.Paragraph>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right",
      width: 190,
      render: (_, post) => (
        <Space>
          <EditPostForm post={post} />
          <DeletePostButton postId={post.id} postTitle={post.title} />
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="mt-8"
      title={
        <div className="py-3">
          <div>All Posts</div>
          <Typography.Text type="secondary" className="text-sm font-normal">
            {posts.length} total · {checkedCount} available
            {changedPosts.length > 0 && (
              <Typography.Text type="warning"> · {changedPosts.length} unsaved</Typography.Text>
            )}
          </Typography.Text>
        </div>
      }
      extra={
        <Space wrap>
          <Button
            icon={<SaveOutlined />}
            loading={saving}
            disabled={changedPosts.length === 0}
            onClick={handleSave}
          >
            {changedPosts.length > 0 ? `Save Changes (${changedPosts.length})` : "Save Changes"}
          </Button>
          <CreatePostForm />
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      {error && <Alert type="error" showIcon title={error} className="m-4" />}

      <Table<PostItem>
        rowKey="id"
        columns={columns}
        dataSource={posts}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        locale={{ emptyText: "No posts found in the database." }}
        scroll={{ x: 760 }}
      />
    </Card>
  );
}
