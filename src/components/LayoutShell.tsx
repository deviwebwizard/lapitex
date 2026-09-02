"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import { Logo } from "./Logo";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

export function LayoutShell({
  saleBanner,
  children,
}: {
  saleBanner: { isActive: boolean; isStickyActive?: boolean; text: string } | null;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <div className="mb-4">
              <Logo className="text-2xl" />
            </div>
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
                  Old Laptops
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-white/40">
              Connect With Us
            </h3>
            <p className="text-sm text-white/40 mb-3">Lapitex IT Solutions</p>
            <div className="space-y-1.5 mb-4 text-sm">
              <a href="tel:+916200144824" className="flex items-center gap-2 text-white/50 hover:text-[#f472a8] transition-colors">
                <Phone className="w-4 h-4" /> +91 6200144824
              </a>
              <a href="https://wa.me/918809975386" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-[#25D366] transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp: +91 8809975386
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lapitex_it_solutions/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lapitex IT Solutions on Instagram"
                className="text-white/50 hover:text-[#f472a8] transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                  <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm8.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCP-jwgZHGVovyKdYZm4yFIQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lapitex IT Solutions on YouTube"
                className="text-white/50 hover:text-[#f472a8] transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
              </a>
            </div>
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
          <div>
            <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-white/40">
              IWebWizard
            </h3>
            <p className="text-sm text-white/40 mb-3">Created by IWebWizard</p>
            <a
              href="mailto:info.iwebwizard@gmail.com"
              aria-label="Contact IWebWizard"
              className="inline-block rounded-xl transition-transform hover:scale-105"
            >
              <Image
                src="/iwebwizard_logo.png"
                alt="IWebWizard"
                width={180}
                height={180}
                className="h-24 w-24 object-contain"
              />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-sm text-center text-white/20">
          <p>&copy; {new Date().getFullYear()} Lapitex IT Solutions. All rights reserved.</p>
        </div>
      </footer>
      <a
        href="https://wa.me/918809975386"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Lapitex on WhatsApp"
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-110 hover:bg-[#20bd5a]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.8L.2 24l6.6-1.7a11.8 11.8 0 0 0 5.3 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.5-8.3ZM12.2 21.5h-.1c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-3.9 1 1-3.8-.2-.3a9.7 9.7 0 0 1-1.5-5.1C2.4 6.4 6.8 2 12.1 2c2.6 0 5 1 6.8 2.8a9.6 9.6 0 0 1 2.8 6.9c0 5.4-4.3 9.8-9.5 9.8Zm5.4-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.7-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3c.2.2 2.1 3.3 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" />
        </svg>
      </a>
    </>
  );
}
