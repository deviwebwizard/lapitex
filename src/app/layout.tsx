import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";
import CookieBanner from "@/components/CookieBanner";
import prisma from "@/lib/prisma";
import { mergeContact } from "@/lib/siteContent";

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
  const contactSetting = await prisma.siteSetting.findUnique({ where: { key: "CONTACT_INFO" } });
  
  let saleBanner = null;
  if (bannerSetting) {
    try {
      const parsed = JSON.parse(bannerSetting.value);
      saleBanner = {
        ...parsed,
        mainText: parsed.mainText || parsed.text || parsed.stickyText || "",
        stickyText: parsed.stickyText || parsed.text || parsed.mainText || "",
      };
    } catch (e) {}
  }
  const contactInfo = mergeContact(contactSetting ? JSON.parse(contactSetting.value) : undefined);

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          <LayoutShell saleBanner={saleBanner} contactInfo={contactInfo}>
            {children}
          </LayoutShell>
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
