"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PromotionalCardProps = {
  href: string;
  title: string;
  description: string;
  action: string;
  images: string[];
  align?: "left" | "right";
};

export function PromotionalCard({
  href,
  title,
  description,
  action,
  images,
  align = "left",
}: PromotionalCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <Link href={href} className="block rounded-2xl overflow-hidden relative group shadow-md">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className={`relative h-48 bg-black/30 flex items-center ${align === "right" ? "bg-gradient-to-l from-primary/90 to-black/40 justify-end text-right" : "bg-gradient-to-r from-black/80 to-transparent"} p-6`}>
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-100 mb-4 text-sm">{description}</p>
          <span className={`${align === "right" ? "bg-white text-primary" : "bg-primary text-white"} px-4 py-2 rounded-md font-bold text-sm`}>{action}</span>
        </div>
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
          {images.map((image, index) => (
            <span key={image} className={`h-1.5 rounded-full transition-all ${activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
          ))}
        </div>
      </div>
    </Link>
  );
}
