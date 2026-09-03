"use client";

import { useEffect, useState } from "react";

export function FeaturedProductImage({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const availableImages = images.filter((image) => !failedImages.includes(image));

  useEffect(() => {
    setActiveIndex((current) => availableImages.length ? current % availableImages.length : 0);
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % Math.max(availableImages.length, 1)), 3500);
    return () => window.clearInterval(timer);
  }, [availableImages.length]);

  return (
    <div className="absolute inset-0">
      {availableImages.map((image, index) => (
        <img key={image} src={image} alt={alt} onError={() => setFailedImages((current) => [...current, image])} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeIndex === index ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
        {availableImages.map((image, index) => <span key={image} className={`h-1.5 rounded-full transition-all ${activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/70"}`} />)}
      </div>
    </div>
  );
}
