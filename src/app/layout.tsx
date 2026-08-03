import type { Metadata } from "next";
import { Inter, Cinzel, Orbitron, Pacifico } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { LayoutShell } from "@/components/LayoutShell";
import CookieBanner from "@/components/CookieBanner";
import prisma from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["900"],
});

const pacifico = Pacifico({
  variable: "--font-aesthetic",
  subsets: ["latin"],
  weight: ["400"],
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
      className={`${inter.variable} ${cinzel.variable} ${orbitron.variable} ${pacifico.variable} h-full antialiased`}
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
