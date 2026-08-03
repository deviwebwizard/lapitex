"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, Menu, X, ChevronDown, Monitor, Laptop, Cpu, HardDrive, Scale, PhoneCall } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCompareStore } from "@/store/compareStore";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((state) => state.totalItems());
  const compareItems = useCompareStore((state) => state.items.length);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // States for Menus
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

  // Close menus on resize to avoid weird states
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/50 py-3' : 'bg-white/50 backdrop-blur-sm py-4 md:py-5 border-b border-gray-100/30'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="font-black text-2xl md:text-3xl tracking-tighter text-gray-900 drop-shadow-sm">LAPITEX</span>
              </Link>
            </div>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex space-x-8 items-center h-full">
              
              <Link href="/shop" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                Store
              </Link>

              {/* Mega Menu Trigger */}
              <div 
                className="relative h-full flex items-center group cursor-pointer"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors flex items-center py-2">
                  Categories <ChevronDown className="ml-1 w-4 h-4" />
                </span>

                {/* Mega Menu Dropdown */}
                {megaMenuOpen && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 grid grid-cols-3 gap-6 transition-all z-50">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Devices</h4>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/shop?category=Laptops" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium group/link">
                            <Laptop className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-primary" /> Laptops
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=Desktops" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium group/link">
                            <Monitor className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-primary" /> Desktops
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Components</h4>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/shop?category=Parts&q=ram" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium group/link">
                            <Cpu className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-primary" /> Memory (RAM)
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=Parts&q=ssd" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium group/link">
                            <HardDrive className="w-4 h-4 mr-2 text-gray-400 group-hover/link:text-primary" /> Storage (SSD/HDD)
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop?category=Parts" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium group/link">
                            <span className="w-4 h-4 mr-2 rounded-full border-2 border-gray-400 group-hover/link:border-primary"></span> All Parts
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">By Use Case</h4>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/shop?q=gaming" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium">For Gaming</Link>
                        </li>
                        <li>
                          <Link href="/shop?q=business" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium">For Business</Link>
                        </li>
                        <li>
                          <Link href="/shop?q=student" className="flex items-center text-sm text-gray-700 hover:text-primary font-medium">For Students</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/store" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                Offline Store
              </Link>

              <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                Our Story
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 md:space-x-5">
              
              {/* Compare Icon */}
              <Link href="/compare" className="text-gray-600 hover:text-primary transition-colors relative group p-2">
                <Scale className="h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                {mounted && compareItems > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {compareItems}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="text-gray-600 hover:text-primary transition-colors relative group p-2">
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* User / Login */}
              {session ? (
                <div className="hidden md:flex items-center space-x-5 border-l pl-5 border-gray-200">
                  <Link href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/account"} className="text-gray-600 hover:text-primary transition-colors">
                    <UserIcon className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                  <button onClick={() => signOut()} className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:block border-l pl-5 border-gray-200">
                  <Link href="/login" className="text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 px-5 py-2 rounded-full transition-all shadow-sm hover:shadow-md">
                    Sign In
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-gray-600 hover:text-primary p-2 focus:outline-none"
                >
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Drawer */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/30 backdrop-blur-md z-[100] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`fixed inset-y-3 right-3 w-[calc(100%-1.5rem)] max-w-sm bg-white/70 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.2)] border border-white/60 z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col rounded-[2.5rem] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200/40">
          <span className="font-black text-2xl tracking-tighter text-gray-900 drop-shadow-sm">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-3 text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white shadow-sm border border-gray-100/50 rounded-full transition-all duration-300">
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6">
          <div className="space-y-8">
            
            <div>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-xl font-bold text-gray-900 py-4 px-6 bg-white/50 rounded-3xl hover:bg-white/80 transition-all duration-300 shadow-sm border border-white/60">
                All Products
                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-400" />
              </Link>
            </div>
            
            <div className="px-2">
              <h4 className="text-[10px] font-black text-primary/80 uppercase tracking-widest mb-4">Devices</h4>
              <ul className="space-y-1">
                <li><Link href="/shop?category=Laptops" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 hover:text-primary hover:shadow-sm transition-all"><Laptop className="w-4 h-4 mr-3 text-gray-400" /> Laptops</Link></li>
                <li><Link href="/shop?category=Desktops" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 hover:text-primary hover:shadow-sm transition-all"><Monitor className="w-4 h-4 mr-3 text-gray-400" /> Desktops</Link></li>
              </ul>
            </div>

            <div className="px-2">
              <h4 className="text-[10px] font-black text-primary/80 uppercase tracking-widest mb-4">Components</h4>
              <ul className="space-y-1">
                <li><Link href="/shop?category=Parts&q=ram" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 hover:text-primary hover:shadow-sm transition-all"><Cpu className="w-4 h-4 mr-3 text-gray-400" /> Memory (RAM)</Link></li>
                <li><Link href="/shop?category=Parts&q=ssd" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 hover:text-primary hover:shadow-sm transition-all"><HardDrive className="w-4 h-4 mr-3 text-gray-400" /> Storage (SSD)</Link></li>
                <li><Link href="/shop?category=Parts" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-3 px-4 rounded-2xl hover:bg-white/60 hover:text-primary hover:shadow-sm transition-all"><span className="w-4 h-4 mr-3 rounded-full border-2 border-gray-300" /> All Parts</Link></li>
              </ul>
            </div>

            <div className="px-2">
              <h4 className="text-[10px] font-black text-primary/80 uppercase tracking-widest mb-4">By Use Case</h4>
              <ul className="space-y-1">
                <li><Link href="/shop?q=gaming" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-2.5 px-4 rounded-2xl hover:bg-white/60 hover:text-primary transition-all">For Gaming</Link></li>
                <li><Link href="/shop?q=business" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-2.5 px-4 rounded-2xl hover:bg-white/60 hover:text-primary transition-all">For Business</Link></li>
                <li><Link href="/shop?q=student" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 font-semibold py-2.5 px-4 rounded-2xl hover:bg-white/60 hover:text-primary transition-all">For Students</Link></li>
              </ul>
            </div>
            
            <div className="pt-4 space-y-3">
              <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 py-4 text-center bg-white/30 border border-white/50 hover:bg-white/60 rounded-3xl transition-all shadow-sm">
                Offline Store
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-gray-900 py-4 text-center bg-white/30 border border-white/50 hover:bg-white/60 rounded-3xl transition-all shadow-sm">
                Our Story
              </Link>
            </div>
            
          </div>
        </div>

        {/* Mobile Auth / Footer area */}
        <div className="p-6 md:p-8 border-t border-gray-200/40 bg-white/20 rounded-b-[2.5rem]">
          {session ? (
            <div className="flex items-center justify-between bg-white/60 p-2.5 pl-5 rounded-full border border-white shadow-sm">
              <Link 
                href={(session.user as any)?.role === 'ADMIN' ? "/admin" : "/account"} 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-gray-900 font-bold flex-1"
              >
                <div className="bg-gray-900/5 p-2 rounded-full mr-3 text-gray-900">
                  <UserIcon className="h-4 w-4" strokeWidth={2.5} />
                </div>
                My Account
              </Link>
              <button 
                onClick={() => { signOut(); setMobileMenuOpen(false); }} 
                className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 hover:bg-red-100 px-5 py-3 rounded-full transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Sign In / Register
            </Link>
          )}

          {/* Bulk Enquiry Banner */}
          <div className="mt-5">
            <a 
              href="tel:+919535698866"
              className="flex items-center justify-between w-full bg-[#0a74b9] hover:bg-[#08639e] text-white p-4 rounded-2xl shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-2 rounded-full">
                  <PhoneCall className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white/90">For Bulk Enquires</span>
                  <span className="text-sm font-bold tracking-wide">+91-9535698866</span>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 -rotate-90 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
