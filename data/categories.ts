export type Category = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  {
    id: "soy-candles",
    title: "Soy Candles",
    description: "Luxury handmade soy candles with elegant scents and premium details.",
    image: "/images/candle1.jpeg",
  },
  {
    id: "resin-art",
    title: "Resin Art",
    description: "Unique resin art pieces crafted with flowers, glitter and gold details.",
    image: "/images/resin1.jpeg",
  },
  {
    id: "wedding-baptism",
    title: "Wedding & Baptism",
    description: "Personalized keepsakes for weddings, baptisms and special occasions.",
    image: "/images/gift1.jpeg",
  },
  {
    id: "personalized-gifts",
    title: "Personalized Gifts",
    description: "Custom handmade gifts with names, dates, symbols and emotional details.",
    image: "/images/gallery2.jpeg",
  },
  {
    id: "seasonal-collection",
    title: "Seasonal Collection",
    description: "Limited seasonal creations for Christmas, Easter and special moments.",
    image: "/images/gallery10.jpeg",
  },
  {
    id: "custom-creations",
    title: "Custom Creations",
    description: "Design your own handmade piece from scratch with premium customization.",
    image: "/images/gallery7.jpeg",
  },
];