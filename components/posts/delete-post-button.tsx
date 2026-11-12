// components/posts/delete-post-button.tsx
// "Delete" button that asks for confirmation in an antd Modal.
// Calls the deletePostAction Server Action; the list updates through cache invalidation.

"use client";

import { useState, useTransition } from "react";
import { Alert, App, Button, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deletePostAction } from "@/app/post/actions";

type DeletePostButtonProps = {
  postId: number;
  postTitle: string;
};

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deletePostAction(postId);

      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        message.success("Post deleted.");
      }
    });
  }

  return (
    <>
      <Button
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
      >
        Delete
      </Button>

      <Modal
        title="Delete Post?"
        open={isOpen}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={pending}
        onOk={handleDelete}
        onCancel={() => setIsOpen(false)}
        cancelButtonProps={{ disabled: pending }}
        closable={!pending}
        keyboard={!pending}
        mask={{ closable: !pending }}
        width={420}
      >
        <p>
          Are you sure you want to delete <strong>&quot;{postTitle}&quot;</strong>? This action
          cannot be undone.
        </p>

        {error && <Alert type="error" showIcon title={error} className="mt-3" />}
      </Modal>
    </>
  );
}
