import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Mail, Package, ShoppingCart, Eye, Clock, Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true, views: true, cartItems: true }
      },
      cartItems: {
        include: { product: true }
      },
      views: {
        orderBy: { viewedAt: 'desc' },
        take: 3,
        include: { product: true }
      }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2d1a26] tracking-tight">Users</h1>
        <p className="text-sm text-[#4a1a2e]/50 font-medium mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="clay-card p-6 group">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              
              {/* User Info */}
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm mr-4 text-white shadow-lg flex-shrink-0"
                  style={{ background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #e1467c, #c23066)' : 'linear-gradient(135deg, #f472a8, #fce4ec)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#2d1a26] text-base flex items-center gap-2">
                    {user.name}
                    {user.role === 'ADMIN' && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)', color: 'white' }}>
                        <Crown className="w-2.5 h-2.5" /> Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#4a1a2e]/40 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 flex-shrink-0" /> {user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#4a1a2e]/30 font-medium">
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDistanceToNow(new Date(user.lastOnline), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/30" title="Total Orders">
                  <Package className="w-3.5 h-3.5 text-[#e1467c]" />
                  <span className="font-black text-[#2d1a26] text-sm">{user._count.orders}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/30" title="In Cart">
                  <ShoppingCart className="w-3.5 h-3.5 text-[#e1467c]" />
                  <span className="font-black text-[#2d1a26] text-sm">{user._count.cartItems}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-50/80 to-white/50 border border-pink-100/30" title="Product Views">
                  <Eye className="w-3.5 h-3.5 text-[#e1467c]" />
                  <span className="font-black text-[#2d1a26] text-sm">{user._count.views}</span>
                </div>
              </div>
            </div>

            {/* Expandable detail */}
            {(user.cartItems.length > 0 || user.views.length > 0) && (
              <div className="mt-4 pt-4 border-t border-pink-100/30 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {user.cartItems.length > 0 && (
                  <div>
                    <p className="font-bold text-[#e1467c] uppercase tracking-widest text-[9px] mb-2">In Cart</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.cartItems.map(c => (
                        <span key={c.id} className="px-2.5 py-1 bg-pink-50/80 text-[#2d1a26] rounded-full text-[10px] font-semibold border border-pink-100/40 truncate max-w-[180px]">
                          {c.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user.views.length > 0 && (
                  <div>
                    <p className="font-bold text-[#e1467c] uppercase tracking-widest text-[9px] mb-2">Recently Viewed</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.views.map(v => (
                        <span key={v.id} className="px-2.5 py-1 bg-pink-50/80 text-[#2d1a26] rounded-full text-[10px] font-semibold border border-pink-100/40 truncate max-w-[180px]">
                          {v.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <div className="clay-card p-16 text-center">
            <p className="text-[#4a1a2e]/40 font-medium">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
