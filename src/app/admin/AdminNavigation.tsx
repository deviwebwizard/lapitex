"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { LayoutDashboard, Users, Package, Settings, ArrowLeft, Crown, Sparkles, Menu, X, LogOut, ShoppingCart, ListTree } from "lucide-react";

export function AdminNavigation({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: ListTree },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* ──── Mobile Sticky Top Bar (<md) ──── */}
      <header className="md:hidden sticky top-0 z-40 px-4 py-3 border-b border-white/10 flex items-center justify-between shadow-lg" style={{ background: 'linear-gradient(130deg, #2d1a26 0%, #1a0e16 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white leading-tight">Admin</h2>
            <p className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-white/50 hover:text-white transition-colors rounded-lg bg-white/5 text-xs font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Site
          </Link>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            aria-label="Toggle admin menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ──── Mobile Drawer Overlay (<md) ──── */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 md:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
        onClick={() => setMobileOpen(false)}
      >
        {/* Mobile Drawer */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-72 p-6 flex flex-col transform transition-transform duration-300 ease-out shadow-2xl ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ background: 'linear-gradient(180deg, #2d1a26 0%, #1a0e16 100%)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white text-lg">Admin Menu</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-xl">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-2xl font-medium text-sm transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-[#e1467c]/30 to-[#f472a8]/20 text-[#f472a8] border-l-4 border-[#f472a8] shadow-md' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3.5 ${active ? 'text-[#f472a8]' : 'text-white/40'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Back to Site */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <button 
              onClick={() => { useCartStore.getState().clearCart(); signOut({ callbackUrl: '/' })}}
              className="w-full flex items-center justify-center py-2.5 bg-[#e1467c]/10 hover:bg-[#e1467c]/20 text-[#f472a8] font-bold text-xs rounded-xl transition-all border border-[#e1467c]/20"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
            </button>
            <div className="flex items-center p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mr-3 text-white" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || "Admin User"}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
              </div>
            </div>

            <Link 
              href="/" 
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* ──── Desktop Sidebar (md+) ──── */}
      <aside className="hidden md:flex w-72 flex-shrink-0 min-h-screen flex-col border-r border-white/5" style={{ background: 'linear-gradient(180deg, #2d1a26 0%, #1a0e16 100%)' }}>
        
        {/* Header */}
        <div className="p-6 pb-5">
          <Link href="/" className="flex items-center text-white/40 hover:text-white/80 transition-colors mb-5 text-xs font-semibold tracking-wider uppercase group">
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Site
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Admin</h2>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Control Panel</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-4 px-4 space-y-1.5 border-b border-white/5 pb-6">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] px-4 mb-3">Navigation</p>
          
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 group ${
                  active 
                    ? 'bg-gradient-to-r from-[#e1467c]/25 to-[#f472a8]/10 text-[#f472a8] border-l-4 border-[#f472a8] font-bold shadow-md' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-colors ${
                  active ? 'bg-[#e1467c]/30 text-[#f472a8]' : 'bg-white/5 group-hover:bg-[#e1467c]/20 group-hover:text-[#f472a8]'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* User Info */}
        <div className="p-4 mt-2">
          <button 
            onClick={() => { useCartStore.getState().clearCart(); signOut({ callbackUrl: '/' })}}
            className="w-full flex items-center justify-center py-2 mb-3 bg-[#e1467c]/10 hover:bg-[#e1467c]/20 text-[#f472a8] font-bold text-xs rounded-xl transition-all border border-[#e1467c]/20"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
          </button>
          <div className="flex items-center p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mr-3 text-white" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
              <span>{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || "Admin User"}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#f472a8]/50 flex-shrink-0 ml-2" />
          </div>
        </div>
      </aside>
    </>
  );
}
