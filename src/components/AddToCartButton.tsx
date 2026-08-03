"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
        disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : added 
            ? "bg-green-500 text-white" 
            : "bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg"
      }`}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" /> {disabled ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </button>
  );
}
