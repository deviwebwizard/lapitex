import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";
import CookieBanner from "@/components/CookieBanner";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Lapitex - Premium IT Solutions",
  description: "Buy High-Quality Refurbished Laptops & PC Parts",
};

// The layout reads site settings from the database; never execute that query during build.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bannerSetting = await prisma.siteSetting.findUnique({
    where: { key: "SALE_BANNER" }
  });
  
  let saleBanner = null;
  if (bannerSetting) {
    try {
      saleBanner = JSON.parse(bannerSetting.value);
    } catch (e) {}
  }

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          <LayoutShell saleBanner={saleBanner}>
            {children}
          </LayoutShell>
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
