import prisma from "@/lib/prisma";
import { ShoppingCart, DollarSign, Activity, ArrowLeftRight } from "lucide-react";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      orderItems: {
        include: { product: { select: { name: true, imageUrl: true } } }
      }
    }
  });

  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "RETURNED")
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const returnedCancelled = orders.filter(o => o.status === "CANCELLED" || o.status === "RETURNED").length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#2d1a26] flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#e1467c]" />
            Orders Management
          </h1>
          <p className="text-[#4a1a2e]/60 mt-2 font-medium">
            View, track, and manage all customer orders in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="clay-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8)' }}>
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#e1467c] bg-pink-50 px-2 py-1 rounded-full uppercase tracking-widest">
              Total
            </span>
          </div>
          <p className="text-3xl font-black text-[#2d1a26] mb-1">{orders.length}</p>
          <p className="text-xs font-bold text-[#4a1a2e]/50 uppercase tracking-wider">All Time Orders</p>
        </div>

        {/* Revenue */}
        <div className="clay-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#10b981] bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
              Net
            </span>
          </div>
          <p className="text-3xl font-black text-[#2d1a26] mb-1">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs font-bold text-[#4a1a2e]/50 uppercase tracking-wider">Total Revenue</p>
        </div>

        {/* Pending */}
        <div className="clay-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#f59e0b] bg-amber-50 px-2 py-1 rounded-full uppercase tracking-widest">
              Action Req
            </span>
          </div>
          <p className="text-3xl font-black text-[#2d1a26] mb-1">{pendingOrders}</p>
          <p className="text-xs font-bold text-[#4a1a2e]/50 uppercase tracking-wider">Pending Orders</p>
        </div>

        {/* Cancelled/Returned */}
        <div className="clay-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#ef4444] bg-red-50 px-2 py-1 rounded-full uppercase tracking-widest">
              Lost
            </span>
          </div>
          <p className="text-3xl font-black text-[#2d1a26] mb-1">{returnedCancelled}</p>
          <p className="text-xs font-bold text-[#4a1a2e]/50 uppercase tracking-wider">Cancelled / Returned</p>
        </div>
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}
