import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal CFO Agent",
  description: "Personal CFO web MVP — local-first, no database",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
