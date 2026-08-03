import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lapitex - Premium IT Solutions",
  description: "Buy High-Quality Refurbished Laptops & PC Parts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20 md:pt-24"> {/* Adjusted padding to prevent header overlap */}
            {children}
          </main>
          <footer className="bg-[#111111] text-gray-400 py-12 mt-auto border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4 tracking-tight">LAPITEX</h3>
                <p className="text-sm">Premium refurbished IT solutions. We believe in quality, sustainability, and exceptional performance.</p>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/shop" className="hover:text-white transition-colors">Shop All</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">Our Story</a></li>
                  <li><a href="/shop?category=Laptops" className="hover:text-white transition-colors">MacBooks & Laptops</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
              <p>&copy; {new Date().getFullYear()} Lapitex IT Solutions. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
