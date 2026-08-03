import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Package } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin should be redirected to admin panel
  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{session.user?.name}</h2>
                <p className="text-gray-500">{session.user?.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Role:</strong> Customer</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="mr-2 h-5 w-5" /> Order History
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <p className="mb-4">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total</p>
                        <p className="text-sm font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right flex-grow sm:flex-grow-0">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-sm font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-white">
                      <ul className="divide-y divide-gray-100">
                        {order.orderItems.map((item) => (
                          <li key={item.id} className="py-4 flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 p-1 flex items-center justify-center">
                              {item.product.imageUrl ? (
                                <img src={item.product.imageUrl} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <span className="text-xs text-gray-400">No img</span>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
