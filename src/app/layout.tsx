import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "Creamy Creation By Alpona",
    template: "%s | Creamy Creation By Alpona",
  },
  description: "Beautiful cakes and sweet creations made with care by Creamy Creation By Alpona.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
