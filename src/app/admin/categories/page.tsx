"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ListTree, ChevronRight, Save, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children: Category[];
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", parentId: "" });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          parentId: formData.parentId || null
        })
      });

      if (res.ok) {
        resetForm();
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may break child categories or products linked to this slug.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", slug: "", parentId: "" });
  };

  const startEdit = (cat: Category) => {
    setIsAdding(true);
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug, parentId: cat.parentId || "" });
  };

  const startAddChild = (parentId: string) => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: "", slug: "", parentId });
  };

  // Helper to flatten categories for the parent dropdown
  const getFlatCategories = (cats: Category[], prefix = ""): { id: string, name: string }[] => {
    let result: { id: string, name: string }[] = [];
    for (const cat of cats) {
      result.push({ id: cat.id, name: `${prefix}${cat.name}` });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(getFlatCategories(cat.children, `${prefix}-- `));
      }
    }
    return result;
  };
  const flatCats = getFlatCategories(categories);

  const renderTree = (cats: Category[], depth = 0) => {
    return cats.map(cat => (
      <div key={cat.id} className="mb-2">
        <div className={`flex items-center justify-between p-3 bg-white border border-pink-100 rounded-xl shadow-sm ${depth > 0 ? 'ml-6 border-l-4 border-l-[#e1467c]' : ''}`}>
          <div className="flex items-center gap-3">
            {depth > 0 && <ChevronRight className="w-4 h-4 text-pink-300" />}
            <div>
              <p className="font-bold text-[#2d1a26]">{cat.name}</p>
              <p className="text-[10px] text-gray-400 font-mono">/{cat.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => startAddChild(cat.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Sub
            </button>
            <button onClick={() => startEdit(cat)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {cat.children && cat.children.length > 0 && (
          <div className="mt-2">
            {renderTree(cat.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2d1a26] tracking-tight flex items-center gap-2">
            <ListTree className="text-[#e1467c]" />
            Category Management
          </h1>
          <p className="text-sm text-[#4a1a2e]/60 mt-1">Manage nested categories for the main navigation</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="clay-btn px-4 py-2 text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Root Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass-card p-6 rounded-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#2d1a26]">{editingId ? "Edit Category" : "New Category"}</h3>
            <button onClick={resetForm} className="text-[#4a1a2e]/50 hover:text-[#2d1a26]"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4a1a2e]/70 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  // auto-generate slug if it's new
                  if (!editingId && !formData.slug) {
                    setFormData({ ...formData, name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                  } else {
                    setFormData({ ...formData, name: val });
                  }
                }}
                className="w-full px-3 py-2 bg-white/70 border border-[#4a1a2e]/15 rounded-xl text-[#2d1a26] placeholder:text-[#4a1a2e]/40 focus:outline-none focus:border-[#e1467c]"
                placeholder="e.g. Laptops"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4a1a2e]/70 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 border border-[#4a1a2e]/15 rounded-xl text-[#2d1a26] placeholder:text-[#4a1a2e]/40 focus:outline-none focus:border-[#e1467c]"
                placeholder="e.g. laptops"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4a1a2e]/70 mb-1">Parent (Optional)</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 border border-[#4a1a2e]/15 rounded-xl text-[#2d1a26] focus:outline-none focus:border-[#e1467c] [&>option]:text-black"
              >
                <option value="">None (Root Category)</option>
                {flatCats.map(c => (
                  <option key={c.id} value={c.id} disabled={c.id === editingId}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSave} className="clay-btn px-6 py-2 text-sm font-bold text-white flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Category
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-[#4a1a2e]/50 text-center py-12 animate-pulse">Loading categories...</div>
      ) : (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-[#4a1a2e]/60">No categories found. Create a root category to begin.</div>
          ) : (
            <div className="space-y-4">
              {renderTree(categories)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
