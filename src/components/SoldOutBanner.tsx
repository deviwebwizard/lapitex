import React from "react";

export function SoldOutBanner({ className = "" }: { className?: string }) {
  const repeatText = "SOLD OUT • SOLD OUT • SOLD OUT • SOLD OUT • SOLD OUT • ";
  return (
    <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none overflow-hidden bg-red-600 text-white font-black text-xs uppercase tracking-widest py-1.5 shadow-md border-y border-red-700/50 flex items-center ${className}`}>
      <div className="animate-sold-out-marquee whitespace-nowrap flex items-center select-none">
        <span className="px-2">{repeatText}</span>
        <span className="px-2">{repeatText}</span>
      </div>
    </div>
  );
}
