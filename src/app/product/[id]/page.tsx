import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CompareButton } from "@/components/CompareButton";
import { ProductTabs } from "@/components/ProductTabs";
import { parseSpecs } from "@/lib/parseSpecs";
import ProductTracker from "@/components/ProductTracker";
import { ProductGallery } from "@/components/ProductGallery";
import { getProductImages } from "@/lib/productImages";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    notFound();
  }

  const specifications = parseSpecs(product.name, product.description, product.category);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 md:pb-12">
      <ProductTracker productId={product.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8 text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Link>

        {/* Main Product Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Manual product image gallery */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 relative">
              {product.imageUrl ? (
                <ProductGallery images={getProductImages(product.imageUrl, product.id, 5, product.imageUrls)} alt={product.name} />
              ) : (
                <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-[2rem] min-h-[300px] md:min-h-[450px] text-gray-400 text-lg font-medium">No Image Available</div>
              )}
              {product.imageUrl && (
                <div className="absolute top-4 right-4">
                  <CompareButton product={product} />
                </div>
              )}
              
              {/* Trust Badges - Mobile visible, Desktop also */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center space-x-2 text-xs md:text-sm font-semibold text-green-600 bg-green-50 py-3 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Quality Checked</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs md:text-sm font-semibold text-blue-600 bg-blue-50 py-3 rounded-xl border border-blue-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{product.condition === 'New' ? '1 Year' : '6 Months'} Warranty</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
              <div className="mb-4 space-x-2">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {product.condition === 'Used' ? 'In-built' : product.condition}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end space-x-4 mb-6 pb-6 border-b border-gray-100">
                <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through mb-1 font-medium">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {(product.discountBadge || (product.originalPrice && product.originalPrice > product.price)) && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold tracking-wide mb-1">
                    {product.discountBadge ? product.discountBadge : `${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF`}
                  </span>
                )}
              </div>
              
              <div className="prose prose-sm text-gray-600 mb-8 line-clamp-4">
                <p>{product.description}</p>
              </div>
              
              <div className="space-y-4 mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center text-sm text-gray-700">
                  <Truck className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span>Free delivery across India within <strong>3-5 business days</strong>.</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <ShieldCheck className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span>Secure Checkout with SSL Encryption.</span>
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="mt-auto hidden md:block">
                <AddToCartButton product={product} disabled={product.stock === 0} />
                {product.stock > 0 && product.stock < 5 && (
                  <p className="text-center text-sm text-orange-500 mt-4 font-semibold tracking-wide">
                    Hurry! Only {product.stock} left in stock.
                  </p>
                )}
              </div>
            </div>
            
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs 
          description={product.description} 
          specifications={specifications} 
          condition={product.condition} 
        />
        
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Total Price</span>
            <span className="text-lg font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          </div>
          <div className="flex-grow">
            <AddToCartButton product={product} disabled={product.stock === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
