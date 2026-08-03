"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  
  
  // Script loaded state for Razorpay
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

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

    if (paymentMethod === 'COD') {
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
    } else {
      // Razorpay Flow
      try {
        const response = await fetch('/api/checkout/razorpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "Failed to create order");
        
        if (!isRazorpayLoaded) {
          throw new Error("Razorpay SDK failed to load. Are you online?");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          amount: data.amount,
          currency: data.currency,
          name: "Lapitex",
          description: "Test Transaction",
          order_id: data.orderId,
          handler: function (response: any) {
            handleRazorpaySuccess(response);
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
          theme: {
            color: "#e1467c"
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
          alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
      } catch (error: any) {
        alert(error.message || "Something went wrong creating the payment. Please try again.");
      } finally {
        setIsCheckingOut(false);
      }
    }
  };

  const handleRazorpaySuccess = async (paymentDetails: any) => {
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/checkout/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentDetails,
          items
        })
      });

      if (!response.ok) throw new Error("Failed to verify payment");
      
      alert("Payment successful! Order placed.");
      clearCart();
      router.push("/account");
    } catch (error) {
      alert("Payment verification failed. Please contact support if money was deducted.");
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

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="w-4 h-4 text-primary" 
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Pay Online</p>
                      <p className="text-xs text-gray-500">Cards, UPI, Netbanking (Razorpay)</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="w-4 h-4 text-primary" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives</p>
                    </div>
                  </div>
                </label>
              </div>
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
              {paymentMethod === 'RAZORPAY' 
                ? "You will be redirected to a secure payment gateway." 
                : "Complete your order now and pay later."}
            </p>
          </div>
        </div>
      </div>

      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        onLoad={() => setIsRazorpayLoaded(true)}
      />
    </div>
  );
}
