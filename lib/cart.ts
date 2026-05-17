export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  size?: string;
  image: string;
  quantity: number;
  color?: string;
  templateDescription?: string;
};

const CART_KEY = "ressential_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const existingItem = cart.find(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.color === item.color &&
      cartItem.templateDescription === item.templateDescription
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}