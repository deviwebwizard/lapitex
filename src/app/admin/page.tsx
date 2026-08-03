import prisma from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count({ where: { role: 'CUSTOMER' } });
  
  const ordersCount = await prisma.order.count();
  
  const revenueAggregation = await prisma.order.aggregate({
    _sum: {
      total: true
    }
  });
  
  const totalRevenue = revenueAggregation._sum.total || 0;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      orderItems: true
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex items-center">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex items-center">
          <div className="bg-green-100 text-green-600 p-4 rounded-full mr-4">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{ordersCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex items-center">
          <div className="bg-purple-100 text-purple-600 p-4 rounded-full mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex items-center">
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registered Users</p>
            <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent orders to display.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">{order.user.name}</p>
                        <p className="text-gray-500 text-xs">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
