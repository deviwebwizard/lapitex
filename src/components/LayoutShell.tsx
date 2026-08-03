"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function LayoutShell({
  saleBanner,
  children,
}: {
  saleBanner: { isActive: boolean; text: string } | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar saleBanner={saleBanner} />
      <main className="flex-grow pt-20 md:pt-24">{children}</main>
      <footer className="bg-[#1a0e16] text-[#4a1a2e]/60 py-14 mt-auto border-t border-[#2d1a26]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-black tracking-tighter mb-4 bg-gradient-to-r from-[#f472a8] to-[#e1467c] bg-clip-text text-transparent">
              LAPITEX
            </h3>
            <p className="text-sm text-white/30">
              Premium refurbished IT solutions. We believe in quality, sustainability, and exceptional performance.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-white/40">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/shop" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/store" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Offline Store
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/shop?category=Laptops" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  MacBooks & Laptops
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-white/40">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/30 hover:text-[#f472a8] transition-colors">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-sm text-center text-white/20">
          <p>&copy; {new Date().getFullYear()} Lapitex IT Solutions. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
