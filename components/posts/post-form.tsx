// components/posts/post-form.tsx
// Shared antd Form with Title / Body / Available fields, used inside the Create and Edit modals.
// The parent owns the form instance (so the modal's OK button can submit it) and handles onFinish.

"use client";

import { Alert, Checkbox, Form, Input, type FormInstance } from "antd";
import { TITLE_MAX_LENGTH } from "@/lib/validations/post";
import type { PostInput } from "@/types/post";

export type PostFormValues = Required<PostInput>;

type PostFormProps = {
  form: FormInstance<PostFormValues>;
  initialValues?: PostFormValues;
  error?: string;
  onFinish: (values: PostFormValues) => void;
};

const emptyValues: PostFormValues = { title: "", body: "", isAvailable: false };

export default function PostForm({
  form,
  initialValues = emptyValues,
  error,
  onFinish,
}: PostFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={onFinish}
      className="mt-4"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          { required: true, whitespace: true, message: "Please enter a title." },
          {
            max: TITLE_MAX_LENGTH,
            message: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
          },
        ]}
      >
        <Input placeholder="Enter post title" maxLength={TITLE_MAX_LENGTH} showCount />
      </Form.Item>

      <Form.Item
        label="Body"
        name="body"
        rules={[{ required: true, whitespace: true, message: "Please write the post body." }]}
      >
        <Input.TextArea placeholder="Write your post" rows={5} />
      </Form.Item>

      <Form.Item name="isAvailable" valuePropName="checked">
        <Checkbox>Available</Checkbox>
      </Form.Item>

      {error && <Alert type="error" showIcon title={error} />}
    </Form>
  );
}
