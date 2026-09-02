export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  category: string;
  condition: string;
  imageUrl: string | null;
  discountBadge: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};
