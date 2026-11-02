
"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-8 py-6 sm:flex-row">
        <p className="text-sm text-gray-500">
          © {year} Next.js App. All rights reserved.
        </p>

        <p className="text-sm text-gray-500">
          Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
