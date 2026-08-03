"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, Menu, X, ChevronDown, ChevronRight, Monitor, Laptop, Cpu, HardDrive, Scale, PhoneCall, Sparkles, Crown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function Navbar({ saleBanner }: { saleBanner?: { isActive: boolean; text: string } | null }) {
  const { data: session, status } = useSession();
  const totalItems = useCartStore((state) => state.totalItems());
  const compareItems = useCompareStore((state) => state.items.length);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      useCartStore.getState().clearCart();
    }
  }, [status]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasBanner = saleBanner?.isActive;

  return (
    <>
      {/* ──── Sale Banner ──── */}
      {hasBanner && (
        <div className="fixed top-0 w-full z-50 overflow-hidden">
          <div className="relative py-2.5 px-4 text-center" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8, #e1467c)' }}>
            <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }} />
            <p className="text-white text-xs font-bold tracking-widest uppercase relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {saleBanner.text}
              <Sparkles className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
      )}

      {/* ──── Main Navigation ──── */}
      <nav className={`fixed ${hasBanner ? 'top-[38px]' : 'top-0'} w-full z-40 transition-all duration-500 ease-out ${
        scrolled 
          ? 'py-2' 
          : 'py-3 md:py-4'
      }`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`glass-card-strong rounded-[2rem] px-6 md:px-8 transition-all duration-500 ${
            scrolled ? 'shadow-lg shadow-pink-200/30' : ''
          }`}>
            <div className="flex justify-between items-center h-14 md:h-16">
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <Logo className="text-2xl md:text-[1.7rem] group-hover:from-[#c23066] group-hover:to-[#e1467c]" />
              </Link>

              {/* Center Links (Desktop) */}
              <div className="hidden md:flex items-center gap-1 h-full">
                
                <Link href="/shop" className="px-4 py-2 text-sm font-semibold text-[#4a1a2e]/80 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300">
                  Store
                </Link>

                {/* Categories Mega Menu */}
                <div 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <button className="px-4 py-2 text-sm font-semibold text-[#4a1a2e]/80 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300 flex items-center gap-1.5">
                    Categories 
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${megaMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                    <div className="w-[580px] glass-card-strong rounded-3xl p-7 grid grid-cols-3 gap-7">
                      {/* Devices */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#e1467c] uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" />
                          Devices
                        </h4>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/shop?category=Laptops" className="flex items-center text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all duration-200 group">
                              <div className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center mr-3 transition-colors">
                                <Laptop className="w-4 h-4 text-[#e1467c]" />
                              </div>
                              Laptops
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop?category=Desktops" className="flex items-center text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all duration-200 group">
                              <div className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center mr-3 transition-colors">
                                <Monitor className="w-4 h-4 text-[#e1467c]" />
                              </div>
                              Desktops
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Components */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#e1467c] uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" />
                          Parts
                        </h4>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/shop?category=Parts&q=ram" className="flex items-center text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all duration-200 group">
                              <div className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center mr-3 transition-colors">
                                <Cpu className="w-4 h-4 text-[#e1467c]" />
                              </div>
                              Memory
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop?category=Parts&q=ssd" className="flex items-center text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all duration-200 group">
                              <div className="w-8 h-8 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center mr-3 transition-colors">
                                <HardDrive className="w-4 h-4 text-[#e1467c]" />
                              </div>
                              Storage
                            </Link>
                          </li>
                          <li>
                            <Link href="/shop?category=Parts" className="flex items-center text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all duration-200">
                              All Parts →
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Use Case */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#e1467c] uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" />
                          By Use
                        </h4>
                        <ul className="space-y-1">
                          <li><Link href="/shop?q=gaming" className="block text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all">🎮 Gaming</Link></li>
                          <li><Link href="/shop?q=business" className="block text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all">💼 Business</Link></li>
                          <li><Link href="/shop?q=student" className="block text-sm text-[#4a1a2e] hover:text-[#e1467c] font-medium py-2.5 px-3 rounded-xl hover:bg-pink-50/80 transition-all">📚 Students</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/store" className="px-4 py-2 text-sm font-semibold text-[#4a1a2e]/80 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300">
                  Offline Store
                </Link>

                <Link href="/about" className="px-4 py-2 text-sm font-semibold text-[#4a1a2e]/80 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300">
                  Our Story
                </Link>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                
                {/* Compare */}
                <Link href="/compare" className="relative p-2.5 text-[#4a1a2e]/60 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300 group">
                  <Scale className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" strokeWidth={1.8} />
                  {mounted && compareItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 glow-badge text-[9px] w-[18px] h-[18px] flex items-center justify-center">
                      {compareItems}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative p-2.5 text-[#4a1a2e]/60 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300 group">
                  <ShoppingBag className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" strokeWidth={1.8} />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 glow-badge text-[9px] w-[18px] h-[18px] flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                
                {/* Divider */}
                <div className="hidden md:block w-px h-7 bg-pink-200/50 mx-1" />

                {/* User / Login (Desktop) */}
                {status === "loading" ? (
                  <div className="hidden md:block w-20 h-9 rounded-full animate-shimmer" />
                ) : session ? (
                  <div className="hidden md:flex items-center gap-3">
                    <Link href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/account"} className="p-2.5 text-[#4a1a2e]/60 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all duration-300 group relative">
                      <UserIcon className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" strokeWidth={1.8} />
                      {(session.user as any)?.role === 'ADMIN' && (
                        <Crown className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                      )}
                    </Link>
                    <button onClick={() => { useCartStore.getState().clearCart(); signOut(); }} className="text-[10px] font-bold text-[#4a1a2e]/50 hover:text-[#e1467c] uppercase tracking-wider transition-colors px-3 py-2 hover:bg-pink-50/60 rounded-full">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    <Link href="/login" className="clay-btn text-sm font-bold text-white px-6 py-2.5 inline-block">
                      Sign In
                    </Link>
                  </div>
                )}
                
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2.5 text-[#4a1a2e]/60 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all"
                >
                  <Menu className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ──── Mobile Overlay ──── */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(135deg, rgba(225,70,124,0.08), rgba(252,228,236,0.3))' }}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 backdrop-blur-xl" />
      </div>

      {/* ──── Mobile Drawer ──── */}
      <div className={`fixed inset-y-3 right-3 w-[calc(100%-1.5rem)] max-w-sm z-[100] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0 scale-100' : 'translate-x-[110%] scale-95'}`}>
        <div className="flex-1 flex flex-col glass-card-strong rounded-[2rem] overflow-hidden">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-pink-100/40">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[#e1467c] to-[#f472a8] bg-clip-text text-transparent">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-[#4a1a2e]/60 hover:text-[#e1467c] bg-pink-50/60 hover:bg-pink-100/60 rounded-full transition-all">
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto py-5 px-5 space-y-6">
            
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-base font-bold text-[#2d1a26] py-4 px-5 bg-gradient-to-r from-pink-50/80 to-white/60 rounded-2xl hover:from-pink-100/80 hover:to-white/80 transition-all border border-pink-100/40">
              <span className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#e1467c]" />
                All Products
              </span>
              <ChevronRight className="w-4 h-4 text-[#e1467c]/50" />
            </Link>
            
            {/* Devices */}
            <div className="px-1">
              <h4 className="text-[9px] font-black text-[#e1467c] uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[2px] rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" />
                Devices
              </h4>
              <ul className="space-y-0.5">
                <li><Link href="/shop?category=Laptops" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-[#2d1a26] font-semibold py-3 px-4 rounded-2xl hover:bg-pink-50/80 transition-all"><Laptop className="w-4 h-4 mr-3 text-[#e1467c]/60" /> Laptops</Link></li>
                <li><Link href="/shop?category=Desktops" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-[#2d1a26] font-semibold py-3 px-4 rounded-2xl hover:bg-pink-50/80 transition-all"><Monitor className="w-4 h-4 mr-3 text-[#e1467c]/60" /> Desktops</Link></li>
              </ul>
            </div>

            {/* Components */}
            <div className="px-1">
              <h4 className="text-[9px] font-black text-[#e1467c] uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                <span className="w-4 h-[2px] rounded-full bg-gradient-to-r from-[#e1467c] to-[#f472a8]" />
                Components
              </h4>
              <ul className="space-y-0.5">
                <li><Link href="/shop?category=Parts&q=ram" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-[#2d1a26] font-semibold py-3 px-4 rounded-2xl hover:bg-pink-50/80 transition-all"><Cpu className="w-4 h-4 mr-3 text-[#e1467c]/60" /> Memory (RAM)</Link></li>
                <li><Link href="/shop?category=Parts&q=ssd" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-[#2d1a26] font-semibold py-3 px-4 rounded-2xl hover:bg-pink-50/80 transition-all"><HardDrive className="w-4 h-4 mr-3 text-[#e1467c]/60" /> Storage (SSD)</Link></li>
                <li><Link href="/shop?category=Parts" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-[#2d1a26] font-semibold py-3 px-4 rounded-2xl hover:bg-pink-50/80 transition-all">All Parts →</Link></li>
              </ul>
            </div>

            {/* Pages */}
            <div className="pt-2 space-y-2">
              <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="block text-center text-base font-bold text-[#2d1a26] py-3.5 bg-pink-50/50 border border-pink-100/40 hover:bg-pink-100/50 rounded-2xl transition-all">
                Offline Store
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-center text-base font-bold text-[#2d1a26] py-3.5 bg-pink-50/50 border border-pink-100/40 hover:bg-pink-100/50 rounded-2xl transition-all">
                Our Story
              </Link>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-pink-100/40">
            {status === "loading" ? (
              <div className="h-12 rounded-full animate-shimmer" />
            ) : session ? (
              <div className="flex items-center justify-between bg-gradient-to-r from-pink-50/80 to-white/60 p-2.5 pl-5 rounded-full border border-pink-100/40">
                <Link 
                  href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/account"} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-[#2d1a26] font-bold flex-1"
                >
                  <div className="bg-gradient-to-br from-[#e1467c] to-[#f472a8] p-2 rounded-full mr-3 text-white">
                    <UserIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm">My Account</span>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Crown className="w-3.5 h-3.5 text-amber-500 ml-1.5" fill="currentColor" />
                  )}
                </Link>
                <button 
                  onClick={() => { useCartStore.getState().clearCart(); signOut(); setMobileMenuOpen(false); }} 
                  className="text-[9px] font-black text-[#e1467c] uppercase tracking-widest bg-pink-100/60 hover:bg-pink-200/60 px-4 py-2.5 rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="clay-btn w-full flex items-center justify-center text-sm font-bold text-white py-3.5"
              >
                Sign In / Register
              </Link>
            )}

            {/* Bulk Enquiry */}
            <div className="mt-4">
              <a 
                href="tel:+919535698866"
                className="flex items-center justify-between w-full p-3.5 rounded-2xl transition-all hover:scale-[0.98] active:scale-[0.96]"
                style={{ background: 'linear-gradient(135deg, #e1467c, #c23066)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/15 p-2 rounded-full">
                    <PhoneCall className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-semibold text-white/80">Bulk Enquiries</span>
                    <span className="text-sm font-bold text-white tracking-wide">+91-9535698866</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
