import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Research | Customer Research",
  description: "Share your experiences with saving, rewards and affordable holidays.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
