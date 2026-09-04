"use client";

import { useEffect, useState } from "react";

const defaultImages = [
  { src: "/our-story.png", alt: "Lapitex team in the store" },
  { src: "/store-interior.png", alt: "Lapitex store interior" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000", alt: "IT workspace" },
  { src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000", alt: "Laptop workspace" },
  { src: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000", alt: "Refurbished laptop" },
];

export function OurStoryCarousel({ images = defaultImages }: { images?: { src: string; alt: string }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl">
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            activeIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show story image ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${activeIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
