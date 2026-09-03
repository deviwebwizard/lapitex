const galleryImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000",
];

export function getProductImages(imageUrl: string | null, productId: string, count: number) {
  const fallback = galleryImages.map((_, index) => galleryImages[(index + productId.length) % galleryImages.length]);
  return Array.from(new Set([imageUrl, ...fallback].filter((image): image is string => Boolean(image)))).slice(0, count);
}
