export type Product = {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge: string;
  isBestSeller: boolean;
};

export const products: Product[] = [
  {
    id: "luxury-soy-candle",
    name: "Luxury Soy Candle",
    categoryId: "soy-candles",
    category: "Soy Candles",
    price: 28,
    image: "/images/candle1.jpeg",
    description: "Handmade soy candle with elegant finishing and premium details.",
    badge: "Best Seller",
    isBestSeller: true,
  },
  {
    id: "personalized-resin-gift",
    name: "Personalized Resin Gift",
    categoryId: "resin-art",
    category: "Resin Art",
    price: 35,
    image: "/images/resin1.jpeg",
    description: "A custom resin creation designed with colors, flowers and personal details.",
    badge: "Customizable",
    isBestSeller: false,

  },
  {
    id: "wedding-baptism-keepsake",
    name: "Wedding & Baptism Keepsake",
    categoryId: "wedding-baptism",
    category: "Wedding & Baptism",
    price: 45,
    image: "/images/gift1.jpeg",
    description: "Elegant handmade keepsake for weddings, baptisms and meaningful occasions.",
    badge: "Premium",
    isBestSeller: false,
  },
];