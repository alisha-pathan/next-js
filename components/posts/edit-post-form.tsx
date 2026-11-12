// components/posts/edit-post-form.tsx
// "Edit" button that opens an antd Modal with the post form pre-filled.
// Calls the updatePostAction Server Action; the list updates through cache invalidation.

"use client";

import { useState, useTransition } from "react";
import { App, Button, Form, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PostForm, { type PostFormValues } from "./post-form";
import { updatePostAction } from "@/app/post/actions";
import type { PostItem } from "@/types/post";

type EditPostFormProps = {
  post: PostItem;
};

export default function EditPostForm({ post }: EditPostFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm<PostFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleFinish(values: PostFormValues) {
    setError("");
    startTransition(async () => {
      const result = await updatePostAction(post.id, values);

      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        message.success("Post updated.");
      }
    });
  }

  return (
    <>
      <Button
        size="small"
        icon={<EditOutlined />}
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
      >
        Edit
      </Button>

      <Modal
        title="Edit Post"
        open={isOpen}
        okText="Save Changes"
        confirmLoading={pending}
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        cancelButtonProps={{ disabled: pending }}
        closable={!pending}
        keyboard={!pending}
        mask={{ closable: !pending }}
        destroyOnHidden
      >
        <PostForm
          form={form}
          initialValues={{ title: post.title, body: post.body, isAvailable: post.isAvailable }}
          error={error}
          onFinish={handleFinish}
        />
      </Modal>
    </>
  );
}
