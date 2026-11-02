// components/ui/back-link.tsx
// Small "← Back" link styled like a button.
// Uses a fixed href so it works even when the page was opened directly (no history to go back to).

import Link from "next/link";

type BackLinkProps = {
  href: string;
  label?: string;
};

export default function BackLink({ href, label = "Back" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      <span aria-hidden="true">&larr;</span>
      {label}
    </Link>
  );
}
