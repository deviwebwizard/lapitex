"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Upload, Eye, EyeOff, Sparkles, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function SafeImagePreview({ src, alt, heightClass = "h-28" }: { src: string; alt: string; heightClass?: string }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className={`w-full ${heightClass} rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 flex flex-col items-center justify-center p-3 text-center`}>
        <ImageIcon className="w-6 h-6 text-[#e1467c]/40 mb-1.5" />
        <span className="text-[11px] font-semibold text-[#4a1a2e]/50">
          {!src ? "No image URL" : "Preview unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full ${heightClass} rounded-2xl border border-pink-100/40 overflow-hidden bg-pink-50/30 relative shadow-sm`}>
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [savedCarousel, setSavedCarousel] = useState(false);
  const [savedShipping, setSavedShipping] = useState(false);

  const [shippingFee, setShippingFee] = useState<number>(
    initialSettings.SHIPPING_FEE !== undefined ? Number(initialSettings.SHIPPING_FEE) : 0
  );

  const defaultBanner = { isActive: true, isStickyActive: true, text: "Independence Day Sale! Use code IND77 for 10% off." };
  const [banner, setBanner] = useState({ ...defaultBanner, ...(initialSettings.SALE_BANNER || {}) });

  const defaultCarousel = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
      title: "Premium Refurbished Laptops",
      subtitle: "Save up to 40% on top brands.",
      buttonText: "Shop Now",
      buttonLink: "/shop"
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800",
      title: "Mega Clearance Sale",
      subtitle: "Up to 50% off on all business class laptops.",
      buttonText: "Shop Laptops",
      buttonLink: "/shop?category=Laptops"
    }
  ];

  const [carousel, setCarousel] = useState<any[]>(
    initialSettings.HERO_CAROUSEL && initialSettings.HERO_CAROUSEL.length > 0
      ? initialSettings.HERO_CAROUSEL
      : defaultCarousel
  );

  const handleSaveBanner = async () => {
    setLoading(true);
    setSavedBanner(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "SALE_BANNER", value: banner })
      });
      if (res.ok) {
        setSavedBanner(true);
        router.refresh();
        setTimeout(() => setSavedBanner(false), 3000);
      } else {
        alert("Failed to save banner");
      }
    } catch {
      alert("Error saving banner");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCarousel = async () => {
    setLoading(true);
    setSavedCarousel(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "HERO_CAROUSEL", value: carousel })
      });
      if (res.ok) {
        setSavedCarousel(true);
        router.refresh();
        setTimeout(() => setSavedCarousel(false), 3000);
      } else {
        alert("Failed to save carousel");
      }
    } catch {
      alert("Error saving carousel");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShipping = async () => {
    setLoading(true);
    setSavedShipping(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "SHIPPING_FEE", value: shippingFee })
      });
      if (res.ok) {
        setSavedShipping(true);
        router.refresh();
        setTimeout(() => setSavedShipping(false), 3000);
      } else {
        alert("Failed to save shipping fee");
      }
    } catch {
      alert("Error saving shipping fee");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        const newCarousel = [...carousel];
        newCarousel[slideIndex].imageUrl = data.url;
        setCarousel(newCarousel);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const addSlide = () => {
    setCarousel([
      ...carousel,
      {
        id: Date.now().toString(),
        imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
        title: "New Featured Offer",
        subtitle: "Special pricing available today.",
        buttonText: "Shop Now",
        buttonLink: "/shop"
      }
    ]);
  };

  const removeSlide = (index: number) => {
    const newCarousel = [...carousel];
    newCarousel.splice(index, 1);
    setCarousel(newCarousel);
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newCarousel = [...carousel];
    newCarousel[index][field] = value;
    setCarousel(newCarousel);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#2d1a26] tracking-tight">Site Settings</h1>
        <p className="text-sm text-[#4a1a2e]/50 font-medium mt-1">Configure your storefront appearance & hero banner</p>
      </div>

      {/* ──── Sale Banner ──── */}
      <div className="clay-card p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e1467c] to-[#f472a8] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 6px 20px rgba(225,70,124,0.25)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2d1a26]">Top Sale Banner</h2>
              <p className="text-[10px] text-[#4a1a2e]/40 font-medium">Displayed live across the top of your store</p>
            </div>
          </div>
          <button onClick={handleSaveBanner} disabled={loading} className={`clay-btn flex items-center px-5 py-2.5 text-white font-bold text-sm gap-2 ${savedBanner ? '!bg-emerald-500' : ''}`}>
            <Save className="w-4 h-4" /> {savedBanner ? "Saved ✓" : "Save Banner"}
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Main hero banner toggle */}
          <button 
            onClick={() => setBanner({ ...banner, isActive: !banner.isActive })}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all w-full text-left font-bold text-sm ${
              banner.isActive 
                ? 'bg-gradient-to-r from-pink-50/80 to-white/50 border-[#e1467c]/20 text-[#e1467c]' 
                : 'bg-pink-50/30 border-pink-100/30 text-[#4a1a2e]/40'
            }`}
          >
            {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{banner.isActive ? "Main banner is ACTIVE on website" : "Main banner is HIDDEN"}</span>
          </button>

          {/* Sticky top banner toggle */}
          <button 
            onClick={() => setBanner({ ...banner, isStickyActive: !banner.isStickyActive })}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all w-full text-left font-bold text-sm ${
              banner.isStickyActive
                ? 'bg-gradient-to-r from-pink-50/80 to-white/50 border-[#e1467c]/20 text-[#e1467c]' 
                : 'bg-pink-50/30 border-pink-100/30 text-[#4a1a2e]/40'
            }`}
          >
            {banner.isStickyActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{banner.isStickyActive ? "Sticky banner is ACTIVE on website" : "Sticky banner is HIDDEN"}</span>
          </button>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Banner Text</label>
            <input 
              value={banner.text} 
              onChange={e => setBanner({ ...banner, text: e.target.value })} 
              className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" 
            />
          </div>

          {/* Live Preview */}
          {banner.isStickyActive && (
            <div className="mt-2 rounded-2xl overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #e1467c, #f472a8, #e1467c)' }}>
              <div className="p-1 text-[#2d1a26] text-[10px] font-black uppercase text-center bg-white/20 tracking-wider">Live Preview</div>
              <p className="text-white text-xs font-bold tracking-widest uppercase py-2.5 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> {banner.text} <Sparkles className="w-3.5 h-3.5" />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ──── Shipping Settings ──── */}
      <div className="clay-card p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 6px 20px rgba(99,102,241,0.25)' }}>
              <span className="text-white text-lg">🚚</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2d1a26]">Shipping Configuration</h2>
              <p className="text-[10px] text-[#4a1a2e]/40 font-medium">Set your default shipping and delivery charges</p>
            </div>
          </div>
          <button onClick={handleSaveShipping} disabled={loading} className={`clay-btn flex items-center px-5 py-2.5 text-white font-bold text-sm gap-2 ${savedShipping ? '!bg-emerald-500' : ''}`}>
            <Save className="w-4 h-4" /> {savedShipping ? "Saved ✓" : "Save Shipping"}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#e1467c] uppercase tracking-widest">Flat Shipping Fee (₹)</label>
            <input 
              type="number"
              value={shippingFee} 
              onChange={e => setShippingFee(Number(e.target.value))} 
              className="w-full px-4 py-3 bg-pink-50/40 border border-pink-100/40 rounded-2xl text-sm font-medium text-[#2d1a26]" 
            />
            <p className="text-xs text-[#4a1a2e]/60 font-medium">Set to 0 for Free Shipping.</p>
          </div>
        </div>
      </div>

      {/* ──── Hero Carousel ──── */}
      <div className="clay-card p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 6px 20px rgba(139,92,246,0.25)' }}>
              <span className="text-white text-lg">🎠</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#2d1a26]">Hero Carousel Sliders</h2>
              <p className="text-[10px] text-[#4a1a2e]/40 font-medium">{carousel.length} slide{carousel.length !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
          <button onClick={handleSaveCarousel} disabled={loading} className={`clay-btn flex items-center px-5 py-2.5 text-white font-bold text-sm gap-2 ${savedCarousel ? '!bg-emerald-500' : ''}`}>
            <Save className="w-4 h-4" /> {savedCarousel ? "Saved ✓" : "Save Carousel"}
          </button>
        </div>

        <div className="space-y-6">
          {carousel.map((slide, index) => (
            <div key={slide.id || index} className="p-5 sm:p-6 bg-gradient-to-r from-pink-50/60 to-white/40 border border-pink-100/30 rounded-3xl relative group shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100/30">
                <span className="text-[10px] font-black text-[#e1467c] uppercase tracking-[0.25em]">Slide #{index + 1}</span>
                {carousel.length > 1 && (
                  <button onClick={() => removeSlide(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center text-xs font-bold gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#4a1a2e]/40 uppercase tracking-widest">Headline Title</label>
                    <input value={slide.title || ""} onChange={e => updateSlide(index, 'title', e.target.value)} className="w-full px-4 py-2.5 bg-white/80 border border-pink-100/40 rounded-xl text-sm font-semibold text-[#2d1a26]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#4a1a2e]/40 uppercase tracking-widest">Subtitle Description</label>
                    <input value={slide.subtitle || ""} onChange={e => updateSlide(index, 'subtitle', e.target.value)} className="w-full px-4 py-2.5 bg-white/80 border border-pink-100/40 rounded-xl text-sm font-medium text-[#2d1a26]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#4a1a2e]/40 uppercase tracking-widest">Button Text</label>
                      <input value={slide.buttonText || ""} onChange={e => updateSlide(index, 'buttonText', e.target.value)} className="w-full px-4 py-2.5 bg-white/80 border border-pink-100/40 rounded-xl text-sm font-medium text-[#2d1a26]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#4a1a2e]/40 uppercase tracking-widest">Button Link</label>
                      <input value={slide.buttonLink || ""} onChange={e => updateSlide(index, 'buttonLink', e.target.value)} className="w-full px-4 py-2.5 bg-white/80 border border-pink-100/40 rounded-xl text-sm font-medium text-[#2d1a26]" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[#4a1a2e]/40 uppercase tracking-widest">Slide Image</label>
                  <input 
                    value={slide.imageUrl || ""} 
                    onChange={e => updateSlide(index, 'imageUrl', e.target.value)} 
                    placeholder="Image URL (e.g. https://... or upload below)" 
                    className="w-full px-4 py-2.5 bg-white/80 border border-pink-100/40 rounded-xl text-sm font-medium text-[#2d1a26] placeholder-[#4a1a2e]/20" 
                  />
                  
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, index)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full px-4 py-2.5 bg-white/60 border-2 border-dashed border-pink-200/70 rounded-xl text-center text-xs font-bold text-[#e1467c] hover:bg-pink-50/70 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? "Uploading file..." : "Upload New Image"}
                    </div>
                  </div>

                  {/* Image Preview with Fallback */}
                  <SafeImagePreview src={slide.imageUrl || ""} alt={slide.title || "Slide Image"} heightClass="h-32" />
                </div>
              </div>
            </div>
          ))}

          <button onClick={addSlide} className="w-full py-4 border-2 border-dashed border-pink-200/60 rounded-3xl flex items-center justify-center text-[#e1467c] font-bold text-sm hover:bg-pink-50/50 hover:border-[#e1467c]/40 transition-all gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Another Slide
          </button>
        </div>
      </div>
    </div>
  );
}
