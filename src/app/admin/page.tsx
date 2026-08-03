import prisma from "@/lib/prisma";
import { Users, Package, IndianRupee, Activity, Settings, TrendingUp, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [userCount, productCount, orderCount, totalRevenueResult, recentUsers, totalViews, totalCartItems] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true, lastOnline: true }
    }),
    prisma.productView.count(),
    prisma.cartItem.count(),
  ]);

  const totalRevenue = totalRevenueResult._sum.total || 0;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const activeUserCount = await prisma.user.count({
    where: { lastOnline: { gte: oneDayAgo } }
  });

  const metrics = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, gradient: "from-emerald-400 to-emerald-600", bgGlow: "rgba(52,211,153,0.15)" },
    { label: "Total Users", value: userCount, icon: Users, gradient: "from-[#e1467c] to-[#f472a8]", bgGlow: "rgba(225,70,124,0.12)" },
    { label: "Active (24h)", value: activeUserCount, icon: Activity, gradient: "from-violet-400 to-violet-600", bgGlow: "rgba(139,92,246,0.12)" },
    { label: "Products", value: productCount, icon: Package, gradient: "from-amber-400 to-amber-600", bgGlow: "rgba(251,191,36,0.12)" },
    { label: "Total Views", value: totalViews, icon: Eye, gradient: "from-sky-400 to-sky-600", bgGlow: "rgba(56,189,248,0.12)" },
    { label: "In Carts", value: totalCartItems, icon: ShoppingCart, gradient: "from-rose-400 to-rose-600", bgGlow: "rgba(251,113,133,0.12)" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2d1a26] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#4a1a2e]/50 font-medium mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>
      
      {/* ──── Metrics Grid ──── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {metrics.map((m, i) => (
          <div key={i} className="clay-card p-5 flex flex-col items-start group cursor-default">
            <div 
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              style={{ boxShadow: `0 8px 24px ${m.bgGlow}` }}
            >
              <m.icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-black text-[#2d1a26] tracking-tight">{m.value}</p>
            <p className="text-[10px] font-bold text-[#4a1a2e]/40 uppercase tracking-widest mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* ──── Recent Users ──── */}
        <div className="lg:col-span-3 clay-card p-7">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-lg font-black text-[#2d1a26] tracking-tight">Recent Users</h2>
            <Link href="/admin/users" className="text-xs font-bold text-[#e1467c] hover:text-[#c23066] transition-colors uppercase tracking-wider">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/50 transition-all duration-200 group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm mr-4 text-white shadow-md"
                    style={{ background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #e1467c, #c23066)' : 'linear-gradient(135deg, #f472a8, #fce4ec)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[#2d1a26] text-sm flex items-center gap-2">
                      {user.name}
                      {user.role === 'ADMIN' && (
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)', color: 'white' }}>
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#4a1a2e]/40">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-[#4a1a2e]/30">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ──── Quick Actions ──── */}
        <div className="lg:col-span-2 clay-card p-7">
          <h2 className="text-lg font-black text-[#2d1a26] tracking-tight mb-7">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/products" className="group flex items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/40 hover:border-[#e1467c]/20 hover:from-pink-100/80 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e1467c] to-[#f472a8] flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform" style={{ boxShadow: '0 6px 20px rgba(225,70,124,0.25)' }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-[#2d1a26] text-sm">Manage Products</span>
                <p className="text-[10px] text-[#4a1a2e]/40 font-medium">Add, edit, or remove items</p>
              </div>
            </Link>
            
            <Link href="/admin/users" className="group flex items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/40 hover:border-[#e1467c]/20 hover:from-pink-100/80 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform" style={{ boxShadow: '0 6px 20px rgba(139,92,246,0.25)' }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-[#2d1a26] text-sm">User Management</span>
                <p className="text-[10px] text-[#4a1a2e]/40 font-medium">View analytics & activity</p>
              </div>
            </Link>
            
            <Link href="/admin/settings" className="group flex items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/40 hover:border-[#e1467c]/20 hover:from-pink-100/80 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform" style={{ boxShadow: '0 6px 20px rgba(251,191,36,0.25)' }}>
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-[#2d1a26] text-sm">Site Settings</span>
                <p className="text-[10px] text-[#4a1a2e]/40 font-medium">Banners, carousel, config</p>
              </div>
            </Link>

            <Link href="/shop" className="group flex items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/40 hover:border-[#e1467c]/20 hover:from-pink-100/80 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform" style={{ boxShadow: '0 6px 20px rgba(52,211,153,0.25)' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-[#2d1a26] text-sm">View Storefront</span>
                <p className="text-[10px] text-[#4a1a2e]/40 font-medium">See your live store</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
