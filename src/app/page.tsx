import Link from "next/link";
import prisma from "@/lib/prisma";
import { ArrowRight, Monitor, Cpu, ShieldCheck, Laptop, Wrench } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CompareButton } from "@/components/CompareButton";
import { PromotionalCard } from "@/components/PromotionalCard";
import { FeaturedProductImage } from "@/components/FeaturedProductImage";
import { getProductImages } from "@/lib/productImages";
import type { Product } from "@/types/product";

type SaleBanner = { isActive: boolean; text?: string; mainText?: string; stickyText?: string };

export default async function Home() {
  const [featuredProducts, carouselSetting, saleBannerSetting] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
    }),
    prisma.siteSetting.findUnique({
      where: { key: "HERO_CAROUSEL" }
    }),
    prisma.siteSetting.findUnique({
      where: { key: "SALE_BANNER" }
    })
  ]);

  let carouselSlides = undefined;
  if (carouselSetting) {
    try {
      carouselSlides = JSON.parse(carouselSetting.value);
    } catch (e) {}
  }

  let saleBanner: SaleBanner | null = null;
  if (saleBannerSetting) {
    try {
      const parsed = JSON.parse(saleBannerSetting.value) as Partial<SaleBanner>;
      const mainText = parsed.mainText || parsed.text || parsed.stickyText;
      if (typeof parsed.isActive === "boolean" && typeof mainText === "string") {
        saleBanner = { ...parsed, isActive: parsed.isActive, mainText };
      }
    } catch (e) {}
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} />

      {/* Admin-controlled sale banner */}
      {saleBanner?.isActive && (
      <section className="relative z-20 -mt-12 mx-4 sm:mx-6 lg:mx-8 mb-8 max-w-7xl lg:mx-auto lg:w-[calc(100%-4rem)]">
        <div className="rounded-3xl overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60">
          {/* Subtle animated background gradient (Saffron - White - Green) */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200/40 via-white/40 to-green-200/40 opacity-90"></div>
          
          {/* Glassmorphism layer */}
          <div className="relative backdrop-blur-xl bg-white/40 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0">
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 shadow-sm">
                Live Now
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                {saleBanner.mainText}
              </h2>
            </div>
            
            <div className="flex-shrink-0">
              <Link href="/shop" className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Shop the Sale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Top Categories - Quick Links */}
      <section className="py-10 bg-white border-b border-border shadow-sm relative z-10 -mt-6 mx-4 sm:mx-6 lg:mx-8 rounded-xl px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-xl font-bold text-gray-800 mb-6 uppercase tracking-widest">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-y-4 md:flex md:flex-wrap md:justify-center md:gap-4 max-w-4xl mx-auto">
            <Link href="/shop?category=Laptops" className="w-full md:w-48 flex flex-col items-center group text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Laptop className="h-8 w-8" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Laptops</span>
            </Link>
            <Link href="/shop?category=Desktops" className="w-full md:w-48 flex flex-col items-center group text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Monitor className="h-8 w-8" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Desktops</span>
            </Link>
            <Link href="/shop?category=Parts" className="w-full md:w-48 flex flex-col items-center group text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Cpu className="h-8 w-8" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Accessories &amp; Parts</span>
            </Link>
            <Link href="/store" className="w-full md:w-48 flex flex-col items-center group text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <Wrench className="h-8 w-8" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Repair Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banners Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PromotionalCard href="/shop?category=Laptops" title="Buy New Laptops" description="Latest models for work and play" action="Shop Now" images={["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"]} />
          <PromotionalCard href="/shop?category=Laptops" title="Refurbished Laptops" description="Up to 40% Off on Dell, HP & Lenovo" action="Shop Now" images={["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800"]} />
          <PromotionalCard href="/shop?category=Parts" title="Build Your Dream PC" description="Genuine Parts & Accessories" action="Explore" align="right" images={["https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800"]} />
          <PromotionalCard href="/shop?category=Parts" title="Buy Parts" description="Upgrade your setup with quality parts" action="Explore" align="right" images={["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7c4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800"]} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Featured Deals</h2>
              <p className="text-gray-500 mt-1 font-medium">Grab these amazing offers before they are gone!</p>
            </div>
            <Link href="/shop" className="text-primary font-bold hover:underline flex items-center uppercase text-sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount 
                ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                : 0;

              return (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 group flex flex-col border border-gray-100/50">
                  <Link href={`/product/${product.id}`} className="flex-grow">
                    <div className="h-56 overflow-hidden bg-gray-50 relative flex items-center justify-center border-b border-gray-100/50">
                      <CompareButton product={product} />
                      {product.imageUrl ? (
                        <FeaturedProductImage images={getProductImages(product.imageUrl, product.id, 2, product.imageUrls, product.category)} alt={product.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                      )}
                      
                      {/* Discount Badge */}
                      {(product.discountBadge || hasDiscount) && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wide">
                          {product.discountBadge ? product.discountBadge : `${discountPercent}% OFF`}
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full text-gray-600 shadow-sm border border-gray-100/50 uppercase tracking-widest">
                        {product.condition}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-widest">{product.category}</div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 h-12 mb-3 leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through font-medium">₹{product.originalPrice!.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
              <div className="h-16 w-16 bg-pink-50 text-primary rounded-full flex items-center justify-center mb-6">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Assured</h3>
              <p className="text-gray-500">Every device undergoes a rigorous 50-point quality check before sale.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
              <div className="h-16 w-16 bg-pink-50 text-primary rounded-full flex items-center justify-center mb-6">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Wide Range of Parts</h3>
              <p className="text-gray-500">From RAM upgrades to SSDs, find all genuine parts in one place.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
              <div className="h-16 w-16 bg-pink-50 text-primary rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Trusted Warranty</h3>
              <p className="text-gray-500">We offer up to 6 months of warranty on our refurbished products.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
