'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ShopSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push('/shop?' + createQueryString('sort', e.target.value));
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">Sort by:</span>
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 font-medium"
      >
        <option value="latest">Latest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
