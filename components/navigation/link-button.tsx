// components/navigation/link-button.tsx
// An antd Button that navigates like Next.js <Link>: client-side, with prefetching.
// Renders a real <a href> (so new-tab / middle-click still work); a plain click uses the Next.js router.

"use client";

import { useEffect, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "antd";

type LinkButtonProps = Omit<ButtonProps, "href" | "onClick"> & {
  href: string;
};

export default function LinkButton({ href, ...buttonProps }: LinkButtonProps) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(href);
  }, [router, href]);

  function handleClick(event: MouseEvent<HTMLElement>) {
    // Let the browser handle new-tab / new-window clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    router.push(href);
  }

  return <Button {...buttonProps} href={href} onClick={handleClick} />;
}
