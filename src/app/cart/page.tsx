"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Truck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Fetch shipping fee
    fetch("/api/settings/shipping")
      .then(res => res.json())
      .then(data => {
        if (data.shippingFee !== undefined) {
          setShippingFee(data.shippingFee);
        }
      })
      .catch(console.error);
  }, []);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any refurbished laptops or parts to your cart yet.
        </p>
        <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const finalTotal = totalPrice() + shippingFee;

  const handleCheckout = async () => {
    if (status === "unauthenticated") {
      alert("Please login to place an order.");
      router.push("/login?callbackUrl=/cart");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod: 'COD' })
      });

      if (!response.ok) throw new Error("Failed to checkout");
      
      alert("Order placed successfully via Cash on Delivery!");
      clearCart();
      router.push("/account");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mb-4">₹{item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start space-x-4">
                      <div className="flex items-center border border-border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="px-4 py-1 font-medium border-x border-border">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-gray-900">₹{totalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString()}`}
                </span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-primary">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Order method */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Order Method</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary bg-primary/5">
                <Truck className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
              <a
                href="https://wa.me/918809975386?text=Hello%20Lapitex%2C%20I%20would%20like%20to%20discuss%20my%20cart%20items."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#168f43] hover:bg-[#25D366]/10 transition-all"
              >
                <MessageCircle className="h-5 w-5" /> Discuss on WhatsApp
              </a>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                isCheckingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
              } text-white`}
            >
              {isCheckingOut ? 'Processing...' : (
                <>Checkout <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              "Complete your order now and pay on delivery."
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
