import prisma from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ShopFilters } from "@/components/ShopFilters";
import { ShopSearch } from "@/components/ShopSearch";
import { ShopSort } from "@/components/ShopSort";
import { CompareButton } from "@/components/CompareButton";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const conditionFilter = typeof resolvedSearchParams.condition === 'string' ? resolvedSearchParams.condition : undefined;
  const minPrice = typeof resolvedSearchParams.min === 'string' ? parseInt(resolvedSearchParams.min) : undefined;
  const maxPrice = typeof resolvedSearchParams.max === 'string' ? parseInt(resolvedSearchParams.max) : undefined;
  const searchQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const sortParam = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'latest';

  // Build the Prisma where clause dynamically
  const whereClause: any = {};
  
  if (categoryFilter) whereClause.category = categoryFilter;
  if (conditionFilter) whereClause.condition = conditionFilter;
  if (searchQuery) {
    whereClause.name = { contains: searchQuery }; // SQLite case-sensitivity might apply, but basic contains works
  }
  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = minPrice;
    if (maxPrice) whereClause.price.lte = maxPrice;
  }

  // Build Prisma orderBy clause
  let orderByClause: any = { createdAt: 'desc' };
  if (sortParam === 'price_asc') {
    orderByClause = { price: 'asc' };
  } else if (sortParam === 'price_desc') {
    orderByClause = { price: 'desc' };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ShopFilters />
          </Suspense>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {categoryFilter ? `${categoryFilter}` : 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Showing {products.length} results</p>
            </div>
            <div className="flex items-center space-x-4">
              <Suspense fallback={<div>Loading sort...</div>}>
                <ShopSort />
              </Suspense>
              <Suspense fallback={<div>Loading search...</div>}>
                <ShopSearch />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? products.map((product) => {
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
                        <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
                      )}
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 tracking-wide">
                          {discountPercent}% OFF
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full text-gray-600 shadow-sm border border-gray-100/50 uppercase tracking-widest">
                        {product.condition}
                      </div>
                    </div>
                    <div className="p-6 pb-2">
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
                  <div className="p-6 pt-0 mt-auto">
                    <AddToCartButton product={product} disabled={product.stock === 0} />
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button onClick={() => window.location.href = '/shop'} className="mt-4 text-primary font-bold hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
