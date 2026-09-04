const galleryImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000",
];

const categoryImages: Record<string, string[]> = {
  Laptops: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000",
  ],
  Desktops: [
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1000",
  ],
  Parts: [
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1597849005986-8f3bb6ce1381?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1624434207284-727de9e22312?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=1000",
  ],
};

export function getProductImages(imageUrl: string | null, productId: string, count: number, imageUrls?: string | null, category?: string) {
  const categoryFallback = categoryImages[category || ""] || galleryImages;
  const fallback = categoryFallback.map((_, index) => categoryFallback[(index + productId.length) % categoryFallback.length]);
  let uploadedImages: string[] = [];
  if (imageUrls) {
    try {
      const parsed = JSON.parse(imageUrls);
      if (Array.isArray(parsed)) uploadedImages = parsed.filter((image): image is string => typeof image === "string" && Boolean(image));
    } catch { /* Keep legacy single-image behavior for malformed data. */ }
  }
  return Array.from(new Set([...uploadedImages, imageUrl, ...fallback].filter((image): image is string => Boolean(image)))).slice(0, count);
}
