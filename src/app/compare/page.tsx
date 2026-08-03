"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Products</h1>
        <p className="text-gray-500 mb-8 text-center">You haven't added any products to compare yet.</p>
        <Link href="/shop" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <Link href="/shop" className="text-sm font-semibold text-primary flex items-center hover:underline mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Compare Products</h1>
          </div>
          <button 
            onClick={clearCompare}
            className="text-sm text-red-500 font-semibold hover:underline flex items-center mt-4 md:mt-0"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-6 border-b border-gray-100 bg-gray-50 w-1/4">Features</th>
                {items.map(product => (
                  <th key={product.id} className="p-6 border-b border-gray-100 border-l relative w-1/4 align-top">
                    <button 
                      onClick={() => removeItem(product.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm border border-gray-100"
                      title="Remove from compare"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="h-32 flex items-center justify-center mb-4 bg-[#fbfbfd] rounded-2xl">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain mix-blend-multiply p-4" />
                      ) : (
                        <div className="text-gray-400 text-sm">No Image</div>
                      )}
                    </div>
                    <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors block">
                      <h3 className="font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                    </Link>
                  </th>
                ))}
                {/* Empty columns to maintain grid if less than 3 items */}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-6 border-b border-gray-100 border-l bg-gray-50/50 w-1/4 text-center text-gray-400 font-normal">
                    Add another product to compare
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-6 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">Price</td>
                {items.map(product => (
                  <td key={product.id} className="p-6 border-b border-gray-100 border-l">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-price-${i}`} className="p-6 border-b border-gray-100 border-l bg-gray-50/50"></td>
                ))}
              </tr>
              <tr>
                <td className="p-6 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">Category</td>
                {items.map(product => (
                  <td key={product.id} className="p-6 border-b border-gray-100 border-l">
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">{product.category}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-cat-${i}`} className="p-6 border-b border-gray-100 border-l bg-gray-50/50"></td>
                ))}
              </tr>
              <tr>
                <td className="p-6 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">Condition</td>
                {items.map(product => (
                  <td key={product.id} className="p-6 border-b border-gray-100 border-l">
                    <span className="font-medium text-gray-700">{product.condition}</span>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-cond-${i}`} className="p-6 border-b border-gray-100 border-l bg-gray-50/50"></td>
                ))}
              </tr>
              <tr>
                <td className="p-6 border-b border-gray-100 font-semibold text-gray-700 bg-gray-50">Availability</td>
                {items.map(product => (
                  <td key={product.id} className="p-6 border-b border-gray-100 border-l">
                    {product.stock > 0 ? (
                      <span className="flex items-center text-green-600 font-semibold text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold text-sm">Out of Stock</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-stock-${i}`} className="p-6 border-b border-gray-100 border-l bg-gray-50/50"></td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-semibold text-gray-700 bg-gray-50">Action</td>
                {items.map(product => (
                  <td key={product.id} className="p-6 border-l border-gray-100">
                    <button
                      onClick={() => addItemToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl
                      })}
                      disabled={product.stock === 0}
                      className="w-full flex items-center justify-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                    </button>
                  </td>
                ))}
                {Array.from({ length: 3 - items.length }).map((_, i) => (
                  <td key={`empty-action-${i}`} className="p-6 border-l border-gray-100 bg-gray-50/50"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
