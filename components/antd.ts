// components/antd.ts
// "use client" re-exports of antd pieces that Server Components use directly.
// Server Components can't use dot sub-components (Typography.Title) or @ant-design/icons (it creates a React context on import).

"use client";

import { Typography } from "antd";

export { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

export const Title = Typography.Title;
export const Paragraph = Typography.Paragraph;
