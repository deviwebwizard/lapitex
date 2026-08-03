"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function ShopSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(currentQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    router.push('/shop?' + params.toString());
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..." 
        className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
      />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
