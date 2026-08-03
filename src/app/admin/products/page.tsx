import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded mr-3 overflow-hidden">
                      {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                    </div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
