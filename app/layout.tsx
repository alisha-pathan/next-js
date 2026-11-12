// app/layout.tsx
// Root layout shared by every page: loads fonts and global styles.
// Sets up Ant Design (prebuilt CSS, theme, App context) and wraps all routes with the Header and Footer.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App, ConfigProvider, type ThemeConfig } from "antd";
import "antd/dist/antd.css";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Posts App",
    template: "%s | Posts App",
  },
  description: "Create, edit and manage posts with Next.js and Prisma.",
};

// zeroRuntime: antd uses the prebuilt antd.css instead of generating styles while rendering.
// Runtime style generation reads Date.now() / Math.random(), which Next.js Cache Components forbids during prerender.
const theme: ThemeConfig = {
  zeroRuntime: true,
  token: {
    colorPrimary: "#2563eb",
    borderRadius: 8,
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ConfigProvider theme={theme}>
          {/* App provides context for message / modal hooks (App.useApp). */}
          <App className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
