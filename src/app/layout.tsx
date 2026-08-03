import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";
import prisma from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lapitex - Premium IT Solutions",
  description: "Buy High-Quality Refurbished Laptops & PC Parts",
};

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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          <LayoutShell saleBanner={saleBanner}>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
