import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Zomato Lite",
  description: "Reviews for Ludhiana Burrito",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#1C1C1C]">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
