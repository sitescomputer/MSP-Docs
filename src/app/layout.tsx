import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSP Docs",
  description: "Self-hosted MSP customer documentation platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
