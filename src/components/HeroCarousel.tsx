"use client";

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "Premium Refurbished IT Solutions",
    description: "Quality tested second-hand laptops, desktops, and parts. Save money without compromising on performance.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    link: "/shop",
    bgClass: "bg-gradient-to-r from-primary to-accent"
  },
  {
    title: "Mega Clearance Sale",
    description: "Up to 50% off on all business class laptops. Limited time offer!",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
    link: "/shop?category=Laptops",
    bgClass: "bg-gradient-to-r from-pink-600 to-purple-600"
  },
  {
    title: "Upgrade Your Rig",
    description: "Find the best deals on RAM, SSDs, and Graphics Cards.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    link: "/shop?category=Parts",
    bgClass: "bg-gradient-to-r from-fuchsia-600 to-pink-500"
  }
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div className="flex-[0_0_100%] min-w-0" key={index}>
            <section className={`${slide.bgClass} text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-[600px] md:h-[500px] md:min-h-0 flex items-center`}>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full">
                <div className="md:w-1/2 space-y-4 md:space-y-6 pt-4 md:pt-0">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex space-x-4">
                    <Link href={slide.link} className="bg-white text-primary px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                  <div className="w-full max-w-md bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 shadow-2xl transform transition-transform hover:scale-105 duration-300">
                    <img 
                      src={slide.image} 
                      alt="Promotional Image" 
                      className="rounded-lg shadow-lg w-full h-48 md:h-64 object-cover"
                    />
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
