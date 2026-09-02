"use client";

import { useCompareStore } from "@/store/compareStore";
import type { Product } from "@/types/product";
import { Scale } from "lucide-react";
import { useEffect, useState } from "react";

export function CompareButton({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const { addItem, removeItem, isInCompare, items } = useCompareStore();
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  const inCompare = isInCompare(product.id);
  const isFull = items.length >= 3;

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (inCompare) {
      removeItem(product.id);
    } else {
      if (!isFull) addItem(product);
      else alert("You can only compare up to 3 items at a time.");
    }
  };

  return (
    <button 
      onClick={toggleCompare}
      className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-sm transition-all border ${inCompare ? 'bg-primary text-white border-primary' : 'bg-white/80 backdrop-blur-md text-gray-600 hover:text-primary hover:bg-white border-gray-200/50'}`}
      title={inCompare ? "Remove from Compare" : "Add to Compare"}
    >
      <Scale className="h-4 w-4" />
    </button>
  );
}
