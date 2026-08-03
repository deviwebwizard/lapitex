"use client";

import React, { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

function CarouselImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-48 md:h-64 rounded-lg bg-white/10 flex flex-col items-center justify-center p-4 text-center border border-white/20">
        <ImageIcon className="w-10 h-10 text-white/50 mb-2" />
        <span className="text-xs font-semibold text-white/70">Featured Deal</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setError(true)}
      className="rounded-lg shadow-lg w-full h-48 md:h-64 object-cover"
    />
  );
}

export function HeroCarousel({ slides }: { slides?: any[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  const defaultSlides = [
    {
      title: "Premium Refurbished IT Solutions",
      subtitle: "Quality tested second-hand laptops, desktops, and parts. Save money without compromising on performance.",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      buttonLink: "/shop",
      buttonText: "Shop Now",
      bgClass: "bg-gradient-to-r from-[#e1467c] via-[#f472a8] to-[#e1467c]"
    },
    {
      title: "Mega Clearance Sale",
      subtitle: "Up to 50% off on all business class laptops. Limited time offer!",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
      buttonLink: "/shop?category=Laptops",
      buttonText: "Shop Laptops",
      bgClass: "bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600"
    }
  ];

  const carouselSlides = slides && slides.length > 0 ? slides : defaultSlides;

  const bgClasses = [
    "bg-gradient-to-r from-[#e1467c] via-[#f472a8] to-[#e1467c]",
    "bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600",
    "bg-gradient-to-r from-fuchsia-600 to-pink-500",
    "bg-gradient-to-r from-rose-600 to-pink-600"
  ];

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {carouselSlides.map((slide, index) => (
          <div className="flex-[0_0_100%] min-w-0" key={slide.id || index}>
            <section className={`${slide.bgClass || bgClasses[index % bgClasses.length]} text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-[500px] md:h-[480px] md:min-h-0 flex items-center`}>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full">
                <div className="md:w-1/2 space-y-4 md:space-y-6 pt-4 md:pt-0">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight drop-shadow-sm">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-xl text-white/90 max-w-lg font-medium">
                    {slide.subtitle || slide.description}
                  </p>
                  <div className="flex space-x-4 pt-2">
                    <Link href={slide.buttonLink || slide.link || "/shop"} className="bg-white text-[#e1467c] px-7 py-3.5 rounded-full font-bold hover:bg-pink-50 transition-all duration-300 inline-flex items-center shadow-xl hover:scale-105 active:scale-95">
                      {slide.buttonText || "Shop Now"} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                  <div className="w-full max-w-md bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30 shadow-2xl transform transition-transform hover:scale-105 duration-300">
                    <CarouselImage src={slide.imageUrl || slide.image} alt={slide.title || "Slide Image"} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
}
