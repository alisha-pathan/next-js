import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* Left: Next.js Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={25}
            priority
          />
        </Link>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/post"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-black"
          >
            Post
          </Link>
        </div>
      </nav>
    </header>
  );
}