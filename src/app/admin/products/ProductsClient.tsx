"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, X, Upload, Star } from "lucide-react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  category: string;
  condition: string;
  imageUrl: string | null;
  isFeatured: boolean;
  description: string;
  _count: { orderItems: number; views: number; cartItems: number };
};

function SafeImagePreview({ src, alt, className = "w-full h-full object-cover" }: { src: string | null; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className="w-full h-full bg-pink-50/40 flex flex-col items-center justify-center p-2 text-center">
        <ImageIcon className="w-5 h-5 text-[#e1467c]/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
}

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", originalPrice: "", stock: "0",
    category: "", condition: "Refurbished", imageUrl: "", isFeatured: false,
  });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, description: product.description,
        price: product.price.toString(), originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
        stock: product.stock.toString(), category: product.category,
        condition: product.condition, imageUrl: product.imageUrl || "", isFeatured: product.isFeatured,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: "", originalPrice: "", stock: "0", category: "", condition: "Refurbished", imageUrl: "", isFeatured: false });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) setFormData({ ...formData, imageUrl: data.url });
      else alert("Upload failed: " + data.error);
    } catch { alert("Error uploading file"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : `/api/admin/products`;
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) {
        const { product } = await res.json();
        if (editingProduct) setProducts(products.map(p => p.id === product.id ? { ...p, _count: editingProduct._count } : p));
        else setProducts([{ ...product, _count: { orderItems: 0, views: 0, cartItems: 0 } }, ...products]);
        setIsModalOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save product");
      }
    } catch { alert("Error saving product"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) { setProducts(products.filter(p => p.id !== id)); router.refresh(); }
      else alert("Failed to delete product");
    } catch { alert("Error deleting product"); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2d1a26] tracking-tight">Products</h1>
          <p className="text-sm text-[#4a1a2e]/50 font-medium mt-1">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="clay-btn text-white px-6 py-3 font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="clay-card p-5 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e1467c]/50" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-pink-50/50 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/30 transition-all"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="clay-card p-5 group">
            <div className="flex items-start gap-4">
              {/* Image */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-100/40 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                <SafeImagePreview src={product.imageUrl} alt={product.name} />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-[#2d1a26] text-sm truncate">{product.name}</p>
                    <p className="text-[10px] text-[#4a1a2e]/40 font-medium mt-0.5">{product.category} · {product.condition}</p>
                  </div>
                  {product.isFeatured && (
                    <Star className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" />
                  )}
                </div>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-black text-[#2d1a26] text-lg">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#4a1a2e]/30 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                
                {/* Stats Row */}
                <div className="flex items-center gap-3 mt-3 text-[10px] font-semibold text-[#4a1a2e]/40">
                  <span>📦 {product._count.orderItems}</span>
                  <span>👁️ {product._count.views}</span>
                  <span>🛒 {product._count.cartItems}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    product.stock > 10 ? 'bg-emerald-50 text-emerald-600' :
                    product.stock > 0 ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-pink-100/30">
              <button onClick={() => openModal(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#e1467c] bg-pink-50/60 hover:bg-pink-100/60 rounded-xl transition-all">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(product.id)} className="flex items-center justify-center p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="clay-card p-16 text-center">
          <p className="text-[#4a1a2e]/40 font-medium">No products found.</p>
        </div>
      )}

      {/* ──── Modal ──── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-[#2d1a26]/30 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl glass-card-strong rounded-3xl overflow-hidden my-8" style={{ boxShadow: '0 32px 80px rgba(225,70,124,0.15)' }}>
            {/* Modal Header */}
            <div className="p-7 pb-0 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-[#2d1a26]">{editingProduct ? "Edit Product" : "New Product"}</h2>
                <p className="text-xs text-[#4a1a2e]/40 font-medium mt-0.5">Fill in the product details below</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#4a1a2e]/40 hover:text-[#e1467c] hover:bg-pink-50/60 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-7 max-h-[65vh] overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Category</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Price (₹)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Original (₹)</label>
                  <input type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="Optional" className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Condition</label>
                  <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]">
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer group px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-pink-200 rounded-lg bg-white group-hover:border-[#e1467c] transition-colors">
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="absolute opacity-0 w-full h-full cursor-pointer" />
                      {formData.isFeatured && <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#e1467c] to-[#f472a8] rounded-sm" />}
                    </div>
                    <span className="text-sm font-semibold text-[#2d1a26]">Featured</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Product Image</label>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="Image URL (e.g. https://... or upload below)" className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20" />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full px-4 py-3 bg-pink-50/40 border-2 border-dashed border-pink-200/60 rounded-2xl text-center text-sm font-semibold text-[#e1467c]/60 hover:bg-pink-50/80 hover:border-[#e1467c]/40 transition-all flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Upload Image"}
                      </div>
                    </div>
                  </div>
                  <div className="w-28 h-28 rounded-2xl border border-pink-100/40 overflow-hidden bg-pink-50/30 flex-shrink-0 relative shadow-sm">
                    <SafeImagePreview src={formData.imageUrl} alt="Modal Preview" />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-7 pt-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-6 py-3 text-[#4a1a2e]/50 font-bold text-sm hover:bg-pink-50/60 rounded-2xl transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading || uploading} className="clay-btn px-8 py-3 text-white font-bold text-sm disabled:opacity-50">
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
