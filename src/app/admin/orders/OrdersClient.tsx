"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Package, User, CheckCircle, Clock, Truck, XCircle, RefreshCcw, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string | null;
  };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  RETURNED: "bg-gray-100 text-gray-700 border-gray-200"
};

const STATUS_ICONS: Record<string, any> = {
  PENDING: Clock,
  PROCESSING: RefreshCcw,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  RETURNED: RefreshCcw
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const router = useRouter();

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.user.name.toLowerCase().includes(search.toLowerCase()) ||
    order.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        const { order: updatedOrder } = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updatedOrder.status } : o));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#e1467c]" />
        </div>
        <input
          type="text"
          placeholder="Search orders by ID, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/60 border border-pink-100/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e1467c]/30 text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/40 shadow-inner"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 clay-card">
            <Package className="w-12 h-12 text-[#4a1a2e]/20 mx-auto mb-3" />
            <p className="text-[#4a1a2e]/60 font-medium">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isExpanded = expandedOrder === order.id;
            const StatusIcon = STATUS_ICONS[order.status] || Package;

            return (
              <div key={order.id} className="clay-card overflow-hidden transition-all duration-300">
                {/* Main Row */}
                <div 
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex flex-col items-center justify-center border border-pink-100/50">
                      <span className="text-[10px] font-black text-[#e1467c] uppercase">Items</span>
                      <span className="text-lg font-black text-[#2d1a26] leading-none">{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#2d1a26] text-sm">#{order.id.slice(-8).toUpperCase()}</h3>
                        <span className="text-[10px] text-[#4a1a2e]/50 font-semibold">• {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#4a1a2e]/70 font-medium">
                        <User className="w-3.5 h-3.5" />
                        {order.user.name} ({order.user.email})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-[#4a1a2e]/50 uppercase tracking-widest mb-0.5">Total</p>
                      <p className="font-black text-[#e1467c]">${order.total.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                      
                      <button className="p-2 text-[#4a1a2e]/40 hover:text-[#e1467c] transition-colors rounded-full hover:bg-pink-50">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-pink-100/30 bg-white/20 p-5 md:p-6 animate-in slide-in-from-top-2 duration-300">
                    
                    {/* Status Management */}
                    <div className="mb-6 flex items-center justify-between bg-white/60 p-4 rounded-2xl border border-pink-100/50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#4a1a2e]/70 uppercase tracking-wider mb-1">Update Status</span>
                        <span className="text-sm text-[#4a1a2e]/50 font-medium">Change the fulfillment status of this order.</span>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {Object.keys(STATUS_COLORS).map(status => (
                          <button
                            key={status}
                            onClick={(e) => { e.stopPropagation(); updateStatus(order.id, status); }}
                            disabled={updating === order.id || order.status === status}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              order.status === status
                                ? STATUS_COLORS[status] + " shadow-sm ring-2 ring-offset-1 ring-current"
                                : "bg-white text-[#4a1a2e]/60 border-pink-100/60 hover:bg-pink-50 hover:text-[#e1467c]"
                            } ${updating === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {updating === order.id && order.status !== status ? 'Updating...' : status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-xs font-black text-[#2d1a26] uppercase tracking-wider mb-4 border-b border-pink-100/50 pb-2">Order Items</h4>
                      <div className="space-y-3">
                        {order.orderItems.map(item => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl border border-pink-50/50">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white relative flex-shrink-0 border border-pink-100/30">
                              {item.product.imageUrl ? (
                                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-contain p-2" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-pink-200">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-bold text-[#2d1a26] truncate">{item.product.name}</h5>
                              <p className="text-xs font-semibold text-[#4a1a2e]/60 mt-1">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-[#e1467c]">${(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-pink-100/60">
                         <span className="text-sm font-bold text-[#4a1a2e]/70 uppercase tracking-wider">Total Amount</span>
                         <span className="text-xl font-black text-[#e1467c]">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                    
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
