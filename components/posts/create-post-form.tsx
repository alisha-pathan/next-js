// components/posts/create-post-form.tsx
// "Add Post" button that opens an antd Modal with the post form.
// Calls the createPostAction Server Action; the list updates through cache invalidation.

"use client";

import { useState, useTransition } from "react";
import { App, Button, Form, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PostForm, { type PostFormValues } from "./post-form";
import { createPostAction } from "@/app/post/actions";

export default function CreatePostForm() {
  const { message } = App.useApp();
  const [form] = Form.useForm<PostFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleFinish(values: PostFormValues) {
    setError("");
    startTransition(async () => {
      const result = await createPostAction(values);

      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        message.success("Post created.");
      }
    });
  }

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
      >
        Add Post
      </Button>

      <Modal
        title="Create Post"
        open={isOpen}
        okText="Create Post"
        confirmLoading={pending}
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        cancelButtonProps={{ disabled: pending }}
        closable={!pending}
        keyboard={!pending}
        mask={{ closable: !pending }}
        destroyOnHidden
      >
        <PostForm form={form} error={error} onFinish={handleFinish} />
      </Modal>
    </>
  );
}
