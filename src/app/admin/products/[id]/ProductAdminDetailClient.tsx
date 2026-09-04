"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";

type Product = {
  id: string; name: string; description: string; price: number; originalPrice: number | null; stock: number;
  category: string; condition: string; imageUrl: string | null; imageUrls: string | null; discountBadge: string | null;
  specifications: string | null; warrantyMonths: number | null; warrantyDetails: string | null; supportDetails: string | null;
  reviews: string | null; deliveryFee: number | null; deliveryDays: string | null;
};

function parseImages(value: string | null, fallback: string | null) {
  try { const images = value ? JSON.parse(value) : []; if (Array.isArray(images)) return images.filter((image): image is string => typeof image === "string").slice(0, 5); } catch {}
  return fallback ? [fallback] : [];
}

const inputClass = "w-full px-4 py-3 rounded-2xl bg-pink-50/40 border border-pink-100/50 text-sm text-[#2d1a26] focus:outline-none focus:border-[#e1467c]";
const labelClass = "block mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#e1467c]";

export default function ProductAdminDetailClient({ product, siteShippingFee }: { product: Product; siteShippingFee: number }) {
  const router = useRouter();
  const existingImages = [...parseImages(product.imageUrls, product.imageUrl), "", "", "", "", ""].slice(0, 5);
  const [form, setForm] = useState({
    name: product.name, description: product.description, price: String(product.price), originalPrice: product.originalPrice == null ? "" : String(product.originalPrice), stock: String(product.stock), category: product.category, condition: product.condition, discountBadge: product.discountBadge || "", imageUrls: existingImages,
    specifications: product.specifications || "", warrantyMonths: product.warrantyMonths == null ? "" : String(product.warrantyMonths), warrantyDetails: product.warrantyDetails || "", supportDetails: product.supportDetails || "", reviews: product.reviews || "", deliveryFee: product.deliveryFee == null ? "" : String(product.deliveryFee), deliveryDays: product.deliveryDays || "3-5 business days",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]; if (!file) return; setUploading(index);
    const data = new FormData(); data.append("file", file);
    try { const response = await fetch("/api/upload", { method: "POST", body: data }); const result = await response.json(); if (result.url) setForm((current) => ({ ...current, imageUrls: current.imageUrls.map((image, imageIndex) => imageIndex === index ? result.url : image) })); else alert(result.error || "Upload failed"); } catch { alert("Upload failed"); } finally { setUploading(null); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true);
    try { const response = await fetch(`/api/admin/products/${product.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, imageUrl: form.imageUrls.find(Boolean) || null }) }); if (!response.ok) throw new Error(); router.refresh(); alert("Product saved successfully"); } catch { alert("Could not save product"); } finally { setSaving(false); }
  };

  return <form onSubmit={save} className="space-y-6">
    <div className="flex items-center justify-between gap-4"><div><Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#e1467c] mb-3"><ArrowLeft className="w-4 h-4" /> Back to Products</Link><h1 className="text-3xl font-black text-[#2d1a26]">Manage Product</h1><p className="text-sm text-[#4a1a2e]/50 mt-1">Edit every customer-facing section for this item.</p></div><button disabled={saving} className="clay-btn px-5 py-3 text-white font-bold flex items-center gap-2"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Product"}</button></div>

    <section className="clay-card p-6 space-y-5"><h2 className="text-xl font-black text-[#2d1a26]">Basic details & overview</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={labelClass}>Product name</label><input className={inputClass} value={form.name} onChange={e => set("name", e.target.value)} required /></div><div><label className={labelClass}>Category</label><input className={inputClass} value={form.category} onChange={e => set("category", e.target.value)} required /></div></div><div><label className={labelClass}>Overview / description</label><textarea className={inputClass} rows={5} value={form.description} onChange={e => set("description", e.target.value)} required /></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className={labelClass}>Price (₹)</label><input className={inputClass} type="number" value={form.price} onChange={e => set("price", e.target.value)} required /></div><div><label className={labelClass}>Original price (₹)</label><input className={inputClass} type="number" value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} /></div><div><label className={labelClass}>Badge</label><input className={inputClass} value={form.discountBadge} onChange={e => set("discountBadge", e.target.value)} placeholder="Optional" /></div></div></section>

    <section className="clay-card p-6 space-y-5"><div><h2 className="text-xl font-black text-[#2d1a26]">Product gallery</h2><p className="text-xs text-[#4a1a2e]/50 mt-1">The first two images are used in shop and featured cards.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{form.imageUrls.map((image, index) => <div key={index} className="rounded-2xl bg-pink-50/30 border border-pink-100/50 p-3"><label className={labelClass}>Image {index + 1}</label><input className={inputClass} value={image} onChange={e => setForm(current => ({ ...current, imageUrls: current.imageUrls.map((currentImage, imageIndex) => imageIndex === index ? e.target.value : currentImage) }))} placeholder="Image URL" /><div className="relative mt-2"><input type="file" accept="image/*" onChange={e => uploadImage(e, index)} className="absolute inset-0 opacity-0 cursor-pointer" /><div className="rounded-xl border-2 border-dashed border-pink-200 p-2.5 text-center text-xs font-bold text-[#e1467c]"><Upload className="w-4 h-4 inline mr-1" />{uploading === index ? "Uploading..." : "Upload image"}</div></div>{image && <img src={image} alt={`Product image ${index + 1}`} className="mt-2 h-28 w-full rounded-xl object-cover" />}</div>)}</div></section>

    <section className="clay-card p-6 space-y-5"><h2 className="text-xl font-black text-[#2d1a26]">Specifications</h2><p className="text-xs text-[#4a1a2e]/50">Enter one specification per line, for example: <code>RAM: 16GB</code></p><textarea className={inputClass} rows={7} value={form.specifications} onChange={e => set("specifications", e.target.value)} placeholder="Processor: Core i5\nRAM: 16GB\nStorage: 512GB SSD" /></section>

    <section className="clay-card p-6 space-y-5"><h2 className="text-xl font-black text-[#2d1a26]">Warranty & support</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={labelClass}>Warranty months</label><input className={inputClass} type="number" min="0" value={form.warrantyMonths} onChange={e => set("warrantyMonths", e.target.value)} placeholder="6" /></div><div><label className={labelClass}>Support details</label><input className={inputClass} value={form.supportDetails} onChange={e => set("supportDetails", e.target.value)} placeholder="WhatsApp or email support details" /></div></div><div><label className={labelClass}>Warranty details</label><textarea className={inputClass} rows={4} value={form.warrantyDetails} onChange={e => set("warrantyDetails", e.target.value)} placeholder="What this warranty covers" /></div></section>

    <section className="clay-card p-6 space-y-5"><h2 className="text-xl font-black text-[#2d1a26]">Delivery</h2><p className="text-xs text-[#4a1a2e]/50">Leave the product fee blank to use the site setting: ₹{siteShippingFee.toLocaleString()}.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={labelClass}>Product delivery fee (₹)</label><input className={inputClass} type="number" min="0" value={form.deliveryFee} onChange={e => set("deliveryFee", e.target.value)} placeholder={`Site default ₹${siteShippingFee}`} /></div><div><label className={labelClass}>Delivery time</label><input className={inputClass} value={form.deliveryDays} onChange={e => set("deliveryDays", e.target.value)} /></div></div></section>

    <section className="clay-card p-6 space-y-3"><h2 className="text-xl font-black text-[#2d1a26]">Reviews</h2><p className="text-xs text-[#4a1a2e]/50">Edit the review content shown in the Reviews tab.</p><textarea className={inputClass} rows={7} value={form.reviews} onChange={e => set("reviews", e.target.value)} placeholder="Customer reviews or review summary" /></section>
  </form>;
}
