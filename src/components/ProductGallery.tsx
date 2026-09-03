"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const showPrevious = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % images.length);

  return (
    <>
      <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-[2rem] relative min-h-[300px] md:min-h-[450px] overflow-hidden border border-gray-100 shadow-inner group">
        {images.map((image, index) => (
          <img key={image} src={image} alt={`${alt} image ${index + 1}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeIndex === index ? "opacity-100" : "opacity-0"}`} />
        ))}
        <button type="button" onClick={showPrevious} aria-label="Previous product image" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/85 p-2 text-gray-700 shadow-md hover:bg-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={showNext} aria-label="Next product image" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/85 p-2 text-gray-700 shadow-md hover:bg-white transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 rounded-xl bg-black/20 p-2 backdrop-blur-sm">
          {images.map((image, index) => (
            <button key={image} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show product image ${index + 1}`} className={`h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${activeIndex === index ? "border-white scale-105" : "border-white/50 opacity-75 hover:opacity-100"}`}>
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
