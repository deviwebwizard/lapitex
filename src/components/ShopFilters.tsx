"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

const subcategories = {
  Laptops: ['H.P', 'Dell', 'Asus', 'Macbook', 'Lenovo', 'Samsung', 'Toshiba'],
  Desktops: ['H.P', 'Dell', 'Intel', 'Zebronics', 'Gigabyte', 'Ivoomi', 'frontech', 'zebion'],
  Parts: ['Keyboard', 'Mouse', 'Screen', 'SSD', 'RAM', 'SMPS', 'ATX', 'Graphics card'],
} as const;

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentSubcategory = searchParams.get('subcategory') || '';
  const currentCondition = searchParams.get('condition') || '';
  const currentMin = searchParams.get('min') || '';
  const currentMax = searchParams.get('max') || '';

  const [minPrice, setMinPrice] = useState(currentMin);
  const [maxPrice, setMaxPrice] = useState(currentMax);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(currentCategory || null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set('category', category);
    else params.delete('category');
    params.delete('subcategory');
    setExpandedCategory(category || null);
    router.push('/shop?' + params.toString());
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSubcategory === subcategory) params.delete('subcategory');
    else params.set('subcategory', subcategory);
    router.push('/shop?' + params.toString());
  };

  const handleConditionChange = (condition: string) => {
    // For simplicity, we just toggle one condition at a time in this demo.
    // Real implementation could use arrays for multiple selection.
    if (currentCondition === condition) {
      router.push('/shop?' + createQueryString('condition', ''));
    } else {
      router.push('/shop?' + createQueryString('condition', condition));
    }
  };

  const applyPriceFilter = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('min', minPrice);
    else params.delete('min');
    
    if (maxPrice) params.set('max', maxPrice);
    else params.delete('max');
    
    router.push('/shop?' + params.toString());
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/shop');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border sticky top-24">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h3 className="font-bold text-lg flex items-center text-gray-900">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          Filters
        </h3>
        {(currentCategory || currentSubcategory || currentCondition || currentMin || currentMax) && (
          <button onClick={clearFilters} className="text-xs font-semibold text-red-500 hover:text-red-700">
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-gray-900 uppercase tracking-wider">Categories</h4>
          <div className="space-y-3">
            <button 
              onClick={() => handleCategoryChange('')} 
              className={`block text-sm text-left w-full ${!currentCategory ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary font-medium'}`}
            >
              All Products
            </button>
            {(['Laptops', 'Desktops', 'Parts'] as const).map((category) => {
              const isExpanded = expandedCategory === category;
              const label = category === 'Parts' ? 'Parts & Upgrades' : category;
              return (
                <div key={category}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`block text-sm text-left flex-1 ${currentCategory === category && !currentSubcategory ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary font-medium'}`}
                    >
                      {label}
                    </button>
                    <button
                      type="button"
                      aria-label={`${isExpanded ? 'Hide' : 'Show'} ${label} subcategories`}
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className="p-1 text-gray-400 hover:text-primary"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="ml-3 mt-2 space-y-2 border-l border-gray-100 pl-3">
                      {subcategories[category].map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategoryChange(subcategory)}
                          className={`block w-full text-left text-xs ${currentSubcategory === subcategory ? 'font-bold text-primary' : 'font-medium text-gray-500 hover:text-primary'}`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Condition */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-gray-900 uppercase tracking-wider">Condition</h4>
          <div className="space-y-3">
            {[{ label: 'New', value: 'New' }, { label: 'Refurbished', value: 'Refurbished' }, { label: 'Inbuilt', value: 'Used' }].map(({ label, value }) => (
              <label key={value} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={currentCondition === value}
                  onChange={() => handleConditionChange(value)}
                  className="rounded text-primary focus:ring-primary border-gray-300 w-4 h-4 cursor-pointer" 
                />
                <span className={`text-sm font-medium ${currentCondition === value ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-bold text-sm mb-4 text-gray-900 uppercase tracking-wider">Price Range</h4>
          <div className="flex items-center space-x-2 mb-3">
            <input 
              type="number" 
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <button onClick={applyPriceFilter} className="w-full bg-gray-100 text-gray-800 font-bold py-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
            Apply Price
          </button>
        </div>
      </div>
    </div>
  );
}
